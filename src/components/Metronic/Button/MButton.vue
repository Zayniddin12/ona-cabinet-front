<template>
  <button class="btn" :class="classes"><slot /></button>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { MTButton } from "./types";

const props = withDefaults(defineProps<MTButton>(), {
  flushed: false,
  link: false,
});

const classes = computed<string[]>(() => {
  const result: string[] = [];

  if (props.light) {
    result.push(`btn-light-${props.light}`);
  } else if (props.outline) {
    result.push("btn-outline");
    result.push(`btn-outline-${props.outline}`);
  } else if (props.dashed) {
    result.push("btn-outline");
    result.push("btn-outline-dashed");
    result.push(`btn-outline-${props.dashed}`);
  } else if (props.variant) {
    result.push(`btn-${props.variant}`);
  }

  if (props.flushed) {
    result.push("btn-flushed");
  }

  if (props.link) {
    result.push("btn-link");
  }

  if (props.hoverEffect) {
    result.push(`btn-hover-${props.hoverEffect}`);
  }

  return result;
});
</script>
