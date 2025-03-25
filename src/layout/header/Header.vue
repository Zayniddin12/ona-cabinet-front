<template>
  <!--begin::Header-->
  <div id="kt_header" style="" class="header align-items-stretch">
    <!--begin::Container-->
    <div
      :class="{
        'header-container-fluid': headerWidthFluid,
        'header-container-xxl': !headerWidthFluid,
      }"
      class="d-flex align-items-stretch justify-content-between"
    >
      <!--begin::Aside mobile toggle-->
      <div
        class="d-flex align-items-center d-lg-none ms-n3 me-1"
        title="Show aside menu"
      >
        <div
          class="btn btn-icon btn-active-light-primary"
          id="kt_aside_mobile_toggle"
        >
          <span class="svg-icon svg-icon-2x mt-1">
            <inline-svg src="/assets/icons/duotune/abstract/abs015.svg" />
          </span>
        </div>
      </div>
      <!--end::Aside mobile toggle-->

      <!--begin::Wrapper-->
      <div class="topbar-wrapper">
        <div id="topbar-title" class="topbar-title"></div>
        <KTTopbar />
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Header-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

import {
  asideDisplay,
  headerLeft,
  headerWidthFluid,
} from "@/core/helpers/config";
// import KTMenu from "@/layout/header/Menu.vue";
import KTTopbar from "@/layout/header/Topbar.vue";

export default defineComponent({
  name: "KTHeader",
  props: {
    title: String,
  },
  components: {
    KTTopbar,
    // KTMenu,
  },
  setup() {
    return {
      headerWidthFluid,
      headerLeft,
      asideDisplay,
    };
  },
});
</script>

<style lang="scss">
.topbar {
  &-wrapper {
    width: 100%;
    gap: 20px;
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
  }

  &-title {
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    color: #1c1f20;
  }

  .breadcrumb {
    width: max-content;
    overflow-x: auto;
  }
}

.breadcrumb-item:not(.text-muted) {
  color: #7dba28 !important;

  a {
    color: #353d35 !important;

    &:hover {
      color: #7dba28 !important;
    }
  }
}
</style>
