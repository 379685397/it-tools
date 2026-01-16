<script lang="ts" setup>
import { NIcon } from 'naive-ui';

import { RouterLink, useRoute } from 'vue-router';
import { Home2, Menu2 } from '@vicons/tabler';

import { storeToRefs } from 'pinia';
import MenuLayout from '../components/MenuLayout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';
import { useStyleStore } from '@/stores/style.store';
import { config } from '@/config';
import type { ToolCategory, ToolWithCategory } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';
import CollapsibleToolMenu from '@/components/CollapsibleToolMenu.vue';

const styleStore = useStyleStore();
const version = config.app.version;
const commitSha = config.app.lastCommitSha.slice(0, 7);

const { t } = useI18n();

const toolStore = useToolStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);
const route = useRoute();

const tools = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0 ? [{ name: t('tools.categories.favorite-tools'), components: favoriteTools.value }] : []),
  ...toolsByCategory.value,
]);

const recentToolIDs = ref<string[]>([]);

function loadRecentToolIDs() {
  try {
    const raw = localStorage.getItem('recent-tool-ids');
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      recentToolIDs.value = parsed.filter(v => typeof v === 'string').slice(0, 5);
    }
    else {
      recentToolIDs.value = [];
    }
  }
  catch {
    recentToolIDs.value = [];
  }
}

onMounted(loadRecentToolIDs);
watch(() => route.fullPath, () => loadRecentToolIDs());

const recentTools = computed(() => {
  const toolsByID = new Map(toolStore.tools.map(tool => [tool.id ?? tool.path.replace(/^\//, ''), tool]));
  return recentToolIDs.value.map(id => toolsByID.get(id)).filter(Boolean) as ToolWithCategory[];
});
</script>

<template>
  <MenuLayout class="menu-layout" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <div class="sider-root">
        <RouterLink to="/" class="sider-header">
          <div class="brand">
            IT工具网
          </div>
        </RouterLink>

        <div class="sider-scroll">
          <div v-if="styleStore.isSmallScreen" flex flex-col items-center>
            <locale-selector w="90%" />

            <div flex justify-center>
              <NavbarButtons />
            </div>
          </div>

          <CollapsibleToolMenu :tools-by-category="tools" />

          <div class="footer">
            <div>
              {{ $t('home.brand.short') }}
              © {{ new Date().getFullYear() }}
            </div>
            <div>
              杭州鸿强科技有限公司版权所有
            </div>
            <div>
              浙ICP备2023014979号-1
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div>
        <div flex items-center justify-center gap-2>
          <c-button
            circle
            variant="text"
            :aria-label="$t('home.toggleMenu')"
            @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
          >
            <NIcon size="25" :component="Menu2" />
          </c-button>

          <c-tooltip :tooltip="$t('home.home')" position="bottom">
            <c-button to="/" circle variant="text" :aria-label="$t('home.home')">
              <NIcon size="25" :component="Home2" />
            </c-button>
          </c-tooltip>

          <command-palette />

          <locale-selector v-if="!styleStore.isSmallScreen" />

          <div>
            <NavbarButtons v-if="!styleStore.isSmallScreen" />
          </div>
        </div>

        <div v-if="recentTools.length > 0" class="recent-tools" flex items-center gap-2 px-2 pt-2>
          <span class="label" op-60>最近使用</span>
          <div flex flex-wrap gap-1>
            <c-button
              v-for="tool in recentTools"
              :key="tool.path"
              size="small"
              variant="text"
              :to="tool.path"
            >
              {{ tool.name }}
            </c-button>
          </div>
        </div>
      </div>
      <slot />
    </template>
  </MenuLayout>
</template>

<style lang="less" scoped>
// ::v-deep(.n-layout-scroll-container) {
//     @percent: 4%;
//     @position: 25px;
//     @size: 50px;
//     @color: #eeeeee25;
//     background-image: radial-gradient(@color @percent, transparent @percent),
//         radial-gradient(@color @percent, transparent @percent);
//     background-position: 0 0, @position @position;
//     background-size: @size @size;
// }

.footer {
  text-align: center;
  color: #838587;
  margin-top: 20px;
  padding: 20px 0;
}

.sider-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sider-header {
  flex: 0 0 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: linear-gradient(48deg, rgba(37, 99, 108, 0.72) 0%, rgba(59, 149, 111, 0.72) 60%, rgba(20, 160, 88, 0.72) 100%);
  backdrop-filter: blur(6px);

  .brand {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-align: center;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  }
}

.sider-scroll {
  flex: 1 1 auto;
  overflow: auto;
  padding-top: 5px;
  padding-bottom: 80px;
}

.recent-tools {
  max-width: 820px;
  margin: 0 auto;
}
</style>
