<template>
  <div
    class="s-textarea"
    :class="[
      error ? 'border-red' : 'focus-within:border-green',
      disabled ? 'border-transparent' : '',
    ]"
  >
    <textarea
      :id="id"
      :value="modelValue"
      v-bind="{ type, minlength, maxlength, max, min, disabled, readonly }"
      :class="[inputClass]"
      class="s-textarea__inner w-full outline-none scroll-mini"
      ref="kInput"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// ******* PROPS *******
interface Props {
  id?: string;
  type?: string;
  placeholder?: string;
  modelValue?: number | string;
  disabled?: boolean;
  error?: boolean;
  maxlength?: number;
  minlength?: number;
  max?: number;
  min?: number;
  inputClass?: string;
  prefixClass?: string;
  suffixClass?: string;
  readonly?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: "text",
  maxlength: undefined,
  minlength: undefined,
  max: undefined,
  min: undefined,
  inputClass: undefined,
});

// ******* EMITS *******
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "blur", value: Event): void;
}>();

// ******* PLUGINS *******

const handleInput = (e: any) => {
  emit("update:modelValue", e.target.value);
};
const handleBlur = (e: Event) => {
  emit("blur", e);
};

const kInput = ref();
defineExpose({ kInput });
</script>

<style lang="scss" scoped>
.s-textarea {
  display: inline-flex;
  overflow: hidden;
  position: relative;
  transition-property: all;
  transition-duration: 500ms;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background: #f3f6f9;
  padding: 12px 0;

  &:focus-within {
    background: #ffffff;
    border: 1px solid #30a1db;
  }

  textarea {
    resize: none;
    height: 102px;
  }

  &__inner {
    padding: 0 16px;
    background-color: transparent;
    flex-grow: 1;
    border: none;
    outline: none;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #1c1f20;
    &::placeholder {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #a2abbe;
    }
  }
}

.prefix-custom {
  height: 100%;
  padding: 10px;
  background: #d0d2d0;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: #626362;
}

.border-red {
  border-color: #fd5757 !important;
}

.scroll-mini::-webkit-scrollbar {
  width: 2px;
}

.scroll-mini::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scroll-mini::-webkit-scrollbar-thumb {
  background: #30a1db;
}
</style>
