# 模块：tracker（统计/埋点）

## 1. 目标

- 为站点提供按需启用的统计/事件追踪能力。

---

## 2. 关键文件

- 服务：`src/modules/tracker/tracker.services.ts`
- 类型：`src/modules/tracker/tracker.types.ts`
- 插件入口：`src/plugins/plausible.plugin.ts`

---

## 3. 运行机制（概览）

- Tracker 通过 `inject('plausible')` 获取 plausible 实例。
- 通过 `tracker.trackEvent({ eventName })` 上报事件。
- 当未注入 `plausible` 实例时，Tracker 会降级为 no-op，不影响核心工具功能。
