<script setup lang="ts">
import { IconDragDrop } from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';
import { DEFAULT_OG_IMAGE_URL, OG_LOCALE, SITE_NAME, SITE_ORIGIN, getCanonicalUrl } from '@/seo/seo';

const toolStore = useToolStore();
const route = useRoute();

const canonicalUrl = computed(() => getCanonicalUrl(route.path));
const title = `${SITE_NAME} - 开发者在线工具合集`;
const description = '开发者常用在线工具合集，覆盖 JSON、加密、转换、网络、文本等类别，免费使用。';

const head = computed<HeadObject>(() => ({
  title,
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
  ],
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: 'IT工具,在线工具,开发者工具,JSON,Base64,加密,转换,正则,二维码' },
    { name: 'robots', content: 'index,follow' },

    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: OG_LOCALE },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:image', content: DEFAULT_OG_IMAGE_URL },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SITE_NAME,
        'url': SITE_ORIGIN,
        'inLanguage': 'zh-CN',
      }),
    },
  ],
}));

useHead(head);
const { t } = useI18n();

const favoriteTools = computed(() => toolStore.favoriteTools);
const newestTools = computed(() => toolStore.newTools);
const toolsByCategory = computed(() => toolStore.toolsByCategory);

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper">
      <transition name="height">
        <div v-if="favoriteTools.length > 0">
          <h3 class="mb-5px mt-25px text-neutral-400 font-500">
            {{ $t('home.categories.favoriteTools') }}
            <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
              <n-icon :component="IconDragDrop" size="18" />
            </c-tooltip>
          </h3>
          <Draggable
            :list="favoriteTools"
            class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
            ghost-class="ghost-favorites-draggable"
            item-key="name"
            @end="onUpdateFavoriteTools"
          >
            <template #item="{ element: tool }">
              <ToolCard :tool="tool" />
            </template>
          </Draggable>
        </div>
      </transition>

      <div v-if="newestTools.length > 0">
        <h3 class="mb-5px mt-25px text-neutral-400 font-500">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in newestTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <h3 class="mb-5px mt-25px text-neutral-400 font-500">
        {{ $t('home.categories.allTools') }}
      </h3>

      <div v-for="category in toolsByCategory" :key="category.name">
        <h3 class="mb-5px mt-25px text-neutral-400 font-500">
          {{ category.name }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in category.components" :key="tool.name" :tool="tool" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.ghost-favorites-draggable {
  opacity: 0.4;
  background-color: #ccc;
  border: 2px dashed #666;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
  animation: ghost-favorites-draggable-animation 0.2s ease-out;
}

@keyframes ghost-favorites-draggable-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.0);
  }
}
</style>
