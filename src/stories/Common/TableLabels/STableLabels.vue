<template>
  <ul class="i-table-label d-flex align-items-center m-0 p-0">
    <li
      v-for="(label, index) in labels"
      :key="index"
      class="d-flex align-items-center me-5"
    >
      <div :class="['i-table-label__circle', label.color]"></div>
      <p class="i-table-label__title">{{ $t(label.title) }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
// ******* PROPS *******

interface Props {
  labels?: {
    color: "green" | "grey" | "red";
    title: string;
  }[];
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss">
.i-table-label {
  &__circle {
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border: 3px solid;
    margin-right: 8px;
  }

  &__circle.green {
    border-color: #2ed47a;
  }

  &__circle.grey {
    border-color: #a2abbe;
  }

  &__circle.yellow {
    border-color: #ffa800;
  }

  &__circle.red {
    border-color: #de2727;
  }
}
</style>
