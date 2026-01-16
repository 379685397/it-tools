// 工具目录路由守卫：当工具被后端禁用时，阻止访问并跳转到不可用页面。
import type { Pinia } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { useToolCatalogStore } from '@/stores/tool-catalog.store';

export function createToolCatalogGuard(pinia: Pinia) {
  return (to: RouteLocationNormalized) => {
    const catalogStore = useToolCatalogStore(pinia);

    if (to.meta?.isTool && catalogStore.isReady) {
      const toolId = String(to.path).replace(/^\//, '');
      if (!catalogStore.isToolEnabled(toolId)) {
        return { path: '/tool-unavailable' };
      }
    }

    return true;
  };
}
