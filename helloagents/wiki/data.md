# 数据模型

## 1. 工具模型

工具元信息的核心类型定义在 `src/tools/tools.types.ts`：

- `Tool`
  - `name`：展示名称（通常来自 i18n）
  - `path`：路由路径（例如 `/hash-text`）
  - `description`：工具描述（通常来自 i18n）
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

