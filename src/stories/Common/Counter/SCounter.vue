<template>
  <div class="i-counter rounded-xl d-flex gap-2 align-items-center">
    <button @click="decrease" class="i-counter__btn">
      <inline-svg
        src="/assets/icons/duotune/arrows/arr014.svg"
        class="text-i-green"
      />
    </button>
    <input
      type="number"
      v-model="count"
      max="99999999"
      min="0"
      class="i-counter__value d-flex align-items-center justify-content-center fw-bold fs-4 text-i-primary"
      @input="onChangeCount"
    />
    <button @click="increase" class="i-counter__btn">
      <inline-svg
        src="/assets/icons/duotune/arrows/arr013.svg"
        class="text-i-green"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
// ******* PROPS *******
import { ref, watch } from "vue";

interface Props {
  defaultCount?: number;
}
const props = withDefaults(defineProps<Props>(), {});

const count = ref(0);

watch(
  () => props.defaultCount,
  (newValue) => {
    if (newValue) {
      count.value = newValue;
    }
  }
);

const decrease = () => {
  if (count.value > 0) {
    count.value--;
  }
};
const increase = () => {
  count.value++;
};
const onChangeCount = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;

  if (target?.value.includes("-") || event.data?.includes("-")) {
    event.preventDefault();
  }
};
</script>

<style lang="scss">
.i-counter {
  height: 44px;

  &__btn {
    background-color: rgba(125, 186, 40, 0.2);
    border-radius: 8px;
    width: 44px;
    height: 100%;
    border: none;
  }

  &__btn:first-child {
    margin-right: 8px;
  }

  &__btn:last-child {
    margin-left: 8px;
  }

  &__btn-icon {
    background-color: #7dba28;
    border-radius: 100%;
  }

  &__value {
    background: #f7faf8;
    border: none;
    border-radius: 8px;
    height: 100%;
    width: 80px;
    text-align: center;
  }

  &__value:focus {
    border: none;
    outline: none;
  }
}
</style>
