<template>
  <div
    class="date-picker__wrapper"
    :class="[inputClass, error ? 'border-red' : 'focus-within:border-green']"
  >
    <TheDatePicker
      v-model="date"
      :popover="{ visibility: 'click' }"
      :min-date="minDate"
      :max-date="maxDate"
    >
      <template v-slot="{ inputValue, inputEvents }">
        <input
          class="date-picker__input"
          :value="inputValue"
          v-on="inputEvents"
          :placeholder="$t('kk_mm_yyyy')"
          :disabled="disabled"
          readonly
        />
      </template>
    </TheDatePicker>
    <span class="datepicker__text">
      <InlineSvg
        src="/assets/ona/svg/date-calendar.svg"
        class="icon__calendar"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: string;
  inputClass?: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["update:modelValue"]);

const date = ref<string>(props.modelValue ?? "");

watch(
  () => date.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

watch(
  () => props.modelValue,
  () => {
    date.value = props.modelValue;
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.date-picker__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3f6f9;
  border-radius: 8px;
  padding: 10px 11px;
  border: 1px solid transparent;
  position: relative;
}
</style>

<style lang="scss" scoped>
.date-picker__wrapper {
  .trigger {
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #1c1f20;
  }

  .datepicker {
    margin-right: 4px;
  }

  .datepicker__text {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #a2abbe;
  }

  .date-picker__input {
    width: 100%;
    position: absolute;
    inset: 0;
    padding-left: 12px;
    background: transparent;
    border: none;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #1c1f20;
    outline: none;

    &::placeholder {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      color: #1c1f20;
    }
  }

  &.border-red {
    border-color: #fd5757 !important;
  }
}
</style>
