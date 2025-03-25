<template>
  <div class="card bg-white p-6 rounded-12 border h-100">
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="i-table__title fw-bold text-i-primary text-capitalize">
        {{ $t("menus.contract") }}
      </h2>

      <div class="d-flex align-items-start">
        <button
          class="tab-button-hover px-8 bg-transparent rounded-6 hover fw-semibold py-2 border text-secondary-dark fs-7"
          :class="{ 'i-bg-blue-100 text-white': active === 'current' }"
          @click="active = 'current'"
        >
          {{ $t("current_month") }}
        </button>
        <button
          class="tab-button-hover px-8 bg-transparent rounded-6 hover fw-semibold py-2 border text-secondary-dark fs-7"
          :class="{ 'i-bg-blue-100 text-white': active === '6_months' }"
          @click="active = '6_months'"
        >
          {{ $t("6_months") }}
        </button>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="active" class="h-181">
        <SChartCurrent :data="contractActive" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import SChartCurrent from "@/pages/Dashboard/components/Charts/SChartCurrent.vue";

interface Props {
  contract?: any;
}

const props = withDefaults(defineProps<Props>(), {});
const active = ref("current");

const contractActive = computed(() => {
  if (active.value === "current") {
    return props.contract?.dg_contract_this_month;
  } else {
    return props.contract?.dg_contract_six_month;
  }
});
</script>

<style scoped>
button {
  outline: none;
  border: none !important;
}

.tab-button-hover:hover {
  opacity: 80%;
}

.h-181 {
  height: 181px;
}
</style>
