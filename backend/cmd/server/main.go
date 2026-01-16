// Package main 启动 it-tools 后端服务，提供工具目录查询等 API。
package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"it-tools-backend/internal/catalog"
	"it-tools-backend/internal/config"
	httpapi "it-tools-backend/internal/httpapi"
)

func main() {
	cfg := config.Load()
	if cfg.MySQLDSN == "" {
		log.Fatal("缺少环境变量 MYSQL_DSN")
	}

	db, err := sql.Open("mysql", cfg.MySQLDSN)
	if err != nil {
		log.Fatalf("打开数据库失败: %v", err)
	}
	defer db.Close()

	db.SetConnMaxLifetime(5 * time.Minute)
	db.SetMaxOpenConns(cfg.MySQLMaxOpenConns)
	db.SetMaxIdleConns(cfg.MySQLMaxIdleConns)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := pingWithTimeout(ctx, db, cfg.MySQLPingTimeout); err != nil {
		log.Fatalf("数据库不可用: %v", err)
	}

	repo := catalog.NewMySQLRepository(db)
	handler := httpapi.NewHandler(cfg, repo)

	server := &http.Server{
		Addr:              cfg.Addr,
		Handler:           handler.Router(),
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("服务启动: %s", cfg.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP 服务异常退出: %v", err)
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_ = server.Shutdown(shutdownCtx)
}

func pingWithTimeout(parent context.Context, db *sql.DB, timeout time.Duration) error {
	ctx, cancel := context.WithTimeout(parent, timeout)
	defer cancel()
	return db.PingContext(ctx)
}
