# 方案概述
- 采用“文档+站内入口+全局 i18n 整理”三部分并行推进：
  1) 文档：新增工具指南 Markdown，按分类列出工具名称、功能简介、关键参数/输出，并在 README 中挂载链接。
  2) 可发现性：在站点导航/首页添加“工具指南”入口（指向静态路由或外部文档），便于用户快速查找。
  3) 文案与 i18n：排查硬编码英文（布局、首页、Command Palette、PWA manifest），移入 locales/zh.yml，并保证键落在统一命名空间。

# 文档与信息结构
- 新增文档：`docs/tool-guide.md`（中文），包含：
  - 简介与使用方式（如何搜索/收藏/命令面板）。
  - 分类清单：按 `tools/index.ts` 顺序列出分类、工具名、功能一句话。
  - 维护约定：新增工具时的同步步骤（注册、文档、翻译、测试）。
- README 更新：添加“功能概览 / 工具指南”章节，链接 `docs/tool-guide.md`，补充中文简介。
- 站内入口：在侧栏或顶栏增加“工具指南”链接（若为外链则 target=_blank）。

# i18n 整理策略
- 扫描常用入口与展示层的硬编码英文：
  - 布局：`src/layouts/base.layout.vue`、导航按钮/支持按钮/页脚版本信息。
  - 首页：`src/pages/Home.page.vue`（标题、提示文案）。
  - Command Palette 等公共组件：`src/modules/command-palette/**`（如有英文占位）。
  - PWA manifest 语言/名称：`vite.config.ts` 将 `lang: 'fr-FR'` 调整为 zh-CN 或从 locale 推断。
- 规则：所有新文案写入 `locales/en.yml`（保持英文基线）与 `locales/zh.yml`，key 参考现有命名空间（如 `home.*`、`tools.*`），避免直接硬编码。

# 质量与验证
- Lint/typecheck：`pnpm lint`，必要时 `pnpm typecheck`。
- 关键路径人工自测：导航入口显示中文；指南链接可访问；PWA manifest `lang` 为 zh-CN（或随 locale）；未找到缺失翻译。

# 里程碑与交付物
- M1 文档草稿：`docs/tool-guide.md` + README 链接。
- M2 可发现性：导航/首页入口指向指南。
- M3 i18n 整理：硬编码英文移入 locales，PWA lang 调整，验证通过。
- 附加：维护流程写入指南末尾，提醒新增工具需同步文档与翻译。
