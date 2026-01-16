<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView, useRoute } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';
import { useToolCatalogStore } from '@/stores/tool-catalog.store';

const route = useRoute();
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));

const { locale, t } = useI18n();

syncRef(
  locale,
  useStorage('locale', locale),
);

const toolCatalogStore = useToolCatalogStore();
const { status, errorMessage } = storeToRefs(toolCatalogStore);

watch(locale, async (newLocale) => {
  await toolCatalogStore.loadCatalog({ locale: String(newLocale) });
}, { immediate: true });
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
      <NNotificationProvider placement="bottom-right">
        <div v-if="status !== 'ready'" class="catalog-blocker">
          <div class="catalog-blocker__content">
            <h1 class="catalog-blocker__title">
              {{ status === 'error' ? t('serviceUnavailable.title') : t('serviceUnavailable.loadingTitle') }}
            </h1>
            <div class="catalog-blocker__desc">
              {{ status === 'error' ? t('serviceUnavailable.description') : t('serviceUnavailable.loadingDescription') }}
            </div>

            <div v-if="status === 'error' && errorMessage" class="catalog-blocker__error">
              {{ errorMessage }}
            </div>

            <div class="catalog-blocker__actions">
              <c-button
                v-if="status === 'error'"
                type="primary"
                @click="toolCatalogStore.loadCatalog({ locale: String(locale) })"
              >
                {{ t('serviceUnavailable.retry') }}
              </c-button>
            </div>
          </div>
        </div>
        <component :is="layout" v-else>
          <RouterView />
        </component>
      </NNotificationProvider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style>
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

.catalog-blocker {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.catalog-blocker__content {
  max-width: 520px;
  width: 100%;
}

.catalog-blocker__title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
}

.catalog-blocker__desc {
  margin-top: 10px;
  opacity: 0.75;
}

.catalog-blocker__error {
  margin-top: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
  opacity: 0.7;
  word-break: break-word;
}

.catalog-blocker__actions {
  margin-top: 16px;
}
</style>
