# 数据模型

## 1. 工具模型

工具元信息的核心类型定义在 `src/tools/tools.types.ts`：

- `Tool`
  - `id`：工具唯一标识（默认由 `path` 推导，形如 `markdown-to-html`）
  - `name`：展示名称（站点展示来源于后端目录接口返回）
  - `path`：路由路径（例如 `/hash-text`）
  - `description`：工具描述（站点展示来源于后端目录接口返回）
  - `keywords`：搜索关键字（用于命令面板/搜索）
  - `component`：异步组件加载函数
  - `icon`：工具图标组件
  - `isNew/createdAt`：新工具标识（由 `defineTool` 计算）
- `ToolCategory`
  - `name`：分类名（代码中为英文，展示侧可经 i18n 映射）
  - `components`：该分类下的工具列表

相关逻辑：
- `src/tools/tool.ts`：`defineTool` 根据 `createdAt` 计算 `isNew`
- `src/tools/index.ts`：聚合分类与工具列表

---

## 2. 国际化语言包结构

语言包位于 `locales/*.yml`，推荐结构：

- `tools.categories.*`：分类名称映射
- `tools.<tool-key>.*`：单工具的标题/描述/标签/占位/示例/提示等
- `ui.*`：公共 UI 组件默认文案（避免工具间重复）

---

## 3. 工具目录后端数据表（MySQL）

目录初始化脚本：
- `backend/sql/001_init.sql`：建表
- `backend/sql/002_seed.sql`：初始化分类/工具/i18n（由脚本生成）
- `backend/sql/004_migrate_tools_json_to_text.sql`：旧库迁移（`tools.redirect_from/keywords` 从 JSON 改为 TEXT）
- `scripts/tool-catalog/generate-seed.mjs`：从前端现有工具清单与 `locales/*.yml` 生成 `002_seed.sql`

实现说明：
- 后端使用 `database/sql` 访问 MySQL，需要在 `main` 包中空白导入 `github.com/go-sql-driver/mysql` 注册驱动。
- 依赖锁定由 `backend/go.mod` 与 `backend/go.sum` 管理。

### 3.1 `tool_categories`

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(64) | PK | 分类业务 id（建议使用 slug） |
| sort_order | INT | NOT NULL | 分类排序 |
| is_enabled | TINYINT(1) | NOT NULL | 是否启用 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

### 3.2 `tool_category_i18n`

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| category_id | VARCHAR(64) | PK(联合) | 分类 id |
| locale | VARCHAR(16) | PK(联合) | 语言（`zh`/`en`） |
| name | VARCHAR(255) | NOT NULL | 分类名称 |
| description | TEXT | NULL | 分类描述 |

### 3.3 `tools`

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(64) | PK | 工具业务 id（推荐与 path 对应，如 `markdown-to-html`） |
| category_id | VARCHAR(64) | FK | 所属分类 |
| path | VARCHAR(255) | UNIQUE | 路由路径（如 `/markdown-to-html`） |
| sort_order | INT | NOT NULL | 分类内排序 |
| is_enabled | TINYINT(1) | NOT NULL | 是否启用 |
| is_new | TINYINT(1) | NOT NULL | 是否新工具（可配；也可由 created_at 推导） |
| created_at | DATETIME | NULL | 创建时间（用于新工具推导） |
| redirect_from | TEXT | NULL | 旧路径数组（可选，存 JSON 文本，如 `["/old-a","/old-b"]`） |
| keywords | TEXT | NULL | 搜索关键字数组（可选，存 JSON 文本，如 `["json","format"]`） |
| icon | VARCHAR(128) | NULL | 图标标识（可选，当前前端以本地 icon 为准） |
| updated_at | DATETIME | NOT NULL | 更新时间 |

### 3.4 `tool_i18n`

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| tool_id | VARCHAR(64) | PK(联合) | 工具 id |
| locale | VARCHAR(16) | PK(联合) | 语言（`zh`/`en`） |
| name | VARCHAR(255) | NOT NULL | 工具名称 |
| description | TEXT | NULL | 工具描述 |

### 3.5 `tool_usage_daily`

用于统计“工具使用次数（按日）”，由前端在工具路由进入时调用 `POST /api/tool-usage` 写入。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| tool_id | VARCHAR(64) | PK(联合) | 工具 id |
| usage_date | DATE | PK(联合) | 统计日期（UTC） |
| usage_count | INT | NOT NULL | 当日使用次数累计 |
| updated_at | DATETIME | NOT NULL | 更新时间 |
