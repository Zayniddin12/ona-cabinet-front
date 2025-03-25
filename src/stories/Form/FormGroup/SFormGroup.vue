<template>
  <div class="d-flex flex-column gap-3 w-100">
    <div class="d-flex align-items-center justify-content-between w-100">
      <SLabel :title="label" v-bind="{ required }" />
      <slot name="labelOpposite" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import SLabel from "@/stories/Form/Label/SLabel.vue";

interface Props {
  label: string;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: "",
});
</script>
