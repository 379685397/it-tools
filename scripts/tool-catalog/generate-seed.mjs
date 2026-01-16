/**
 * 生成 MySQL 初始化数据（分类/工具/i18n），用于后端目录接口。
 * 数据源：
 * - 分类与工具顺序：`src/tools/index.ts`
 * - 工具 path/keywords/redirectFrom/createdAt：`src/tools/<tool-dir>/index.ts`
 * - 中英文标题/描述：`locales/zh.yml`、`locales/en.yml`
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const repoRoot = process.cwd();

const toolsIndexPath = path.join(repoRoot, 'src/tools/index.ts');
const zhPath = path.join(repoRoot, 'locales/zh.yml');
const enPath = path.join(repoRoot, 'locales/en.yml');

const toolsIndex = readFileSync(toolsIndexPath, 'utf8');
const zh = YAML.parse(readFileSync(zhPath, 'utf8'));
const en = YAML.parse(readFileSync(enPath, 'utf8'));

const importMap = parseToolImports(toolsIndex);
const categories = parseToolCategories(toolsIndex);

const zhCategoryNames = zh?.tools?.categories ?? {};
const enCategoryNames = en?.tools?.categories ?? {};

const categoryRows = categories.map((category, index) => {
  const categoryId = slugify(category.name);
  const zhName = getI18nCategoryName(zhCategoryNames, category.name);
  const enName = getI18nCategoryName(enCategoryNames, category.name);

  return {
    id: categoryId,
    sortOrder: index + 1,
    zhName,
    enName,
  };
});

const toolRows = [];
for (const category of categories) {
  const categoryId = slugify(category.name);
  for (let i = 0; i < category.tools.length; i++) {
    const toolVar = category.tools[i];
    const toolDir = importMap.get(toolVar);
    if (!toolDir) {
      throw new Error(`未找到工具导入映射: ${toolVar}`);
    }

    const toolIndexFile = path.join(repoRoot, 'src/tools', toolDir, 'index.ts');
    const toolIndex = readFileSync(toolIndexFile, 'utf8');
    const meta = parseToolMeta(toolIndex, toolIndexFile);

    const toolId = meta.path.replace(/^\//, '');
    const zhTitle = zh?.tools?.[toolId]?.title ?? toolId;
    const zhDesc = zh?.tools?.[toolId]?.description ?? null;
    const enTitle = en?.tools?.[toolId]?.title ?? toolId;
    const enDesc = en?.tools?.[toolId]?.description ?? null;

    toolRows.push({
      id: toolId,
      categoryId,
      path: meta.path,
      sortOrder: i + 1,
      keywords: meta.keywords,
      redirectFrom: meta.redirectFrom,
      createdAt: meta.createdAt,
      zhTitle,
      zhDesc,
      enTitle,
      enDesc,
    });
  }
}

process.stdout.write(renderSQL({ categoryRows, toolRows }));

function parseToolImports(source) {
  const map = new Map();
  const re = /import\s+\{\s*tool\s+as\s+(\w+)\s*\}\s+from\s+'\.\/([^']+)'\s*;/g;
  for (const m of source.matchAll(re)) {
    map.set(m[1], m[2]);
  }
  return map;
}

function parseToolCategories(source) {
  const startToken = 'export const toolsByCategory';
  const startIndex = source.indexOf(startToken);
  if (startIndex === -1) {
    throw new Error('未找到 toolsByCategory 定义');
  }

  const section = source.slice(startIndex);
  const re = /\{\s*name:\s*'([^']+)'\s*,\s*components:\s*\[/g;
  const result = [];

  for (const m of section.matchAll(re)) {
    const name = m[1];
    const arrayStart = section.indexOf('[', m.index);
    const arrayEnd = findMatchingBracket(section, arrayStart, '[', ']');
    const arrayContent = section.slice(arrayStart + 1, arrayEnd);
    const tools = arrayContent
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    result.push({ name, tools });
  }

  if (result.length === 0) {
    throw new Error('未解析到任何分类');
  }

  return result;
}

function findMatchingBracket(text, startIndex, openChar, closeChar) {
  let depth = 0;
  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (ch === openChar) depth++;
    if (ch === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error('括号未闭合');
}

function parseToolMeta(source, filePathForErrors) {
  const pathMatch = source.match(/\bpath:\s*['"]([^'"]+)['"]/);
  if (!pathMatch) {
    throw new Error(`未解析到 path: ${filePathForErrors}`);
  }

  return {
    path: pathMatch[1],
    keywords: parseStringArrayAfterKey(source, 'keywords'),
    redirectFrom: parseStringArrayAfterKey(source, 'redirectFrom'),
    createdAt: parseCreatedAt(source),
  };
}

function parseCreatedAt(source) {
  const m = source.match(/\bcreatedAt:\s*new\s+Date\(['"]([^'"]+)['"]\)/);
  return m ? m[1] : null;
}

function parseStringArrayAfterKey(source, key) {
  const keyIndex = source.indexOf(`${key}:`);
  if (keyIndex === -1) return [];

  const after = source.slice(keyIndex);
  const openIndex = after.indexOf('[');
  if (openIndex === -1) return [];
  const closeIndex = findMatchingBracket(after, openIndex, '[', ']');
  const arrayRaw = after.slice(openIndex + 1, closeIndex);

  const out = [];
  const re = /['"]([^'"]+)['"]/g;
  for (const m of arrayRaw.matchAll(re)) {
    out.push(m[1]);
  }

  return out;
}

function getI18nCategoryName(map, name) {
  return map?.[name] ?? map?.[name.toLowerCase()] ?? map?.[name.toUpperCase()] ?? name;
}

function slugify(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNullableString(value) {
  return value == null || value === '' ? 'NULL' : sqlString(value);
}

function sqlJSONText(value) {
  if (!value || value.length === 0) return 'NULL';
  return sqlString(JSON.stringify(value));
}

function renderSQL({ categoryRows, toolRows }) {
  const lines = [];
  lines.push('-- 自动生成：scripts/tool-catalog/generate-seed.mjs');
  lines.push('SET NAMES utf8mb4;');
  lines.push('START TRANSACTION;');
  lines.push('');

  lines.push('-- 分类');
  lines.push(
    'INSERT INTO tool_categories (id, sort_order, is_enabled) VALUES',
  );
  lines.push(
    categoryRows
      .map(r => `  (${sqlString(r.id)}, ${r.sortOrder}, 1)`)
      .join(',\n') + '\n' +
      'ON DUPLICATE KEY UPDATE sort_order=VALUES(sort_order), is_enabled=VALUES(is_enabled);',
  );
  lines.push('');

  lines.push('-- 分类 i18n');
  lines.push('INSERT INTO tool_category_i18n (category_id, locale, name, description) VALUES');
  lines.push(
    categoryRows
      .flatMap(r => ([
        `  (${sqlString(r.id)}, 'zh', ${sqlString(r.zhName)}, NULL)`,
        `  (${sqlString(r.id)}, 'en', ${sqlString(r.enName)}, NULL)`,
      ]))
      .join(',\n') + '\n' +
      'ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);',
  );
  lines.push('');

  lines.push('-- 工具');
  lines.push('INSERT INTO tools (id, category_id, path, sort_order, is_enabled, is_new, created_at, redirect_from, keywords, icon) VALUES');
  lines.push(
    toolRows
      .map((r) => {
        const createdAt = r.createdAt ? `${sqlString(`${r.createdAt} 00:00:00`)}` : 'NULL';
        return `  (${sqlString(r.id)}, ${sqlString(r.categoryId)}, ${sqlString(r.path)}, ${r.sortOrder}, 1, 0, ${createdAt}, ${sqlJSONText(r.redirectFrom)}, ${sqlJSONText(r.keywords)}, NULL)`;
      })
      .join(',\n') + '\n' +
      'ON DUPLICATE KEY UPDATE category_id=VALUES(category_id), path=VALUES(path), sort_order=VALUES(sort_order), is_enabled=VALUES(is_enabled), is_new=VALUES(is_new), created_at=VALUES(created_at), redirect_from=VALUES(redirect_from), keywords=VALUES(keywords), icon=VALUES(icon);',
  );
  lines.push('');

  lines.push('-- 工具 i18n');
  lines.push('INSERT INTO tool_i18n (tool_id, locale, name, description) VALUES');
  lines.push(
    toolRows
      .flatMap(r => ([
        `  (${sqlString(r.id)}, 'zh', ${sqlString(r.zhTitle)}, ${sqlNullableString(r.zhDesc)})`,
        `  (${sqlString(r.id)}, 'en', ${sqlString(r.enTitle)}, ${sqlNullableString(r.enDesc)})`,
      ]))
      .join(',\n') + '\n' +
      'ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);',
  );
  lines.push('');

  lines.push('COMMIT;');
  lines.push('');
  return lines.join('\n');
}
