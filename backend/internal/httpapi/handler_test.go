// Package httpapi 测试 API 路由与基础行为（不依赖真实数据库）。
package httpapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"it-tools-backend/internal/catalog"
	"it-tools-backend/internal/config"
)

type mockRepo struct {
	lastLocale string
	catalog    catalog.Catalog
	err        error

	lastToolID string
}

func (m *mockRepo) GetCatalog(_ context.Context, locale string) (catalog.Catalog, error) {
	m.lastLocale = locale
	return m.catalog, m.err
}

func (m *mockRepo) IncrementToolUsageDaily(_ context.Context, toolID string) error {
	m.lastToolID = toolID
	return m.err
}

func TestHealth(t *testing.T) {
	h := NewHandler(config.Config{}, &mockRepo{})
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rr := httptest.NewRecorder()

	h.Router().ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("期望 %d, 实际 %d", http.StatusOK, rr.Code)
	}
}

func TestCatalogLocaleNormalization(t *testing.T) {
	repo := &mockRepo{catalog: catalog.Catalog{Categories: []catalog.Category{}}}
	h := NewHandler(config.Config{}, repo)

	req := httptest.NewRequest(http.MethodGet, "/api/catalog?locale=fr", nil)
	rr := httptest.NewRecorder()

	h.Router().ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("期望 %d, 实际 %d", http.StatusOK, rr.Code)
	}
	if repo.lastLocale != "en" {
		t.Fatalf("期望 locale 归一化为 en, 实际 %q", repo.lastLocale)
	}
}

func TestToolUsageBadRequest(t *testing.T) {
	repo := &mockRepo{}
	h := NewHandler(config.Config{}, repo)

	req := httptest.NewRequest(http.MethodPost, "/api/tool-usage", strings.NewReader(`{}`))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.Router().ServeHTTP(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Fatalf("期望 %d, 实际 %d", http.StatusBadRequest, rr.Code)
	}
}

func TestToolUsageOK(t *testing.T) {
	repo := &mockRepo{}
	h := NewHandler(config.Config{}, repo)

	req := httptest.NewRequest(http.MethodPost, "/api/tool-usage", strings.NewReader(`{"toolId":"json-prettify"}`))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.Router().ServeHTTP(rr, req)

	if rr.Code != http.StatusNoContent {
		t.Fatalf("期望 %d, 实际 %d", http.StatusNoContent, rr.Code)
	}
	if repo.lastToolID != "json-prettify" {
		t.Fatalf("期望 toolId %q, 实际 %q", "json-prettify", repo.lastToolID)
	}
}
