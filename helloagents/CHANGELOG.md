# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增
- 增加工具指南页面（`/guide`），提供“如何新增/维护工具”的统一入口。
- 增加导航入口与命令面板相关多语言文案，提升可发现性。

### 变更
- 默认界面语言调整为中文（`zh`），保留英文（`en`）回退与语言切换。
- 多个工具页面与公共 UI 组件的标签/占位/提示/示例改为可国际化（i18n）文案。
- PWA manifest 默认语言调整为 `zh-CN`。

### 修复
- 复制提示与表单校验提示支持 i18n 动态字符串，避免硬编码英文。
