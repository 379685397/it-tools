<script setup lang="ts">
import _ from 'lodash';
import type { UseValidationRule } from '@/composable/validation';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const props = withDefaults(
  defineProps<{
    transformer?: (v: string) => string
    inputValidationRules?: UseValidationRule<string>[]
    inputLabel?: string
    inputPlaceholder?: string
    inputDefault?: string
    outputLabel?: string
    outputLanguage?: string
  }>(),
  {
    transformer: _.identity,
    inputValidationRules: () => [],
    inputDefault: '',
    inputLabel: undefined,
    inputPlaceholder: undefined,
    outputLabel: undefined,
    outputLanguage: '',
  },
);

const { t } = useI18n();

const { transformer, inputValidationRules, inputLabel, outputLabel, outputLanguage, inputPlaceholder, inputDefault }
  = toRefs(props);
const resolvedInputLabel = computed(() => inputLabel.value ?? t('ui.formatTransformer.inputLabel'));
const resolvedInputPlaceholder = computed(() => inputPlaceholder.value ?? t('ui.formatTransformer.inputPlaceholder'));
const resolvedOutputLabel = computed(() => outputLabel.value ?? t('ui.formatTransformer.outputLabel'));

const inputElement = ref<typeof CInputText>();

const input = ref(inputDefault.value);
const output = computed(() => transformer.value(input.value));
</script>

<template>
  <CInputText
    ref="inputElement"
    v-model:value="input"
    :placeholder="resolvedInputPlaceholder"
    :label="resolvedInputLabel"
    rows="20"
    autosize
    raw-text
    multiline
    test-id="input"
    :validation-rules="inputValidationRules"
    monospace
  />

  <div overflow-auto>
    <div mb-5px>
      {{ resolvedOutputLabel }}
    </div>
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement?.inputWrapperRef" />
  </div>
</template>
