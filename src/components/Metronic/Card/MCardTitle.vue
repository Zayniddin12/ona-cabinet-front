<template>
  <h3
    class="card-title"
    :class="[
      {
        'align-items-start flex-column': subTitle?.length > 0,
      },
      defaultClass,
    ]"
  >
    <span
      class="fw-bold"
      :class="[
        {
          'card-label fs-3 mb-1': subTitle?.length > 0,
        },
        titleClass,
      ]"
      >{{ title }}</span
    >
    <span
      :class="subTitleClass"
      class="text-muted fw-semobold fs-7"
      v-if="subTitle"
      >{{ subTitle }}</span
    >
  </h3>
</template>

<script lang="ts" setup>
import { MTCardTitle } from "./types";

withDefaults(defineProps<MTCardTitle>(), {});
</script>
