<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import FavoriteButton from './FavoriteButton.vue';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();
</script>

<template>
  <router-link :to="tool.path" class="decoration-none">
    <c-card class="h-full transition transition-duration-0.5s !border-2px !px-12px !py-10px !hover:border-primary">
      <div flex items-center justify-between gap-10px>
        <div min-w-0 flex items-center gap-8px>
          <n-icon class="text-neutral-400 dark:text-neutral-600" size="22" :component="tool.icon" />
          <div class="truncate text-base text-black font-600 dark:text-white">
            {{ tool.name }}
          </div>
        </div>

        <div flex shrink-0 items-center gap-6px>
          <div
            v-if="tool.isNew"
            class="rounded-full px-6px py-2px text-10px text-white dark:text-neutral-800"
            :style="{
              'background-color': theme.primaryColor,
            }"
          >
            {{ $t('toolCard.new') }}
          </div>

          <FavoriteButton :tool="tool" size="small" />
        </div>
      </div>

      <div v-if="tool.description" class="line-clamp-1 mt-6px text-xs text-neutral-500 dark:text-neutral-400">
        {{ tool.description }}
      </div>
    </c-card>
  </router-link>
</template>
