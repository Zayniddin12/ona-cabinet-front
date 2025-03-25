<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        class="accordion-button fs-4 fw-bold"
        :class="{
          collapsed: collapsed,
        }"
        type="button"
      >
        {{ title }}
      </button>
    </h2>
    <div class="accordion-collapse collapse" :class="{ show: !collapsed }">
      <div class="accordion-body"><slot>...</slot></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MTAccordionItem } from "./types";

withDefaults(defineProps<MTAccordionItem>(), {
  title: "Title",
  collapsed: true,
});
</script>
