<template>
  <ElSelect
    :key="value"
    popper-class="remote-search-select"
    v-model="value"
    v-bind="{ placeholder }"
    :class="{ error: error }"
    :disabled="disabled"
    filterable
    remote
    reserve-keyword
    remote-show-suffix
    :filter-method="remoteMethod"
  >
    <ElOption
      v-for="item in options"
      :key="item?.id"
      :label="innerUser ? item?.user[labelKey] : item[labelKey]"
      :value="item[valueKey]"
    />
    <div v-if="observe" ref="allItemsTarget" class="p-2"></div>

    <template #empty>
      <p class="select-no-data">{{ $t("not_found") }}</p>
    </template>
  </ElSelect>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";

interface Props {
  error?: boolean;
  disabled?: boolean;
  options?: Array<any>;
  defaultValue?: number;
  observe?: boolean;
  labelKey: string;
  valueKey: string;
  innerUser?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: "full_name",
  valueKey: "id",
  placeholder: "Select",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "on-search", value: string): void;
  (e: "fetch-data"): void;
}>();

const value = ref();
const allItemsTarget = ref(null);
const allItemsIsVisible = ref(false);
const allItemsObserver = ref();

if (props.observe) {
  allItemsObserver.value = useIntersectionObserver(
    allItemsTarget,
    ([{ isIntersecting }]) => {
      allItemsIsVisible.value = isIntersecting;
    }
  );
}

watch(
  () => allItemsIsVisible.value,
  (newValue) => {
    if (newValue) {
      emit("fetch-data");
    }
  }
);

watch(
  () => value.value,
  (val) => {
    emit("update:modelValue", val);
  }
);

onMounted(() => {
  value.value = props.defaultValue;
});

function remoteMethod(searchText: string) {
  emit("on-search", searchText);
}
</script>

<style>
.select-no-data {
  font-weight: 500;
  font-size: 13px;
  line-height: 130%;
  color: #a2abbe;
  text-align: center;
  padding: 8px 12px;
}
</style>
