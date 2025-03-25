<template>
  <div class="card-footer" :class="defaultClass"><slot /></div>
</template>

<script lang="ts" setup>
import { withDefaults } from "vue";

import { MTCardFooter } from "./types";

withDefaults(defineProps<MTCardFooter>(), {});
</script>
