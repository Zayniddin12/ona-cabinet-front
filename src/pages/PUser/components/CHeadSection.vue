<template>
  <div class="section-head d-flex align-items-center justify-content-between">
    <SBreadcrumb :routes="routes" />
    <div class="d-flex align-items-center section-head__actions gap-3">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";

import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";

interface Props {
  routes?: { name: string; route: string; link: boolean }[];
}

const props = withDefaults(defineProps<Props>(), {});

const routes = computed(() => {
  if (props.routes) {
    return props.routes;
  } else {
    return [
      {
        name: "main",
        route: "/",
        link: false,
      },
      {
        name: "menus.participants",
        route: "/",
        link: false,
      },
    ];
  }
});
</script>
<style lang="scss">
.section-head {
  background: white;
  border-top: 1px solid #eff2f5;
  padding: 9px 28px;

  &__actions {
    label {
      font-weight: 500;
      font-size: 13px;
      line-height: 15px;
      display: flex;
      align-items: center;
      color: #1c1f20;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>
