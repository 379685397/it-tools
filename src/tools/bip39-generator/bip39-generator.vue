<script setup lang="ts">
import {
  chineseSimplifiedWordList,
  chineseTraditionalWordList,
  czechWordList,
  englishWordList,
  entropyToMnemonic,
  frenchWordList,
  generateEntropy,
  italianWordList,
  japaneseWordList,
  koreanWordList,
  mnemonicToEntropy,
  portugueseWordList,
  spanishWordList,
} from '@it-tools/bip39';
import { Copy, Refresh } from '@vicons/tabler';

import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const languages = {
  'English': englishWordList,
  'Chinese simplified': chineseSimplifiedWordList,
  'Chinese traditional': chineseTraditionalWordList,
  'Czech': czechWordList,
  'French': frenchWordList,
  'Italian': italianWordList,
  'Japanese': japaneseWordList,
  'Korean': koreanWordList,
  'Portuguese': portugueseWordList,
  'Spanish': spanishWordList,
};

const entropy = ref(generateEntropy());
const passphraseInput = ref('');

const language = ref<keyof typeof languages>('English');
const languageOptions = computed(() => [
  { label: t('tools.bip39-generator.language.english'), value: 'English' },
  { label: t('tools.bip39-generator.language.chineseSimplified'), value: 'Chinese simplified' },
  { label: t('tools.bip39-generator.language.chineseTraditional'), value: 'Chinese traditional' },
  { label: t('tools.bip39-generator.language.czech'), value: 'Czech' },
  { label: t('tools.bip39-generator.language.french'), value: 'French' },
  { label: t('tools.bip39-generator.language.italian'), value: 'Italian' },
  { label: t('tools.bip39-generator.language.japanese'), value: 'Japanese' },
  { label: t('tools.bip39-generator.language.korean'), value: 'Korean' },
  { label: t('tools.bip39-generator.language.portuguese'), value: 'Portuguese' },
  { label: t('tools.bip39-generator.language.spanish'), value: 'Spanish' },
]);

const passphrase = computed({
  get() {
    return withDefaultOnError(() => entropyToMnemonic(entropy.value, languages[language.value]), passphraseInput.value);
  },
  set(value: string) {
    passphraseInput.value = value;
    entropy.value = withDefaultOnError(() => mnemonicToEntropy(value, languages[language.value]), '');
  },
});

const entropyValidation = useValidation({
  source: entropy,
  rules: [
    {
      validator: value => value === '' || (value.length <= 32 && value.length >= 16 && value.length % 4 === 0),
      message: () => t('tools.bip39-generator.validation.entropyLength'),
    },
    {
      validator: value => /^[a-fA-F0-9]*$/.test(value),
      message: () => t('tools.bip39-generator.validation.entropyHex'),
    },
  ],
});

const mnemonicValidation = useValidation({
  source: passphrase,
  rules: [
    {
      validator: value => isNotThrowing(() => mnemonicToEntropy(value, languages[language.value])),
      message: () => t('tools.bip39-generator.validation.invalidMnemonic'),
    },
  ],
});

function refreshEntropy() {
  entropy.value = generateEntropy();
}

const { copy: copyEntropy } = useCopy({ source: entropy });
const { copy: copyPassphrase } = useCopy({ source: passphrase });
</script>

<template>
  <div>
    <n-grid cols="3" x-gap="12">
      <n-gi span="1">
        <c-select
          v-model:value="language"
          searchable
          :label="t('tools.bip39-generator.languageLabel')"
          :options="languageOptions"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item
          :label="t('tools.bip39-generator.entropyLabel')"
          :feedback="entropyValidation.message"
          :validation-status="entropyValidation.status"
        >
          <n-input-group>
            <c-input-text v-model:value="entropy" :placeholder="t('tools.bip39-generator.entropyPlaceholder')" />

            <c-button @click="refreshEntropy()">
              <n-icon size="22">
                <Refresh />
              </n-icon>
            </c-button>
            <c-button @click="copyEntropy(undefined, { notificationMessage: t('tools.bip39-generator.copiedEntropy') })">
              <n-icon size="22">
                <Copy />
              </n-icon>
            </c-button>
          </n-input-group>
        </n-form-item>
      </n-gi>
    </n-grid>
    <n-form-item
      :label="t('tools.bip39-generator.mnemonicLabel')"
      :feedback="mnemonicValidation.message"
      :validation-status="mnemonicValidation.status"
    >
      <n-input-group>
        <c-input-text v-model:value="passphrase" :placeholder="t('tools.bip39-generator.mnemonicPlaceholder')" raw-text />

        <c-button @click="copyPassphrase(undefined, { notificationMessage: t('tools.bip39-generator.copiedMnemonic') })">
          <n-icon size="22" :component="Copy" />
        </c-button>
      </n-input-group>
    </n-form-item>
  </div>
</template>
