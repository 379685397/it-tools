# API 手册

## 概述

本项目为纯前端工具站点，默认不提供自建后端 API。

---

## 外部服务（按需）

### 统计/埋点（Plausible）

- 位置：
  - 插件：`src/plugins/plausible.plugin.ts`
  - Tracker 服务：`src/modules/tracker/*`
- 行为：在启用统计的场景下，上报页面访问/事件等。
- 注意：若未注入 `plausible` 实例，相关追踪能力应避免影响核心工具功能。

