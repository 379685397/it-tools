<script setup lang="ts">
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';
import { computed } from 'vue';
import { DEFAULT_OG_IMAGE_URL, OG_LOCALE, SITE_NAME, getCanonicalUrl } from '@/seo/seo';

const route = useRoute();
const canonicalUrl = computed(() => getCanonicalUrl(route.path));
const title = `关于 - ${SITE_NAME}`;
const description = '了解 IT工具网：免费、开源的开发者在线工具合集，持续提供高质量的常用工具。';

useHead(
  computed<HeadObject>(() => ({
    title,
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
    ],
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index,follow' },

      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: OG_LOCALE },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl.value },
      { property: 'og:image', content: DEFAULT_OG_IMAGE_URL },
    ],
  })),
);
</script>

<template>
  <c-markdown :markdown="$t('about.content')" mx-auto mt-50px max-w-600px />
</template>
