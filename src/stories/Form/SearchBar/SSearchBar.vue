<template>
  <div class="s-input">
    <span class="prefix" :class="[prefixClass, focus ? 'focus-search' : '']">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="9.16634"
          cy="9.16666"
          r="5.83333"
          stroke="#7D867D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16.6663 16.6667L13.333 13.3333"
          stroke="#7D867D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <input
      :id="id"
      v-model="value"
      v-bind="{ type, minlength, maxlength, max, min, disabled, readonly }"
      :class="[inputClass]"
      class="s-input__inner w-full outline-none"
      ref="kInput"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
      @focus="focus = true"
    />

    <div class="search-clear">
      <transition name="fade" mode="out-in">
        <span
          v-if="value?.length"
          class="suffix"
          :class="suffixClass"
          @click="value = ''"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33398 3.33334L12.6667 12.6661"
              stroke="#7D867D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.33337 12.6661L12.6661 3.33334"
              stroke="#7D867D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { debounce } from "@/helpers";

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

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  maxlength: undefined,
  minlength: undefined,
  max: undefined,
  min: undefined,
  inputClass: undefined,
});

const route = useRoute();

// ******* EMITS *******
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "blur", value: Event): void;
}>();

const focus = ref(false);

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    debounce("search", () => emit("update:modelValue", value));
  },
});
const handleBlur = (e: Event) => {
  emit("blur", e);
  focus.value = false;
};
const handleInput = (e: InputEvent) => {
  const target = e.target as HTMLInputElement;
  value.value = target.value;
};

watch(
  () => route.query.search,
  (newValue) => {
    if (!newValue) {
      emit("update:modelValue", undefined);
    }
  }
);

const kInput = ref();
defineExpose({ kInput });
</script>

<style lang="scss" scoped>
.s-input {
  align-items: center;
  display: inline-flex;
  overflow: hidden;
  position: relative;
  transition-property: all;
  transition-duration: 500ms;
  width: 100%;
  background: #f3f6f9;
  border-radius: 8px;
  border: 1px solid transparent;

  &:focus-within {
    background: #ffffff;
    border: 1px solid #30a1db;
  }

  &__inner {
    padding: 8px 11px;
    background-color: transparent;
    flex-grow: 1;
    border: none;
    outline: none;
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #353d35;

    &::placeholder {
      font-weight: 400;
      font-size: 13px;
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

.prefix {
  margin-left: 12px;

  svg {
    path {
      transition: 200ms linear;
    }

    circle {
      transition: 200ms linear;
    }
  }
}

.suffix {
  margin-right: 12px;
  cursor: pointer;
}

.search-clear {
  width: 16px;
  height: 16px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
}

//.focus-search {
//  svg {
//    path {
//      stroke: #7dba28;
//    }
//
//    circle {
//      stroke: #7dba28;
//    }
//  }
//}
</style>
