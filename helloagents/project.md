# 项目技术约定（SSOT）

本文件记录项目的关键技术约定与协作规则。当本文档与代码不一致时，以代码为准并及时同步更新本文档。

---

## 1. 技术栈

- **前端框架:** Vue 3
- **构建工具:** Vite
- **语言:** TypeScript
- **UI 组件库:** Naive UI
- **样式方案:** UnoCSS
- **国际化:** vue-i18n（YAML 语言包，经 `@intlify/unplugin-vue-i18n` 编译）
- **状态管理:** Pinia（按需）
- **工具库:** @vueuse/core、date-fns 等
- **测试:** Vitest（单元）、Playwright（E2E）
- **包管理器:** pnpm
- **后端服务:** Go（`backend/`）+ MySQL（工具目录配置与下发）
- **本地联调/一键启动:** Docker Compose（`docker-compose.yml`）

---

## 2. 常用命令

- 开发：`pnpm dev`
- 构建：`pnpm build`
- 预览：`pnpm preview --port 5050`
- Lint：`pnpm lint`
- 单元测试：`pnpm test:unit`
- E2E 测试：`pnpm test:e2e`
- 后端启动（本地）：`cd backend && MYSQL_DSN="user:pass@tcp(127.0.0.1:3306)/it_tools?parseTime=true" go run ./cmd/server`
- 一键启动（推荐）：`docker compose up --build`（前端: `http://localhost:8081`，后端: `http://localhost:8080`）

---

## 3. 国际化（i18n）约定

### 3.1 默认语言与回退

- 默认语言：中文（`zh`）
- 回退语言：英文（`en`）
- 配置位置：`src/plugins/i18n.plugin.ts`

### 3.2 文案存放与键名规则

- 语言包目录：`locales/*.yml`
- 工具元信息（标题/描述）统一使用：
  - `tools.<tool-key>.title`
  - `tools.<tool-key>.description`
- 工具内 UI 文案建议继续挂在 `tools.<tool-key>.*` 下，避免散落到 `ui.*`（公共组件例外）。
- 公共 UI 组件默认文案挂在 `ui.*`（例如输入框占位、选择器“无结果”、文件上传按钮等）。

### 3.3 代码侧使用规范

- 工具注册（`src/tools/**/index.ts`）：
  - 使用 `translate('tools.<tool-key>.title')` / `translate('tools.<tool-key>.description')`
  - 说明：若 key 不存在，`translate` 会返回 key 本身，便于发现缺漏。
- 工具页面（`src/tools/**.vue`）：
  - 使用 `const { t } = useI18n()` + `t('...')`
  - 不要在模板/脚本中写死英文（标签、占位、提示、报错、示例）。
- 校验与复制提示：
  - 校验消息建议传入函数：`message: () => t('...')`
  - 复制提示建议传入：`notificationMessage: t('...')`

---

## 4. 新增/维护工具约定

- 每个工具一个目录：`src/tools/<tool-dir>/`
- 约定文件：
  - `index.ts`：工具元信息（name/path/description/keywords/component/icon）
  - `<tool>.vue`：工具 UI 与交互逻辑
- 新增工具推荐使用脚本：`pnpm script:create:tool`
- 工具说明文档与维护指南入口：`src/pages/tool-guide.page.md`（路由：`/guide`）
