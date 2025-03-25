<template>
  <div class="d-block">
    <div class="date-picker__wrapper" :class="[inputClass]">
      <TheDatePicker
        v-model="value"
        is-range
        :popover="{ visibility: 'click' }"
        :key="clearTrigger"
        :masks="{ input: 'DD/MM/YYYY' }"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <div class="d-flex justify-content-center align-items-center gap-3">
            <div>
              <span v-if="$i18n.locale === 'ru'" class="datepicker__text mr-1">
                {{ $t("from") }}
              </span>
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="date-picker__input"
                :placeholder="$t('kk_mm_yyyy')"
              />
              <span v-if="$i18n.locale === 'uz'" class="datepicker__text">
                {{ $t("from") }}
              </span>
            </div>
            <div>
              <span v-if="$i18n.locale === 'ru'" class="datepicker__text mr-1">
                {{ $t("to") }}
              </span>
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="date-picker__input"
                :placeholder="$t('kk_mm_yyyy')"
              />
              <span v-if="$i18n.locale === 'uz'" class="datepicker__text">
                {{ $t("to") }}
              </span>
            </div>
          </div>
        </template>
      </TheDatePicker>

      <div class="search-clear">
        <transition name="fade" mode="out-in">
          <span
            v-if="value?.start || value?.end"
            class="suffix ms-2 cursor-pointer"
            @click="clearDate"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { IDate } from "@/types";

interface Props {
  modelValue: IDate;
  inputClass?: string;
  label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "from", "to"]);
const route = useRoute();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue: IDate) {
    emit("update:modelValue", newValue);
  },
});

const clearTrigger = ref(0);
const clearDate = () => {
  clearTrigger.value++;
  emit("update:modelValue", { start: null, end: null });
};

onMounted(() => {
  if (route.query.deadline__gte || route.query.deadline__lte) {
    const defaultValue: IDate = {
      start: route.query.deadline__gte
        ? String(route.query.deadline__gte)
        : null,
      end: route.query.deadline__lte ? String(route.query.deadline__lte) : null,
    };

    emit("update:modelValue", defaultValue);
  }
});
</script>

<style lang="scss">
.date-picker__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #f0f1f4;
  border-radius: 8px;
  padding: 10px 11px;

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
    width: 75px;
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
}

.mr-1 {
  margin-right: 4px;
}
</style>
