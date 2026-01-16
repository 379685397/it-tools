# API 手册

## 概述

本项目默认采用 **Nginx 静态托管前端**，并新增 **Go 后端服务**提供工具目录能力。

后端 API 主要用于：
- 管理并下发“工具分类 + 分类下工具列表 + 排序 + 启用状态”
- 向前端返回工具完整元信息（名称/描述/关键字等），前端据此渲染首页/菜单/命令面板

> 注意：按当前约定，**后端不可用则前端不可用**（不做本地回退）。

---

## 自建后端 API

### 健康检查

#### [GET] `/api/health`
**描述:** 后端健康检查

**响应:**
```json
{ "status": "ok" }
```

### 工具目录

#### [GET] `/api/catalog`
**描述:** 获取工具目录（分类 + 工具完整元信息 + 排序）

**请求参数:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| locale | string | 否 | 语言，当前支持 `zh`/`en`；其他值将归一化为 `en` |

**响应:**
```json
{
  "categories": [
    {
      "id": "converter",
      "name": "转换器",
      "description": null,
      "sortOrder": 3,
      "tools": [
        {
          "id": "markdown-to-html",
          "path": "/markdown-to-html",
          "name": "Markdown 转 HTML",
          "description": "将 Markdown 转换为 HTML。",
          "keywords": ["markdown", "html", "converter"],
          "redirectFrom": [],
          "icon": null,
          "isNew": false,
          "createdAt": "2024-08-25T00:00:00Z",
          "sortOrder": 12
        }
      ]
    }
  ]
}
```

### 工具使用次数

#### [POST] `/api/tool-usage`
**描述:** 记录工具使用次数（按日统计，每次调用计数 +1）

**请求:**
```json
{ "toolId": "json-prettify" }
```

**响应:**
- `204 No Content`

**错误响应:**
- `400 Bad Request`：缺少或非法 `toolId` / 非法 JSON
- `500 Internal Server Error`：数据库错误

---

## 外部服务（按需）

### 统计/埋点（Plausible）

- 位置：
  - 插件：`src/plugins/plausible.plugin.ts`
  - Tracker 服务：`src/modules/tracker/*`
- 行为：在启用统计的场景下，上报页面访问/事件等。
- 注意：若未注入 `plausible` 实例，相关追踪能力应避免影响核心工具功能。
