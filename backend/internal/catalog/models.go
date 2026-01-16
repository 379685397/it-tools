// Package catalog 定义工具目录领域模型与仓储接口。
package catalog

import "time"

type Category struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
	SortOrder   int     `json:"sortOrder"`
	Tools       []Tool  `json:"tools"`
}

type Tool struct {
	ID          string     `json:"id"`
	Path        string     `json:"path"`
	Name        string     `json:"name"`
	Description *string    `json:"description,omitempty"`
	Keywords    []string   `json:"keywords,omitempty"`
	RedirectFrom []string  `json:"redirectFrom,omitempty"`
	Icon        *string    `json:"icon,omitempty"`
	IsNew       bool       `json:"isNew"`
	CreatedAt   *time.Time `json:"createdAt,omitempty"`
	SortOrder   int        `json:"sortOrder"`
}

type Catalog struct {
	Categories []Category `json:"categories"`
}

