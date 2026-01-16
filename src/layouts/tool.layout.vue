<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';

import BaseLayout from './base.layout.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import type { Tool } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';
import { DEFAULT_OG_IMAGE_URL, OG_LOCALE, SITE_NAME, SITE_ORIGIN, getCanonicalUrl } from '@/seo/seo';

const route = useRoute();
const toolStore = useToolStore();

const currentTool = computed(() => toolStore.tools.find(tool => tool.path === route.path));
const toolTitle = computed<string>(() => currentTool.value?.name ?? String(route.meta.name ?? ''));
const toolDescription = computed<string>(() => currentTool.value?.description ?? String(route.meta.description ?? ''));
const canonicalUrl = computed(() => getCanonicalUrl(route.path));
const seoDescription = computed(() => toolDescription.value || `${toolTitle.value} 在线工具，免费使用。`);
const seoKeywords = computed(() => {
  const keywords = ((currentTool.value?.keywords ?? route.meta.keywords ?? []) as string[])
    .filter(Boolean);
  const base = [toolTitle.value, '在线工具', 'IT工具网'];
  return Array.from(new Set([...keywords, ...base])).join(',');
});

const head = computed<HeadObject>(() => ({
  title: `${toolTitle.value} - ${SITE_NAME}`,
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
  ],
  meta: [
    {
      name: 'description',
      content: seoDescription.value,
    },
    {
      name: 'keywords',
      content: seoKeywords.value,
    },
    { name: 'robots', content: 'index,follow' },

    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: OG_LOCALE },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: `${toolTitle.value} - ${SITE_NAME}` },
    { property: 'og:description', content: seoDescription.value },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:image', content: DEFAULT_OG_IMAGE_URL },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': toolTitle.value,
        'description': seoDescription.value,
        'url': canonicalUrl.value,
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'All',
        'inLanguage': 'zh-CN',
        'publisher': {
          '@type': 'Organization',
          'name': SITE_NAME,
          'url': SITE_ORIGIN,
        },
      }),
    },
  ],
}));
useHead(head);
</script>

<template>
  <BaseLayout>
    <div class="tool-layout">
      <div class="tool-header">
        <div flex flex-nowrap items-center justify-between>
          <n-h1>
            {{ toolTitle }}
          </n-h1>

          <div>
            <FavoriteButton :tool="currentTool ?? ({ name: toolTitle, path: route.path } as Tool)" />
          </div>
        </div>

        <div class="separator" />

        <div class="description">
          {{ toolDescription }}
        </div>
      </div>
    </div>

    <div class="tool-content">
      <slot />
    </div>
  </BaseLayout>
</template>

<style lang="less" scoped>
.tool-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  ::v-deep(& > *) {
    flex: 0 1 600px;
  }
}

.tool-layout {
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;

  .tool-header {
    padding: 40px 0;
    width: 100%;

    .n-h1 {
      opacity: 0.9;
      font-size: 40px;
      font-weight: 400;
      margin: 0;
      line-height: 1;
    }

    .separator {
      width: 200px;
      height: 2px;
      background: rgb(161, 161, 161);
      opacity: 0.2;

      margin: 10px 0;
    }

    .description {
      margin: 0;

      opacity: 0.7;
    }
  }
}
</style>
