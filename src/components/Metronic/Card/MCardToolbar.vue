<template>
  <div class="card-toolbar" :class="defaultClass">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { MTCardToolbar } from "./types";

withDefaults(defineProps<MTCardToolbar>(), {});
</script>
