import { defineStore } from 'pinia';
import _ from 'lodash';
import type { PaletteOption } from './command-palette.types';
import { useToolStore } from '@/tools/tools.store';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { useStyleStore } from '@/stores/style.store';

import SunIcon from '~icons/mdi/white-balance-sunny';
import GithubIcon from '~icons/mdi/github';
import BugIcon from '~icons/mdi/bug-outline';
import DiceIcon from '~icons/mdi/dice-5';
import InfoIcon from '~icons/mdi/information-outline';

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const router = useRouter();
  const searchPrompt = ref('');
  const { t } = useI18n();

  const toolsOptions = toolStore.tools.map(tool => ({
    ...tool,
    to: tool.path,
    toolCategory: tool.category,
    category: t('commandPalette.category.tools'),
  }));

  const searchOptions: PaletteOption[] = [
    ...toolsOptions,
    {
      name: t('commandPalette.randomTool'),
      description: t('commandPalette.randomToolDesc'),
      action: () => {
        const { path } = _.sample(toolStore.tools)!;
        router.push(path);
      },
      icon: DiceIcon,
      category: t('commandPalette.category.tools'),
      keywords: ['random', 'tool', 'pick', 'choose', 'select'],
      closeOnSelect: true,
    },
    {
      name: t('commandPalette.toggleDark'),
      description: t('commandPalette.toggleDarkDesc'),
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: t('commandPalette.category.actions'),
      keywords: ['dark', 'theme', 'toggle', 'mode', 'light', 'system'],
    },
    {
      name: t('commandPalette.github'),
      href: 'https://github.com/CorentinTh/it-tools',
      category: t('commandPalette.category.external'),
      description: t('commandPalette.githubDesc'),
      keywords: ['github', 'repo', 'repository', 'source', 'code'],
      icon: GithubIcon,
    },
    {
      name: t('commandPalette.reportBug'),
      description: t('commandPalette.reportBugDesc'),
      href: 'https://github.com/CorentinTh/it-tools/issues/new/choose',
      category: t('commandPalette.category.actions'),
      keywords: ['report', 'issue', 'bug', 'problem', 'error'],
      icon: BugIcon,
    },
    {
      name: t('commandPalette.about'),
      description: t('commandPalette.aboutDesc'),
      to: '/about',
      category: t('commandPalette.category.pages'),
      keywords: ['about', 'learn', 'more', 'info', 'information'],
      icon: InfoIcon,
    },
  ];

  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: searchOptions,
    options: {
      keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      threshold: 0.3,
    },
  });

  const filteredSearchResult = computed(() =>
    _.chain(searchResult.value).groupBy('category').mapValues(categoryOptions => _.take(categoryOptions, 5)).value());

  return {
    filteredSearchResult,
    searchPrompt,
  };
});
