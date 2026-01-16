// Package config 负责读取环境变量并组装服务运行配置。
package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Addr string

	MySQLDSN          string
	MySQLMaxOpenConns int
	MySQLMaxIdleConns int
	MySQLPingTimeout  time.Duration
}

func Load() Config {
	return Config{
		Addr:              envOr("ADDR", ":8080"),
		MySQLDSN:          envOr("MYSQL_DSN", "root:Fi2pRZNoWhSsbV0O@tcp(124.220.33.71:3306)/it-tool?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci"),
		MySQLMaxOpenConns: envOrInt("MYSQL_MAX_OPEN_CONNS", 10),
		MySQLMaxIdleConns: envOrInt("MYSQL_MAX_IDLE_CONNS", 10),
		MySQLPingTimeout:  envOrDuration("MYSQL_PING_TIMEOUT", 3*time.Second),
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func envOrInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if parsed, err := strconv.Atoi(v); err == nil {
			return parsed
		}
	}
	return fallback
}

func envOrDuration(key string, fallback time.Duration) time.Duration {
	if v := os.Getenv(key); v != "" {
		if parsed, err := time.ParseDuration(v); err == nil {
			return parsed
		}
	}
	return fallback
}
