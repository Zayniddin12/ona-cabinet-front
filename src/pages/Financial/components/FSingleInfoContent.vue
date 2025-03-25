<template>
  <div class="main" v-if="data?.description || data?.given_accessories">
    <p class="title" v-if="data?.description">
      {{ $t("description") }}
    </p>
    <div class="text mt-4" v-html="data?.description"></div>

    <div class="mt-5" v-if="data?.given_accessories">
      <div class="title">
        {{ $t("things") }}
      </div>
      <div class="mt-4" v-html="data?.given_accessories"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data?: {
    id: number;
    participant: string;
    akt_number: number | string;
    given_accessories: string;
    description: string;
    akt_date: string;
    sum: number | string;
  };
}

defineProps<Props>();

const locale = localStorage.getItem("locale");
</script>

<style scoped>
.main {
  background: #ffffff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  padding: 28px;
}

.title {
  font-weight: 500;
  font-size: 22px;
  line-height: 140%;
  color: #1c1f20;
}

.text {
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  color: #1c1f20;
}

.ul-element {
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  color: #1c1f20;
  margin-top: 6px;
}
</style>
<!--mergedaw-->
