<script setup lang="ts">
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js/max';
import lookup from 'country-code-lookup';
import {
  getDefaultCountryCode,
  getFullCountryName,
} from './phone-parser-and-formatter.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const rawPhone = ref('');
const defaultCountryCode = ref(getDefaultCountryCode());
const validation = useValidation({
  source: rawPhone,
  rules: [
    {
      validator: value => value === '' || /^[0-9 +\-()]+$/.test(value),
      message: t('tools.phone-parser-and-formatter.invalidPhone'),
    },
  ],
});

const parsedDetails = computed(() => {
  if (!validation.isValid) {
    return undefined;
  }

  const parsed = withDefaultOnError(() => parsePhoneNumber(rawPhone.value, defaultCountryCode.value), undefined);

  if (!parsed) {
    return undefined;
  }

  return [
    {
      label: t('tools.phone-parser-and-formatter.fields.countryCode'),
      value: parsed.country,
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.country'),
      value: getFullCountryName(parsed.country),
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.callingCode'),
      value: parsed.countryCallingCode,
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.isValid'),
      value: parsed.isValid() ? t('ui.keyValueList.yes') : t('ui.keyValueList.no'),
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.isPossible'),
      value: parsed.isPossible() ? t('ui.keyValueList.yes') : t('ui.keyValueList.no'),
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.type'),
      value: parsed.getType() ? t(`tools.phone-parser-and-formatter.numberTypes.${parsed.getType()}`, parsed.getType()) : undefined,
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.international'),
      value: parsed.formatInternational(),
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.national'),
      value: parsed.formatNational(),
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.e164'),
      value: parsed.format('E.164'),
    },
    {
      label: t('tools.phone-parser-and-formatter.fields.rfc3966'),
      value: parsed.format('RFC3966'),
    },
  ];
});

const countriesOptions = getCountries().map(code => ({
  label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
  value: code,
}));
</script>

<template>
  <div>
    <c-select v-model:value="defaultCountryCode" :label="t('tools.phone-parser-and-formatter.defaultCountryCode')" :options="countriesOptions" searchable mb-5 />

    <c-input-text
      v-model:value="rawPhone"
      :placeholder="t('tools.phone-parser-and-formatter.inputPlaceholder')"
      :label="t('tools.phone-parser-and-formatter.inputLabel')"
      :validation="validation"
      mb-5
    />

    <n-table v-if="parsedDetails">
      <tbody>
        <tr v-for="{ label, value } in parsedDetails" :key="label">
          <td font-bold>
            {{ label }}
          </td>
          <td>
            <span-copyable v-if="value" :value="value" />
            <span v-else op-70>
              {{ t('tools.phone-parser-and-formatter.unknown') }}
            </span>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
