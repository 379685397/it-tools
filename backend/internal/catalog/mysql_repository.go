// Package catalog 提供基于 MySQL 的目录查询实现。
package catalog

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"
)

type MySQLRepository struct {
	db *sql.DB
}

func NewMySQLRepository(db *sql.DB) *MySQLRepository {
	return &MySQLRepository{db: db}
}

func (r *MySQLRepository) GetCatalog(ctx context.Context, locale string) (Catalog, error) {
	if locale == "" {
		locale = "zh"
	}

	const query = `
SELECT
  c.id,
  c.sort_order,
  COALESCE(ci_req.name, ci_en.name, c.id) AS category_name,
  COALESCE(ci_req.description, ci_en.description) AS category_description,
  t.id,
  t.path,
  t.sort_order,
  t.is_new,
  t.created_at,
  t.redirect_from,
  t.keywords,
  t.icon,
  COALESCE(ti_req.name, ti_en.name, t.id) AS tool_name,
  COALESCE(ti_req.description, ti_en.description) AS tool_description
FROM tool_categories c
LEFT JOIN tool_category_i18n ci_req ON ci_req.category_id = c.id AND ci_req.locale = ?
LEFT JOIN tool_category_i18n ci_en  ON ci_en.category_id  = c.id AND ci_en.locale  = 'en'
JOIN tools t ON t.category_id = c.id AND t.is_enabled = 1
LEFT JOIN tool_i18n ti_req ON ti_req.tool_id = t.id AND ti_req.locale = ?
LEFT JOIN tool_i18n ti_en  ON ti_en.tool_id  = t.id AND ti_en.locale  = 'en'
WHERE c.is_enabled = 1
ORDER BY c.sort_order, t.sort_order
`

	rows, err := r.db.QueryContext(ctx, query, locale, locale)
	if err != nil {
		return Catalog{}, fmt.Errorf("查询目录失败: %w", err)
	}
	defer rows.Close()

	type rowData struct {
		categoryID          string
		categorySortOrder   int
		categoryName        string
		categoryDescription sql.NullString

		toolID          string
		toolPath        string
		toolSortOrder   int
		toolIsNew       bool
		toolCreatedAt   sql.NullTime
		toolRedirectFrom sql.NullString
		toolKeywords    sql.NullString
		toolIcon        sql.NullString
		toolName        string
		toolDescription sql.NullString
	}

	var orderedCategoryIDs []string
	categoriesByID := make(map[string]*Category)

	for rows.Next() {
		var d rowData
		if err := rows.Scan(
			&d.categoryID,
			&d.categorySortOrder,
			&d.categoryName,
			&d.categoryDescription,
			&d.toolID,
			&d.toolPath,
			&d.toolSortOrder,
			&d.toolIsNew,
			&d.toolCreatedAt,
			&d.toolRedirectFrom,
			&d.toolKeywords,
			&d.toolIcon,
			&d.toolName,
			&d.toolDescription,
		); err != nil {
			return Catalog{}, fmt.Errorf("读取目录数据失败: %w", err)
		}

		category := categoriesByID[d.categoryID]
		if category == nil {
			category = &Category{
				ID:        d.categoryID,
				Name:      d.categoryName,
				SortOrder: d.categorySortOrder,
				Tools:     []Tool{},
			}
			if d.categoryDescription.Valid {
				v := d.categoryDescription.String
				category.Description = &v
			}
			categoriesByID[d.categoryID] = category
			orderedCategoryIDs = append(orderedCategoryIDs, d.categoryID)
		}

		tool := Tool{
			ID:        d.toolID,
			Path:      d.toolPath,
			Name:      d.toolName,
			SortOrder: d.toolSortOrder,
		}

		if d.toolDescription.Valid {
			v := d.toolDescription.String
			tool.Description = &v
		}
		if d.toolCreatedAt.Valid {
			v := d.toolCreatedAt.Time.UTC()
			tool.CreatedAt = &v
			tool.IsNew = d.toolIsNew || time.Since(v) <= 14*24*time.Hour
		} else {
			tool.IsNew = d.toolIsNew
		}
		if d.toolIcon.Valid {
			v := d.toolIcon.String
			tool.Icon = &v
		}

		if keywords, ok := parseJSONStringArray(d.toolKeywords); ok {
			tool.Keywords = keywords
		}
		if redirects, ok := parseJSONStringArray(d.toolRedirectFrom); ok {
			tool.RedirectFrom = redirects
		}

		category.Tools = append(category.Tools, tool)
	}

	if err := rows.Err(); err != nil {
		return Catalog{}, fmt.Errorf("遍历目录数据失败: %w", err)
	}

	result := Catalog{Categories: make([]Category, 0, len(orderedCategoryIDs))}
	for _, id := range orderedCategoryIDs {
		if c := categoriesByID[id]; c != nil {
			result.Categories = append(result.Categories, *c)
		}
	}

	return result, nil
}

func (r *MySQLRepository) IncrementToolUsageDaily(ctx context.Context, toolID string) error {
	if toolID == "" {
		return fmt.Errorf("toolID 不能为空")
	}

	const query = `
INSERT INTO tool_usage_daily (tool_id, usage_date, usage_count)
VALUES (?, UTC_DATE(), 1)
ON DUPLICATE KEY UPDATE
  usage_count = usage_count + 1
`
	if _, err := r.db.ExecContext(ctx, query, toolID); err != nil {
		return fmt.Errorf("写入工具使用次数失败: %w", err)
	}
	return nil
}

func parseJSONStringArray(value sql.NullString) ([]string, bool) {
	if !value.Valid || value.String == "" {
		return nil, false
	}

	var out []string
	if err := json.Unmarshal([]byte(value.String), &out); err != nil {
		return nil, false
	}

	return out, true
}
