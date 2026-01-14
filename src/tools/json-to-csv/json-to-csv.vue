<script setup lang="ts">
import JSON5 from 'json5';
import { convertArrayToCsv } from './json-to-csv.service';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const defaultValue = '[\n  { "姓名": "张三", "年龄": 18, "城市": "北京", "是否购买": "否" },\n  { "姓名": "李四", "年龄": 19, "城市": "上海", "是否购买": "是" }\n]';

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return convertArrayToCsv({ array: JSON5.parse(value) });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-csv.invalidJson'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-csv.inputLabel')"
    :input-placeholder="t('tools.json-to-csv.inputPlaceholder')"
    :input-default="defaultValue"
    :output-label="t('tools.json-to-csv.outputLabel')"
    output-language="csv"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
