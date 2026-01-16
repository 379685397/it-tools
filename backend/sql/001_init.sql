-- 初始化工具目录相关表（分类、工具与多语言）。

CREATE TABLE IF NOT EXISTS tool_categories (
  id            VARCHAR(64)  NOT NULL PRIMARY KEY,
  sort_order    INT          NOT NULL DEFAULT 0,
  is_enabled    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tool_category_i18n (
  category_id   VARCHAR(64)  NOT NULL,
  locale        VARCHAR(16)  NOT NULL,
  name          VARCHAR(255) NOT NULL,
  description   TEXT         NULL,
  PRIMARY KEY (category_id, locale),
  CONSTRAINT fk_category_i18n_category
    FOREIGN KEY (category_id) REFERENCES tool_categories(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tools (
  id            VARCHAR(64)  NOT NULL PRIMARY KEY,
  category_id   VARCHAR(64)  NOT NULL,
  path          VARCHAR(255) NOT NULL UNIQUE,
  sort_order    INT          NOT NULL DEFAULT 0,
  is_enabled    TINYINT(1)   NOT NULL DEFAULT 1,
  is_new        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at    DATETIME     NULL,
  redirect_from TEXT         NULL,
  keywords      TEXT         NULL,
  icon          VARCHAR(128) NULL,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tools_category
    FOREIGN KEY (category_id) REFERENCES tool_categories(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tool_i18n (
  tool_id       VARCHAR(64)  NOT NULL,
  locale        VARCHAR(16)  NOT NULL,
  name          VARCHAR(255) NOT NULL,
  description   TEXT         NULL,
  PRIMARY KEY (tool_id, locale),
  CONSTRAINT fk_tool_i18n_tool
    FOREIGN KEY (tool_id) REFERENCES tools(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS idx_categories_sort ON tool_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_tools_category_sort ON tools(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_tools_enabled ON tools(is_enabled);
