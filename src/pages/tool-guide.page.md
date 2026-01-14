# 工具指南（IT-Tools）

## 如何快速上手
- 搜索：左侧搜索框或 Command Palette（快捷键 ⌘/Ctrl + K）快速打开工具。
- 收藏：在工具卡片添加到“我的收藏”，首页可拖拽排序。
- 路径：侧栏按分类分组；命令面板可随机跳转或按关键词查找。

## 工具目录（按分类）

### Crypto
- Token generator、Hash text、Bcrypt、UUID/ULID 生成、对称加密（Encryption）、BIP39、HMAC、RSA 密钥、密码强度、PDF 签名校验

### Converter
- 日期时间、进制转换、罗马数字、Base64（字符串/文件）、颜色、大小写、NATO/二进制/Unicode、YAML/JSON/TOML 互转、列表转换、XML/JSON 互转、Markdown 转 HTML

### Web
- URL 编解码/解析、HTML 实体、设备信息、Basic Auth、Meta 标签生成、OTP/JWT、MIME 列表、Keycode、Slug 生成、富文本编辑、UA 解析、HTTP 状态码、JSON Diff、Safelink 解码

### Images & Videos
- 通用二维码、WiFi 二维码、SVG 占位、摄像头录制

### Development
- Git 备忘、随机端口、Crontab 生成、JSON 查看/压缩/转 CSV、SQL 美化、chmod 计算、Docker run→Compose、XML/ YAML 查看、邮件标准化、正则测试/备忘

### Network
- IPv4 子网/地址转换/范围展开、MAC 查询/生成、IPv6 ULA 生成

### Math
- 数学表达式、ETA 预估、百分比计算

### Measurement
- 计时器、温度换算、基准构造

### Text
- Lorem Ipsum、文本统计、Emoji 选择、字符串混淆、文本差异、数词缩写、ASCII 字幅

### Data
- 电话解析与格式化、IBAN 校验与解析

## 维护与新增工具流程
1) 生成骨架：`pnpm run script:create:tool <name>`，自动注册到 `src/tools/index.ts`。
2) 开发与翻译：完善工具功能；在 `locales/en.yml` 和 `locales/zh.yml` 添加标题/描述键（`tools.<toolpath>.title/description`）。
3) 文档同步：如有新工具或分类变更，更新本指南与 README 链接；必要时为工具添加使用说明/注意事项。
4) 质量检查：建议补充单元测试（服务或模型层），`pnpm lint` 与 `pnpm typecheck` 通过后提交。
