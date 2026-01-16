-- 工具使用次数：按日统计（工具进入/点击计数）。

CREATE TABLE IF NOT EXISTS tool_usage_daily (
  tool_id      VARCHAR(64) NOT NULL,
  usage_date   DATE        NOT NULL,
  usage_count  INT         NOT NULL DEFAULT 0,
  updated_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (tool_id, usage_date),
  CONSTRAINT fk_tool_usage_daily_tool
    FOREIGN KEY (tool_id) REFERENCES tools(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
