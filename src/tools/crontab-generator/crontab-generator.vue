<script setup lang="ts">
import cronstrue from 'cronstrue/i18n';
import { isValidCron } from 'cron-validator';
import { useStyleStore } from '@/stores/style.store';

const { t, locale } = useI18n();

function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true });
}

const styleStore = useStyleStore();

const cron = ref('40 * * * *');
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
});

const helpers = computed(() => [
  {
    symbol: '*',
    meaning: t('tools.crontab-generator.helpers.anyValue.meaning'),
    example: '* * * *',
    equivalent: t('tools.crontab-generator.helpers.anyValue.equivalent'),
  },
  {
    symbol: '-',
    meaning: t('tools.crontab-generator.helpers.range.meaning'),
    example: '1-10 * * *',
    equivalent: t('tools.crontab-generator.helpers.range.equivalent'),
  },
  {
    symbol: ',',
    meaning: t('tools.crontab-generator.helpers.list.meaning'),
    example: '1,10 * * *',
    equivalent: t('tools.crontab-generator.helpers.list.equivalent'),
  },
  {
    symbol: '/',
    meaning: t('tools.crontab-generator.helpers.step.meaning'),
    example: '*/10 * * *',
    equivalent: t('tools.crontab-generator.helpers.step.equivalent'),
  },
  {
    symbol: '@yearly',
    meaning: t('tools.crontab-generator.helpers.yearly.meaning'),
    example: '@yearly',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@annually',
    meaning: t('tools.crontab-generator.helpers.annually.meaning'),
    example: '@annually',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@monthly',
    meaning: t('tools.crontab-generator.helpers.monthly.meaning'),
    example: '@monthly',
    equivalent: '0 0 1 * *',
  },
  {
    symbol: '@weekly',
    meaning: t('tools.crontab-generator.helpers.weekly.meaning'),
    example: '@weekly',
    equivalent: '0 0 * * 0',
  },
  {
    symbol: '@daily',
    meaning: t('tools.crontab-generator.helpers.daily.meaning'),
    example: '@daily',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@midnight',
    meaning: t('tools.crontab-generator.helpers.midnight.meaning'),
    example: '@midnight',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@hourly',
    meaning: t('tools.crontab-generator.helpers.hourly.meaning'),
    example: '@hourly',
    equivalent: '0 * * * *',
  },
  {
    symbol: '@reboot',
    meaning: t('tools.crontab-generator.helpers.reboot.meaning'),
    example: '',
    equivalent: '',
  },
]);

const cronstrueLocale = computed(() => {
  const i18nLocale = locale.value?.toString() ?? 'en';
  if (i18nLocale.startsWith('zh')) {
    return 'zh_CN';
  }
  if (i18nLocale === 'no') {
    return 'nb';
  }
  if (i18nLocale === 'pt') {
    return 'pt_PT';
  }
  return i18nLocale;
});

const cronString = computed(() => {
  if (isCronValid(cron.value)) {
    return cronstrue.toString(cron.value, { ...cronstrueConfig, locale: cronstrueLocale.value });
  }
  return ' ';
});

const cronValidationRules = [
  {
    validator: (value: string) => isCronValid(value),
    message: () => t('tools.crontab-generator.invalidCron'),
  },
];
</script>

<template>
  <c-card>
    <div mx-auto max-w-sm>
      <c-input-text
        v-model:value="cron"
        size="large"
        :placeholder="t('tools.crontab-generator.inputPlaceholder')"
        :validation-rules="cronValidationRules"
        mb-3
      />
    </div>

    <div class="cron-string">
      {{ cronString }}
    </div>

    <n-divider />

    <div flex justify-center>
      <n-form :show-feedback="false" label-width="170" label-placement="left">
        <n-form-item :label="t('tools.crontab-generator.options.verbose')">
          <n-switch v-model:value="cronstrueConfig.verbose" />
        </n-form-item>
        <n-form-item :label="t('tools.crontab-generator.options.use24HourTimeFormat')">
          <n-switch v-model:value="cronstrueConfig.use24HourTimeFormat" />
        </n-form-item>
        <n-form-item :label="t('tools.crontab-generator.options.daysStartAt0')">
          <n-switch v-model:value="cronstrueConfig.dayOfWeekStartIndexZero" />
        </n-form-item>
      </n-form>
    </div>
  </c-card>
  <c-card>
    <div mb-2>
      {{ t('tools.crontab-generator.syntaxTitle') }}
    </div>
    <pre>
┌──────────── [optional] seconds (0 - 59)
| ┌────────── minute (0 - 59)
| | ┌──────── hour (0 - 23)
| | | ┌────── day of month (1 - 31)
| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...
| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...
| | | | | |
* * * * * * command</pre>

    <div v-if="styleStore.isSmallScreen">
      <c-card v-for="{ symbol, meaning, example, equivalent } in helpers" :key="symbol" mb-3 important:border-none>
        <div>
          {{ t('tools.crontab-generator.cards.symbol') }} <strong>{{ symbol }}</strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.cards.meaning') }} <strong>{{ meaning }}</strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.cards.example') }}
          <strong><code>{{ example }}</code></strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.cards.equivalent') }} <strong>{{ equivalent }}</strong>
        </div>
      </c-card>
    </div>

    <c-table v-else :data="helpers" />
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(input) {
  font-size: 30px;
  font-family: monospace;
  padding: 5px;
  text-align: center;
}

.cron-string {
  text-align: center;
  font-size: 22px;
  opacity: 0.8;
  margin: 5px 0 15px;
}

pre {
  overflow: auto;
  padding: 10px 0;
}
</style>
