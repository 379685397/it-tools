<script setup lang="ts">
import { UAParser } from 'ua-parser-js';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import UserAgentResultCards from './user-agent-result-cards.vue';
import type { UserAgentResultSection } from './user-agent-parser.types';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const ua = ref(navigator.userAgent as string);

// If not input in the ua field is present return an empty object of type UAParser.IResult because otherwise
// UAParser returns the values for the current Browser. This is confusing because results are shown for an empty
// UA field value.
function getUserAgentInfo(userAgent: string) {
  return userAgent.trim().length > 0
    ? UAParser(userAgent.trim())
    : ({ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as UAParser.IResult);
}
const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined));

const sections = computed<UserAgentResultSection[]>(() => [
  {
    heading: t('tools.user-agent-parser.sections.browser.title'),
    icon: Browser,
    content: [
      {
        label: t('tools.user-agent-parser.fields.name'),
        getValue: block => block?.browser.name,
        undefinedFallback: t('tools.user-agent-parser.sections.browser.noName'),
      },
      {
        label: t('tools.user-agent-parser.fields.version'),
        getValue: block => block?.browser.version,
        undefinedFallback: t('tools.user-agent-parser.sections.browser.noVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.engine.title'),
    icon: Engine,
    content: [
      {
        label: t('tools.user-agent-parser.fields.name'),
        getValue: block => block?.engine.name,
        undefinedFallback: t('tools.user-agent-parser.sections.engine.noName'),
      },
      {
        label: t('tools.user-agent-parser.fields.version'),
        getValue: block => block?.engine.version,
        undefinedFallback: t('tools.user-agent-parser.sections.engine.noVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.os.title'),
    icon: Adjustments,
    content: [
      {
        label: t('tools.user-agent-parser.fields.name'),
        getValue: block => block?.os.name,
        undefinedFallback: t('tools.user-agent-parser.sections.os.noName'),
      },
      {
        label: t('tools.user-agent-parser.fields.version'),
        getValue: block => block?.os.version,
        undefinedFallback: t('tools.user-agent-parser.sections.os.noVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.device.title'),
    icon: Devices,
    content: [
      {
        label: t('tools.user-agent-parser.fields.model'),
        getValue: block => block?.device.model,
        undefinedFallback: t('tools.user-agent-parser.sections.device.noModel'),
      },
      {
        label: t('tools.user-agent-parser.fields.type'),
        getValue: block => block?.device.type,
        undefinedFallback: t('tools.user-agent-parser.sections.device.noType'),
      },
      {
        label: t('tools.user-agent-parser.fields.vendor'),
        getValue: block => block?.device.vendor,
        undefinedFallback: t('tools.user-agent-parser.sections.device.noVendor'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.sections.cpu.title'),
    icon: Cpu,
    content: [
      {
        label: t('tools.user-agent-parser.fields.architecture'),
        getValue: block => block?.cpu.architecture,
        undefinedFallback: t('tools.user-agent-parser.sections.cpu.noArchitecture'),
      },
    ],
  },
]);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ua"
      :label="t('tools.user-agent-parser.inputLabel')"
      multiline
      :placeholder="t('tools.user-agent-parser.inputPlaceholder')"
      clearable
      raw-text
      rows="2"
      autosize
      monospace
      mb-3
    />

    <UserAgentResultCards :user-agent-info="userAgentInfo" :sections="sections" />
  </div>
</template>
