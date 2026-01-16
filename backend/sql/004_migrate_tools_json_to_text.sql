-- 迁移 tools 表：将 JSON 类型列改为 TEXT（存 JSON 文本）。
-- 适用场景：数据库已创建过旧版 schema（redirect_from / keywords 为 JSON）。

ALTER TABLE tools
  MODIFY COLUMN redirect_from TEXT NULL,
  MODIFY COLUMN keywords TEXT NULL;

