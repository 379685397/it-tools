<script setup lang="ts">
import { generateMeta } from '@it-tools/oggen';
import _ from 'lodash';
import { image, ogSchemas, twitter, website } from './og-schemas';
import type { OGSchemaType, OGSchemaTypeElementSelect } from './OGSchemaType.type';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

// Since type guards do not work in template

const { t } = useI18n();

function normalizeI18nId(id: string) {
  return id
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+/, '')
    .replace(/_+$/, '')
    .toLowerCase();
}

function localizeOptions({ options, prefix }: { options: OGSchemaTypeElementSelect['options']; prefix: string }) {
  return options.map((option) => {
    if ('type' in option && option.type === 'group') {
      const groupId = normalizeI18nId(String(option.key ?? option.label));
      return ({
        ...option,
        label: t(`${prefix}.groups.${groupId}`, String(option.label)),
        children: option.children.map((child) => {
          const optionId = normalizeI18nId(String(child.value));
          return ({ ...child, label: t(`${prefix}.${optionId}`, String(child.label)) });
        }),
      });
    }

    const optionId = normalizeI18nId(String(option.value));
    return ({ ...option, label: t(`${prefix}.${optionId}`, String(option.label)) });
  });
}

const metadata = ref<{ type: string; [k: string]: any }>({
  'type': 'website',
  'twitter:card': 'summary_large_image',
});

watch(
  () => ref(metadata.value.type),
  (_ignored, prevSection) => {
    const section = ogSchemas[prevSection.value];

    if (!section) {
      return;
    }

    section.elements.forEach(({ key }) => {
      metadata.value[key] = '';
    });
  },
);

const sections = computed(() => {
  const secs: OGSchemaType[] = [website, image, twitter];
  const additionalSchema = ogSchemas[metadata.value.type];

  if (additionalSchema) {
    secs.push(additionalSchema);
  }

  return secs;
});

const localizedSections = computed(() => sections.value.map((section) => {
  return ({
    ...section,
    name: t(`tools.og-meta-generator.sections.${normalizeI18nId(section.id)}`, section.name),
    elements: section.elements.map((element) => {
      const fieldKey = normalizeI18nId(element.key);
      const localizedBase = ({
        ...element,
        label: t(`tools.og-meta-generator.fields.${fieldKey}.label`, element.label),
        placeholder: t(`tools.og-meta-generator.fields.${fieldKey}.placeholder`, element.placeholder),
      });

      if (element.type === 'select') {
        if (element.key === 'type') {
          return ({
            ...(localizedBase as OGSchemaTypeElementSelect),
            options: localizeOptions({ options: (element as OGSchemaTypeElementSelect).options, prefix: 'tools.og-meta-generator.options.pageType' }),
          });
        }

        if (element.key === 'twitter:card') {
          return ({
            ...(localizedBase as OGSchemaTypeElementSelect),
            options: localizeOptions({ options: (element as OGSchemaTypeElementSelect).options, prefix: 'tools.og-meta-generator.options.twitterCard' }),
          });
        }
      }

      return localizedBase;
    }),
  });
}));

const metaTags = computed(() => {
  const twitterMeta = _.chain(metadata.value)
    .pickBy((_value, k) => k.startsWith('twitter:'))
    .mapKeys((_value, k) => k.replace(/^twitter:/, ''))
    .value();

  const otherMeta = _.pickBy(metadata.value, (_value, k) => !k.startsWith('twitter:'));

  return generateMeta({ ...otherMeta, twitter: twitterMeta }, { generateTwitterCompatibleMeta: true });
});
</script>

<template>
  <div>
    <div v-for="{ id, name, elements } of localizedSections" :key="id" style="margin-bottom: 15px">
      <div mb-5px>
        {{ name }}
      </div>

      <n-input-group v-for="{ key, type, label, placeholder, ...element } of elements" :key="key">
        <n-input-group-label style="flex: 0 0 110px">
          {{ label }}
        </n-input-group-label>

        <c-input-text v-if="type === 'input'" v-model:value="metadata[key]" :placeholder="placeholder" clearable />
        <n-dynamic-input
          v-else-if="type === 'input-multiple'"
          v-model:value="metadata[key]"
          :min="1"
          :placeholder="placeholder"
          :default-value="['']"
          :show-sort-button="true"
        />

        <c-select
          v-else-if="type === 'select'"
          v-model:value="metadata[key]"
          w-full
          :placeholder="placeholder"
          :options="(element as OGSchemaTypeElementSelect).options"
        />
      </n-input-group>
    </div>
  </div>
  <div>
    <n-form-item :label="t('tools.og-meta-generator.metaTagsLabel')">
      <TextareaCopyable :value="metaTags" language="html" />
    </n-form-item>
  </div>
</template>

<style lang="less" scoped>
.n-input-group {
  margin-bottom: 5px;
}

::v-deep(.n-form-item-blank) {
  min-height: 0 !important;
}
::v-deep(.n-dynamic-input-item) {
  margin-bottom: 5px;
}
</style>
