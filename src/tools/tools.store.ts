import { type MaybeRef, get, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import type { Tool, ToolCategory, ToolWithCategory } from './tools.types';
import { toolsWithCategory } from './index';
import { useToolCatalogStore } from '@/stores/tool-catalog.store';

export const useToolStore = defineStore('tools', () => {
  const favoriteToolsName = useStorage('favoriteToolsName', []) as Ref<string[]>;
  const catalogStore = useToolCatalogStore();

  const localToolsById = computed(() => {
    const map = new Map<string, ToolWithCategory>();
    for (const tool of toolsWithCategory) {
      const id = tool.id ?? tool.path.replace(/^\//, '');
      map.set(id, tool);
    }
    return map;
  });

  const tools = computed<ToolWithCategory[]>(() => {
    const categories = catalogStore.catalog?.categories ?? [];
    const out: ToolWithCategory[] = [];

    for (const category of categories) {
      for (const tool of category.tools ?? []) {
        const local = localToolsById.value.get(tool.id);
        if (!local) {
          continue;
        }

        out.push({
          ...local,
          id: tool.id,
          path: tool.path,
          name: tool.name,
          description: tool.description ?? '',
          keywords: tool.keywords?.length ? tool.keywords : local.keywords,
          redirectFrom: tool.redirectFrom?.length ? tool.redirectFrom : local.redirectFrom,
          isNew: tool.isNew,
          createdAt: tool.createdAt ? new Date(tool.createdAt) : local.createdAt,
          category: category.name,
        });
      }
    }

    return out;
  });

  const toolsByCategory = computed<ToolCategory[]>(() => {
    const categories = catalogStore.catalog?.categories ?? [];

    return categories.map(category => ({
      name: category.name,
      components: tools.value.filter(t => t.category === category.name),
    }));
  });

  const favoriteTools = computed(() => {
    return favoriteToolsName.value
      .map(favoriteName => tools.value.find(({ name, path }) => name === favoriteName || path === favoriteName))
      .filter(Boolean) as ToolWithCategory[]; // cast because .filter(Boolean) does not remove undefined from type
  });

  return {
    tools,
    favoriteTools,
    toolsByCategory,
    newTools: computed(() => tools.value.filter(({ isNew }) => isNew)),

    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolPath = get(tool).path;
      if (toolPath) {
        favoriteToolsName.value.push(toolPath);
      }
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      favoriteToolsName.value = favoriteToolsName.value.filter(name => get(tool).name !== name && get(tool).path !== name);
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return favoriteToolsName.value.includes(get(tool).name)
        || favoriteToolsName.value.includes(get(tool).path);
    },

    updateFavoriteTools(newOrder: ToolWithCategory[]) {
      favoriteToolsName.value = newOrder.map(tool => tool.path);
    },
  };
});
