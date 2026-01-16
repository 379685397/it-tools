import { describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createToolCatalogGuard } from './tool-catalog.guard';
import { useToolCatalogStore } from '@/stores/tool-catalog.store';

describe('tool-catalog guard', () => {
  it('should redirect when tool is disabled', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useToolCatalogStore(pinia);
    store.status = 'ready';
    store.catalog = {
      categories: [
        {
          id: 'test',
          name: 'Test',
          sortOrder: 1,
          tools: [
            { id: 'enabled', path: '/enabled', name: 'Enabled', isNew: false, sortOrder: 1 },
          ],
        },
      ],
    };

    const guard = createToolCatalogGuard(pinia);
    const result = guard({ path: '/disabled', meta: { isTool: true } } as any);
    expect(result).to.eql({ path: '/tool-unavailable' });
  });

  it('should allow navigation when tool is enabled', () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useToolCatalogStore(pinia);
    store.status = 'ready';
    store.catalog = {
      categories: [
        {
          id: 'test',
          name: 'Test',
          sortOrder: 1,
          tools: [
            { id: 'enabled', path: '/enabled', name: 'Enabled', isNew: false, sortOrder: 1 },
          ],
        },
      ],
    };

    const guard = createToolCatalogGuard(pinia);
    const result = guard({ path: '/enabled', meta: { isTool: true } } as any);
    expect(result).to.eql(true);
  });
});
