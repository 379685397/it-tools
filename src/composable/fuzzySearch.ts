import { type MaybeRef, get } from '@vueuse/core';
import Fuse from 'fuse.js';
import { computed } from 'vue';

export { useFuzzySearch };

function useFuzzySearch<Data>({
  search,
  data,
  options = {},
}: {
  search: MaybeRef<string>
  data: MaybeRef<Data[]>
  options?: Fuse.IFuseOptions<Data> & { filterEmpty?: boolean }
}) {
  const filterEmpty = options.filterEmpty ?? true;
  const fuse = computed(() => new Fuse(get(data), options));

  const searchResult = computed<Data[]>(() => {
    const query = get(search);
    const fuseInstance = fuse.value;

    if (!filterEmpty && query === '') {
      return get(data);
    }

    return fuseInstance.search(query).map(({ item }) => item);
  });

  return { searchResult };
}
