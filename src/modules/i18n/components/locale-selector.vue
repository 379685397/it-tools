<script setup lang="ts">
const { locale, t } = useI18n();

const localesLong: Record<string, string> = {
  en: 'English',
  zh: '中文',
};

const allowedLocales = ['zh', 'en'] as const;

const localeOptions = computed(() =>
  allowedLocales.map(l => ({
    label: localesLong[l] ?? l,
    value: l,
  })),
);

watchEffect(() => {
  if (locale.value !== 'zh' && locale.value !== 'en') {
    locale.value = 'zh';
  }
});
</script>

<template>
  <c-select
    v-model:value="locale"
    :options="localeOptions"
    :placeholder="t('i18n.selectPlaceholder')"
    w-100px
  />
</template>
