<template>
  <div class="d-block">
    <div class="date-picker__wrapper" :class="[inputClass]">
      <TheDatePicker
        v-model="value"
        is-range
        :popover="{ visibility: 'click' }"
        :masks="{ input: 'DD/MM/YYYY' }"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <div class="d-flex justify-content-center align-items-center gap-3">
            <div
              class="d-flex align-items-center"
              :class="{ 'gap-1': $i18n.locale === 'ru' }"
            >
              <span v-if="$i18n.locale === 'ru'" class="datepicker__text">
                {{ $t("from") }}
              </span>
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="date-picker__input date-picker__from"
                :placeholder="$t('kk_mm_yyyy')"
              />
              <span v-if="$i18n.locale === 'uz'" class="datepicker__text">
                {{ $t("from") }}
              </span>
            </div>
            <div
              class="d-flex align-items-center"
              :class="{ 'gap-1': $i18n.locale === 'ru' }"
            >
              <span v-if="$i18n.locale === 'ru'" class="datepicker__text">
                {{ $t("to") }}
              </span>
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="date-picker__input date-picker__to"
                :placeholder="$t('kk_mm_yyyy')"
              />
            </div>
            <span v-if="$i18n.locale === 'uz'" class="datepicker__text">
              {{ $t("to") }}
            </span>
          </div>
        </template>
      </TheDatePicker>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { IDate } from "@/types";

const route = useRoute();

interface Props {
  modelValue: IDate;
  inputClass?: string;
  label?: string;
  queryKeyFrom?: string;
  queryKeyTo?: string;
  withClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  queryKeyFrom: "d-from",
  queryKeyTo: "d-to",
});

const emit = defineEmits(["update:modelValue", "from", "to", "clear"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue: IDate) {
    emit("update:modelValue", newValue);
  },
});

onMounted(() => {
  value.value.start = route.query[props.queryKeyFrom] as string;
  value.value.end = route.query[props.queryKeyTo] as string;
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
</style>
