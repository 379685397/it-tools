<script setup lang="ts">
import { getPasswordCrackTimeEstimation } from './password-strength-analyser.service';

const password = ref('');
const { t } = useI18n();
const crackTimeEstimation = computed(() => getPasswordCrackTimeEstimation({ password: password.value }));

const details = computed(() => [
  {
    key: 'passwordLength',
    label: t('tools.password-strength-analyser.passwordLength'),
    value: crackTimeEstimation.value.passwordLength,
  },
  {
    key: 'entropy',
    label: t('tools.password-strength-analyser.entropy'),
    value: Math.round(crackTimeEstimation.value.entropy * 100) / 100,
  },
  {
    key: 'charsetLength',
    label: t('tools.password-strength-analyser.charsetLength'),
    value: crackTimeEstimation.value.charsetLength,
  },
  {
    key: 'score',
    label: t('tools.password-strength-analyser.score'),
    value: `${Math.round(crackTimeEstimation.value.score * 100)} / 100`,
  },
]);
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text
      v-model:value="password"
      type="password"
      :placeholder="t('tools.password-strength-analyser.inputPlaceholder')"
      clearable
      autofocus
      raw-text
      test-id="password-input"
    />

    <c-card text-center>
      <div op-60>
        {{ t('tools.password-strength-analyser.crackTitle') }}
      </div>
      <div text-2xl data-test-id="crack-duration">
        {{ crackTimeEstimation.crackDurationFormatted }}
      </div>
    </c-card>
    <c-card>
      <div v-for="({ key, label, value }) of details" :key="key" flex gap-3>
        <div flex-1 text-right op-60>
          {{ label }}
        </div>
        <div flex-1 text-left>
          {{ value }}
        </div>
      </div>
    </c-card>
    <div op-70>
      <span font-bold>{{ t('tools.password-strength-analyser.noteTitle') }}</span>
      {{ t('tools.password-strength-analyser.noteBody') }}
    </div>
  </div>
</template>
