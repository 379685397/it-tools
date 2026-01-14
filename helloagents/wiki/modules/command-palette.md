# 模块：command-palette（命令面板）

## 1. 目标

- 提供快捷搜索与跳转能力，提升工具可发现性。

---

## 2. 关键文件

- 组件：`src/modules/command-palette/command-palette.vue`
- Store：`src/modules/command-palette/command-palette.store.ts`
- 类型：`src/modules/command-palette/command-palette.types.ts`
- 选项渲染：`src/modules/command-palette/components/command-palette-option.vue`

---

## 3. i18n 注意事项

- 搜索框占位等展示文案应使用 i18n（避免硬编码英文）。
- 工具条目名称/描述优先来自 `tools.<tool-key>.*`。

