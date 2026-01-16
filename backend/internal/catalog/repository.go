// Package catalog 提供目录查询的仓储接口与实现。
package catalog

import "context"

type Repository interface {
	GetCatalog(ctx context.Context, locale string) (Catalog, error)
	IncrementToolUsageDaily(ctx context.Context, toolID string) error
}
