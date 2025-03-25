<template>
  <div class="main">
    <h2 v-if="!$route.path.includes('supports')" class="title">
      {{ data?.participant?.full_name }}
    </h2>
    <div class="mt-5 d-flex align-items-center gap-4">
      <div class="item">
        <p class="value">{{ data?.akt_number }}</p>
        <p class="label mt-1">{{ $t("akt_ID") }}</p>
      </div>
      <div class="item">
        <p class="value">
          {{ formatDate(data?.akt_date) }}
        </p>
        <p class="label mt-1">{{ $t("akt_date") }}</p>
      </div>
      <div class="item">
        <p class="value">
          {{ formatNumber(data?.sum) }}
        </p>
        <p class="label mt-1">{{ $t("amount_money") }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatNumber } from "@/helpers";

interface Props {
  data?: {
    id: number;
    participant?: {
      id: number;
      full_name: string;
    };
    akt_number: number | string;
    given_accessories: string;
    description: string;
    akt_date: string;
    sum: number | string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.main {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
}
.title {
  font-family: "Roboto";
  font-weight: 500;
  font-size: 22px;
  line-height: 140%;
  color: #3f4254;
}
.item {
  background: #ffffff;
  border: 1px dashed #e4e6ef;
  border-radius: 6px;
  padding: 8px 12px;
}
.value {
  font-weight: 600;
  font-size: 14px;
  line-height: 130%;
  color: #1c1f20;
}

.label {
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: #a2abbe;
}
</style>
