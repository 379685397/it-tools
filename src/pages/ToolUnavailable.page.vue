<script setup lang="ts">
import { useHead } from '@vueuse/head';

const { t } = useI18n();
useHead({ title: t('toolUnavailable.headTitle') });
</script>

<template>
  <div mt-20 flex flex-col items-center>
    <span text-90px lh-1 op-50>
      <icon-mdi:cancel />
    </span>

    <h1 m-0 mt-3>
      {{ t('toolUnavailable.title') }}
    </h1>
    <div mt-4 op-60>
      {{ t('toolUnavailable.description') }}
    </div>

    <c-button to="/" mt-8>
      {{ t('toolUnavailable.backHome') }}
    </c-button>
  </div>
</template>
