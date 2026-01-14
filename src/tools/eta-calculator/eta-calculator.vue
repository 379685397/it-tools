<script setup lang="ts">
// Duplicate issue with sub directory

import { addMilliseconds, formatRelative } from 'date-fns';

import { enGB, zhCN } from 'date-fns/locale';

import { formatMsDuration } from './eta-calculator.service';

const { t, locale } = useI18n();

const unitCount = ref(3 * 62);
const unitPerTimeSpan = ref(3);
const timeSpan = ref(5);
const timeSpanUnitMultiplier = ref(60000);
const startedAt = ref(Date.now());

const dateFnsLocale = computed(() => (locale.value === 'zh' ? zhCN : enGB));

const timeSpanUnitOptions = computed(() => ([
  { label: t('tools.eta-calculator.timeUnits.milliseconds'), value: 1 },
  { label: t('tools.eta-calculator.timeUnits.seconds'), value: 1000 },
  { label: t('tools.eta-calculator.timeUnits.minutes'), value: 1000 * 60 },
  { label: t('tools.eta-calculator.timeUnits.hours'), value: 1000 * 60 * 60 },
  { label: t('tools.eta-calculator.timeUnits.days'), value: 1000 * 60 * 60 * 24 },
]));

const durationMs = computed(() => {
  const timeSpanMs = timeSpan.value * timeSpanUnitMultiplier.value;

  return unitCount.value / (unitPerTimeSpan.value / timeSpanMs);
});
const endAt = computed(() =>
  formatRelative(addMilliseconds(startedAt.value, durationMs.value), Date.now(), { locale: dateFnsLocale.value }),
);
</script>

<template>
  <div>
    <div text-justify op-70>
      {{ t('tools.eta-calculator.example') }}
    </div>
    <n-divider />
    <div flex gap-2>
      <n-form-item :label="t('tools.eta-calculator.labels.totalAmount')" flex-1>
        <n-input-number v-model:value="unitCount" :min="1" />
      </n-form-item>
      <n-form-item :label="t('tools.eta-calculator.labels.startedAt')" flex-1>
        <n-date-picker v-model:value="startedAt" type="datetime" />
      </n-form-item>
    </div>

    <p>{{ t('tools.eta-calculator.labels.rateTitle') }}</p>
    <div flex flex-col items-baseline gap-y-2 md:flex-row>
      <n-input-number v-model:value="unitPerTimeSpan" :min="1" />
      <div flex items-baseline gap-2>
        <span ml-2>{{ t('tools.eta-calculator.labels.in') }}</span>
        <n-input-number v-model:value="timeSpan" min-w-130px :min="1" />
        <c-select
          v-model:value="timeSpanUnitMultiplier"
          min-w-130px
          :options="timeSpanUnitOptions"
        />
      </div>
    </div>

    <n-divider />
    <c-card mb-2>
      <n-statistic :label="t('tools.eta-calculator.results.totalDuration')">
        {{ formatMsDuration(durationMs) }}
      </n-statistic>
    </c-card>
    <c-card>
      <n-statistic :label="t('tools.eta-calculator.results.endsAt')">
        {{ endAt }}
      </n-statistic>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-number,
.n-date-picker {
  width: 100%;
}
</style>
