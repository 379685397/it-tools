<script setup lang="ts">
import type { Colord } from 'colord';
import { colord, extend } from 'colord';
import _ from 'lodash';
import cmykPlugin from 'colord/plugins/cmyk';
import hwbPlugin from 'colord/plugins/hwb';
import namesPlugin from 'colord/plugins/names';
import lchPlugin from 'colord/plugins/lch';
import { buildColorFormat } from './color-converter.models';

extend([cmykPlugin, hwbPlugin, namesPlugin, lchPlugin]);

const { t } = useI18n();

const formats = {
  picker: buildColorFormat({
    label: 'picker',
    format: (v: Colord) => v.toHex(),
    type: 'color-picker',
  }),
  hex: buildColorFormat({
    label: 'hex',
    format: (v: Colord) => v.toHex(),
    placeholder: t('tools.color-converter.placeholder.hex'),
    invalidMessage: t('tools.color-converter.invalidFormat', { format: 'HEX' }),
  }),
  rgb: buildColorFormat({
    label: 'rgb',
    format: (v: Colord) => v.toRgbString(),
    placeholder: t('tools.color-converter.placeholder.rgb'),
    invalidMessage: t('tools.color-converter.invalidFormat', { format: 'RGB' }),
  }),
  hsl: buildColorFormat({
    label: 'hsl',
    format: (v: Colord) => v.toHslString(),
    placeholder: t('tools.color-converter.placeholder.hsl'),
    invalidMessage: t('tools.color-converter.invalidFormat', { format: 'HSL' }),
  }),
  hwb: buildColorFormat({
    label: 'hwb',
    format: (v: Colord) => v.toHwbString(),
    placeholder: t('tools.color-converter.placeholder.hwb'),
    invalidMessage: t('tools.color-converter.invalidFormat', { format: 'HWB' }),
  }),
  lch: buildColorFormat({
    label: 'lch',
    format: (v: Colord) => v.toLchString(),
    placeholder: t('tools.color-converter.placeholder.lch'),
    invalidMessage: t('tools.color-converter.invalidFormat', { format: 'LCH' }),
  }),
  cmyk: buildColorFormat({
    label: 'cmyk',
    format: (v: Colord) => v.toCmykString(),
    placeholder: t('tools.color-converter.placeholder.cmyk'),
    invalidMessage: t('tools.color-converter.invalidFormat', { format: 'CMYK' }),
  }),
  name: buildColorFormat({
    label: 'name',
    format: (v: Colord) => v.toName({ closest: true }) ?? t('tools.color-converter.unknown'),
    placeholder: t('tools.color-converter.placeholder.name'),
    invalidMessage: t('tools.color-converter.invalidFormat', { format: t('tools.color-converter.label.name') }),
  }),
};

updateColorValue(colord('#1ea54c'));

function updateColorValue(value: Colord | undefined, omitLabel?: string) {
  if (value === undefined) {
    return;
  }

  if (!value.isValid()) {
    return;
  }

  _.forEach(formats, ({ value: valueRef, format }, key) => {
    if (key !== omitLabel) {
      valueRef.value = format(value);
    }
  });
}
</script>

<template>
  <c-card>
    <template v-for="({ parse, placeholder, validation, type }, key) in formats" :key="key">
      <input-copyable
        v-if="type === 'text'"
        v-model:value="formats[key].value.value"
        :test-id="`input-${key}`"
        :label="`${t(`tools.color-converter.label.${key}`)}:`"
        label-position="left"
        label-width="100px"
        label-align="right"
        :placeholder="placeholder"
        :validation="validation"
        raw-text
        clearable
        mt-2
        @update:value="(v:string) => updateColorValue(parse(v), key)"
      />

      <n-form-item v-else-if="type === 'color-picker'" :label="`${t(`tools.color-converter.label.${key}`)}:`" label-width="100" label-placement="left" :show-feedback="false">
        <n-color-picker
          v-model:value="formats[key].value.value"
          placement="bottom-end"
          @update:value="(v:string) => updateColorValue(parse(v), key)"
        />
      </n-form-item>
    </template>
  </c-card>
</template>
