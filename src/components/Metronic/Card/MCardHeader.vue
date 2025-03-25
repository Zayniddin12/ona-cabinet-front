<template>
  <div class="card-header" :class="defaultClass">
    <slot name="title" v-if="!noTitle">
      <MCardTitle v-bind="title" />
    </slot>

    <slot />

    <MCardToolbar v-bind="toolbar" v-if="!noToolbar">
      <slot name="toolbar"></slot>
    </MCardToolbar>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults } from "vue";

import MCardTitle from "./MCardTitle.vue";
import MCardToolbar from "./MCardToolbar.vue";
import { MTCardHeader } from "./types";

withDefaults(defineProps<MTCardHeader>(), {
  noTitle: false,
  noToolbar: false,
});
</script>
