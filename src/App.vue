<template>
  <RouterView v-slot="{ Component }">
    <component :is="Component" />
  </RouterView>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from "vue";
import { useStore } from "vuex";

import { initializeComponents } from "@/core/plugins/keenthemes";
import { Mutations } from "@/store/enums/StoreEnums";

export default defineComponent({
  name: "app",
  setup() {
    const store = useStore();

    onMounted(() => {
      /**
       * this is to override the layout config using saved data from localStorage
       * remove this to use config only from static config (@/core/config/DefaultLayoutConfig.ts)
       */
      store.commit(Mutations.OVERRIDE_LAYOUT_CONFIG);

      nextTick(() => {
        initializeComponents();
      });
    });
  },
});
</script>

<style lang="scss">
@import "~bootstrap-icons/font/bootstrap-icons.css";
@import "~apexcharts/dist/apexcharts.css";
@import "~quill/dist/quill.snow.css";
@import "~animate.css";
@import "~sweetalert2/dist/sweetalert2.css";
@import "~nouislider/distribute/nouislider.css";
@import "~@fortawesome/fontawesome-free/css/all.min.css";
@import "~socicon/css/socicon.css";
@import "~line-awesome/dist/line-awesome/css/line-awesome.css";
@import "~dropzone/dist/dropzone.css";
@import "~@vueform/multiselect/themes/default.css";
@import "~prism-themes/themes/prism-shades-of-purple.css";
@import "~element-plus/dist/index.css";

.el-dropdown-menu__item .dropdown-icon {
  margin-right: 8px;
}

.el-select .el-input__wrapper {
  box-shadow: none !important;
  border: 1px solid #f3f6f9;
  transition: 200ms linear;
  background: #f3f6f9 !important;
  border-radius: 8px !important;
  padding: 6px 16px !important;
  &:focus-within {
    background: #fff !important;
  }
}

.select-padding-zero .el-input .el-input__wrapper {
  padding: 2px 16px !important;
}

.error .el-input .el-input__wrapper {
  border-color: #fa3232;
}

.error-select .el-input .el-input__wrapper {
  border-color: #fd5757;
}

.el-select {
  width: 100%;

  .is-focus {
    .el-input__wrapper {
      border: 1px solid #30a1db;
      box-shadow: none !important;
    }
  }

  .el-input {
    &__inner {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #1c1f20;

      &::placeholder {
        color: #a2abbe;
      }
    }
  }
}

.el-select .el-input.is-focus .el-input__wrapper {
  box-shadow: none !important;
}

.el-select-dropdown__item.selected {
  color: #1c1f20;
  background: #f3f6f9 !important;
}

.el-select-dropdown__item {
  padding: 12px;
  height: unset !important;
  line-height: 16px;
  transition: 200ms linear;
}

.el-select-dropdown__item:hover {
  background: #f3f6f9 !important;
}

// Date Picker
.date-picker .el-input__wrapper {
  box-shadow: none !important;
  border: 1px solid #f0f1f4;
  transition: 200ms linear;
  background: #f3f6f9 !important;
  border-radius: 8px !important;
  padding: 21px 12px !important;
}

.error .el-input__wrapper {
  border-color: #fa3232;
}

.error-select .el-input__wrapper {
  border-color: #fd5757;
}

.date-picker {
  width: 100%;
  .is-focus {
    .el-input__wrapper {
      border: 1px solid #30a1db;
      box-shadow: none !important;
    }
  }
}

.date-picker .el-input.is-focus .el-input__wrapper {
  box-shadow: none !important;
}

.el-select-dropdown__item.selected {
  color: #30a1db;
  background: #eaf5fb !important;
}

.el-select-dropdown__item {
  padding: 12px;
  height: unset !important;
  line-height: 16px;
  transition: 200ms linear;
}

.el-select-dropdown__item:hover {
  background: #eaf5fb !important;
}

.calendar-gray {
  path {
    stroke: #a2abbe;
  }
}
</style>
