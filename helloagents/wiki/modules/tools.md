# 模块：tools（工具注册与工具页）

## 1. 目录结构

- `src/tools/`：工具集合
  - `index.ts`：按分类聚合工具列表
  - `tools.types.ts`：工具类型定义
  - `tool.ts`：工具辅助（例如 `isNew` 计算）
  - `/<tool-dir>/`：单个工具目录（`index.ts` + `*.vue` + 可选服务/测试）

---

## 2. 工具注册约定

- 每个工具在 `src/tools/<tool-dir>/index.ts` 导出 `tool`：
  - `name` / `description` 推荐使用 i18n：`translate('tools.<tool-key>.title')`、`translate('tools.<tool-key>.description')`
  - `path` 为路由路径（例如 `/hash-text`）
  - `component` 为懒加载组件
- 分类在 `src/tools/index.ts` 维护，展示名称通过 `tools.categories.*` 本地化。

---

## 3. 工具页文案与示例本地化

### 3.1 目标

- 工具页的标签、占位、提示、报错、示例默认中文展示，并支持语言切换。

### 3.2 实施建议

- 工具页使用 `const { t } = useI18n()`，UI 文案全部使用 `t('tools.<tool-key>.*')`。
- 示例数据优先提供中文示例（格式类示例可保留原始格式，但配中文说明/上下文）。
- 搜索关键字（`keywords`）可同时包含英文与中文关键词，提升中文场景可发现性。

