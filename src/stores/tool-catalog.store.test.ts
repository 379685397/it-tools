import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useToolCatalogStore } from './tool-catalog.store';

describe('tool-catalog store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('should normalize locale to en', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ categories: [] }),
    }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const store = useToolCatalogStore();
    await store.loadCatalog({ locale: 'fr' });

    expect(fetchMock.mock.calls.length).to.eql(1);
    expect(String(fetchMock.mock.calls[0][0])).to.eql('/api/catalog?locale=en');
    expect(store.status).to.eql('ready');
  });

  it('should not refetch for same normalized locale', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ categories: [] }),
    }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const store = useToolCatalogStore();
    await store.loadCatalog({ locale: 'en' });
    await store.loadCatalog({ locale: 'fr' });

    expect(fetchMock.mock.calls.length).to.eql(1);
    expect(store.status).to.eql('ready');
  });

  it('should refresh without blocking when already ready', async () => {
    let resolveJson: ((v: unknown) => void) | undefined;
    const delayedJsonPromise = new Promise((resolve) => {
      resolveJson = resolve;
    });

    let callCount = 0;
    const fetchMock = vi.fn(async () => {
      callCount += 1;

      return {
        ok: true,
        json: async () => (callCount === 1 ? { categories: [] } : delayedJsonPromise),
      };
    });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const store = useToolCatalogStore();
    await store.loadCatalog({ locale: 'zh' });

    const refreshPromise = store.loadCatalog({ locale: 'en' });
    expect(store.status).to.eql('ready');
    expect(store.isRefreshing).to.eql(true);

    resolveJson?.({ categories: [] });
    await refreshPromise;

    expect(store.isRefreshing).to.eql(false);
    expect(store.status).to.eql('ready');
  });
});
