<template>
  <div class="card-body" :class="[{ 'card-scroll': scroll }, defaultClass]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { withDefaults } from "vue";

import { MTCardBody } from "./types";

withDefaults(defineProps<MTCardBody>(), {
  scroll: false,
});
</script>
