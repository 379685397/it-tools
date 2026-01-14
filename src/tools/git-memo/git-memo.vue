<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import Memo from './git-memo.content.md';
import MemoZh from './git-memo.content.zh.md';

const themeVars = useThemeVars();
const { locale } = useI18n();

const contentComponent = computed(() => (locale.value?.toString().startsWith('zh') ? MemoZh : Memo));
</script>

<template>
  <div>
    <component :is="contentComponent" />
  </div>
</template>

<style lang="less" scoped>
::v-deep(pre) {
  margin: 0;
  padding: 15px 22px;
  background-color: v-bind('themeVars.cardColor');
  border-radius: 4px;
  overflow: auto;
}
</style>
