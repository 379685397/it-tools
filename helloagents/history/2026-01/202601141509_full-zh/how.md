# 方案
- 默认语言：`src/plugins/i18n.plugin.ts` 将 `locale` 设为 `zh`，保持 legacy false；如需要可加 `fallbackLocale: 'en'`。
- 语言选择器：`src/modules/i18n/components/locale-selector.vue` 占位符与选项文案改为 i18n，移出硬编码英文。
- 常见页面标题/提示：已部分中文化；继续排查公共组件/错误提示的硬编码英文，集中迁入 `locales/en.yml`、`locales/zh.yml`。
- 覆盖范围优先级：导航/布局/选择器/错误提示 > 常用工具入口提示。
- 验证：手动切换语言检查首页、命令面板、语言选择器、404/About；必要时 `pnpm lint`。

# 任务拆解
1) 更新 i18n 默认语言与 fallback。
2) 语言选择器：占位符 i18n，选项文案可复用现有字典或改为 i18n key。
3) 搜索并迁移常见硬编码英文提示/错误/标签（主要在 i18n 模块与公共组件）；补充中英翻译。
4) 验证与记录：至少手动检查主要页面；如时间允许运行 lint。
