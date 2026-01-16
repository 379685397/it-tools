# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增
- 新增 Go 后端服务（`backend/`），提供工具目录 API：`/api/catalog`、`/api/health`。
- 新增 MySQL 表结构与初始化数据脚本（`backend/sql/*.sql`），支持分类/工具/排序/启用与中英多语言。
- 新增目录初始化数据生成脚本（`scripts/tool-catalog/generate-seed.mjs`），便于随工具清单更新种子数据。
- 新增工具使用次数按日统计（`backend/sql/003_tool_usage_daily.sql` + `POST /api/tool-usage`），用于记录工具进入/点击次数。

### 变更
- 默认界面语言调整为中文（`zh`），保留英文（`en`）回退与语言切换。
- 多个工具页面与公共 UI 组件的标签/占位/提示/示例改为可国际化（i18n）文案。
- PWA manifest 默认语言调整为 `zh-CN`。
- 首页/菜单/命令面板的工具列表数据源改为后端目录接口（后端不可用则站点不可用）。
- Nginx 增加 `/api/` 反代到后端服务，支持前后端同域部署。
- 首页“全部工具”改为按分类分组展示，收藏/最新区块移动到搜索框下方便于快速进入。
- 首页工具卡片布局更紧凑：图标置于名称前、收藏按钮同列右侧，并整体降低卡片高度。
- SEO 信息增强（中文）：更新 `index.html` 的 canonical/OG，首页/关于/工具页补齐 canonical/OG/robots/JSON-LD，并新增 `public/sitemap.xml` 与 `robots.txt` 的 sitemap 声明。
- `tools.redirect_from`、`tools.keywords` 字段由 `JSON` 改为 `TEXT`（存 JSON 文本），并提供旧库迁移脚本 `backend/sql/004_migrate_tools_json_to_text.sql`。
- 顶部搜索栏下方增加“最近使用”工具快捷入口（本地缓存最近 5 个）。
- 侧边栏顶部品牌区还原绿色渐变背景并加入半透明效果，品牌文字“IT工具网”居中并增大（高度 54px，移动端同样生效）。
- 侧边栏顶部品牌区取消链接下划线，品牌区与工具栏间距收敛为 5px，滚动条从工具列表区域开始。
- 语言下拉框仅保留中文与英文。

### 修复
- 复制提示与表单校验提示支持 i18n 动态字符串，避免硬编码英文。
- 后端服务补齐 MySQL 驱动注册与依赖校验文件，避免启动时报 `unknown driver "mysql"` / 构建时报缺失 `go.sum`。

### 移除
- 删除 UI 库页面（`/c-lib`）与工具指南页面（`/guide`），并移除 GitHub/X/赞助相关入口。
