// Package httpapi 提供 HTTP API 路由与处理器实现。
package httpapi

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"regexp"
	"time"

	"it-tools-backend/internal/catalog"
	"it-tools-backend/internal/config"
)

type Handler struct {
	cfg  config.Config
	repo catalog.Repository
}

func NewHandler(cfg config.Config, repo catalog.Repository) *Handler {
	return &Handler{cfg: cfg, repo: repo}
}

func (h *Handler) Router() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", h.health)
	mux.HandleFunc("/api/catalog", h.getCatalog)
	mux.HandleFunc("/api/tool-usage", h.postToolUsage)
	return mux
}

func (h *Handler) health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"status": "ok"})
}

func (h *Handler) getCatalog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	locale := r.URL.Query().Get("locale")
	if locale == "" {
		locale = "zh"
	}
	if locale != "zh" && locale != "en" {
		locale = "en"
	}

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	catalogData, err := h.repo.GetCatalog(ctx, locale)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{
			"code":    "internal_error",
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, catalogData)
}

var toolIDRe = regexp.MustCompile(`^[a-z0-9-]{1,64}$`)

type toolUsageRequest struct {
	ToolID string `json:"toolId"`
}

func (h *Handler) postToolUsage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1024)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	var req toolUsageRequest
	if err := dec.Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"code":    "bad_request",
			"message": "请求体不是合法 JSON",
		})
		return
	}
	if err := dec.Decode(&struct{}{}); err != io.EOF {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"code":    "bad_request",
			"message": "请求体包含多余内容",
		})
		return
	}

	if !toolIDRe.MatchString(req.ToolID) {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"code":    "bad_request",
			"message": "缺少或非法 toolId",
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	if err := h.repo.IncrementToolUsageDaily(ctx, req.ToolID); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{
			"code":    "internal_error",
			"message": err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
