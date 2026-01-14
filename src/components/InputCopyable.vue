<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { useCopy } from '@/composable/copy';

const props = defineProps<{ value: string }>();
const emit = defineEmits(['update:value']);

const value = useVModel(props, 'value', emit);
const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const { t } = useI18n();
const tooltipText = computed(() => isJustCopied.value ? t('ui.inputCopyable.copied') : t('ui.inputCopyable.copy'));
</script>

<template>
  <c-input-text v-model:value="value">
    <template #suffix>
      <c-tooltip :tooltip="tooltipText">
        <c-button circle variant="text" size="small" @click="copy()">
          <icon-mdi-content-copy />
        </c-button>
      </c-tooltip>
    </template>
  </c-input-text>
</template>
