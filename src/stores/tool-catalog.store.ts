// 工具目录 store：从后端获取分类与工具元信息，用于前端展示与可用性控制。
import { defineStore } from 'pinia';

export type ToolCatalogStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ToolCatalogToolDTO {
  id: string
  path: string
  name: string
  description?: string
  keywords?: string[]
  redirectFrom?: string[]
  icon?: string
  isNew: boolean
  createdAt?: string
  sortOrder: number
}

export interface ToolCatalogCategoryDTO {
  id: string
  name: string
  description?: string
  sortOrder: number
  tools: ToolCatalogToolDTO[]
}

export interface ToolCatalogDTO {
  categories: ToolCatalogCategoryDTO[]
}

export const useToolCatalogStore = defineStore('tool-catalog', () => {
  const status = ref<ToolCatalogStatus>('idle');
  const errorMessage = ref<string | null>(null);
  const catalog = ref<ToolCatalogDTO | null>(null);
  const lastLocale = ref<string | null>(null);
  const isRefreshing = ref(false);

  const enabledToolIds = computed(() => {
    const ids = new Set<string>();
    for (const category of catalog.value?.categories ?? []) {
      for (const tool of category.tools ?? []) {
        ids.add(tool.id);
      }
    }
    return ids;
  });

  const isReady = computed(() => status.value === 'ready');

  function isToolEnabled(toolId: string) {
    return enabledToolIds.value.has(toolId);
  }

  async function loadCatalog({ locale }: { locale: string }) {
    const normalizedLocale = locale === 'zh' ? 'zh' : 'en';
    if (status.value === 'loading') {
      return;
    }
    if (status.value === 'ready' && lastLocale.value === normalizedLocale) {
      return;
    }

    if (status.value === 'ready') {
      isRefreshing.value = true;
    }
    else {
      status.value = 'loading';
    }
    errorMessage.value = null;

    try {
      const url = `/api/catalog?locale=${encodeURIComponent(normalizedLocale)}`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`目录接口请求失败: HTTP ${response.status}`);
      }

      const data = (await response.json()) as ToolCatalogDTO;
      catalog.value = data;
      lastLocale.value = normalizedLocale;
      status.value = 'ready';
      isRefreshing.value = false;
    }
    catch (err) {
      status.value = 'error';
      errorMessage.value = err instanceof Error ? err.message : String(err);
      catalog.value = null;
      isRefreshing.value = false;
    }
  }

  return {
    status,
    errorMessage,
    catalog,
    isReady,
    isRefreshing,
    enabledToolIds,
    isToolEnabled,
    loadCatalog,
  };
});
