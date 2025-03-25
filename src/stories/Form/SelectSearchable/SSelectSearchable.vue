<template>
  <s-form-group
    :label="label"
    class="z-[20]"
    :class="{ 'z-[21]': isDropdownOpen, '!cursor-not-allowed ': disabled }"
  >
    <s-dropdown
      class="!h-11"
      :class="{ ' !pointer-events-none': disabled }"
      full
      :opened="isDropdownOpen"
      @on-toggle="onToggleDropdown"
    >
      <template #head>
        <s-input
          disabled
          :model-value="labelKey ? currentItem[labelKey] : currentItem"
          input-class="cursor-pointer"
          class="!h-11"
          :class="{ '!bg-[#EBEBEB] !text-[#8390A6]': disabled }"
          :error="error"
          :placeholder="placeholder"
        >
        </s-input>
      </template>
      <template v-if="!disabled" #body>
        <div class="h-100">
          <div class="dropdown-search">
            <input
              type="text"
              :placeholder="$t('search')"
              v-model="search"
              class="dropdown-search__input w-100"
            />
          </div>
          <div
            v-for="(item, index) in customList"
            :key="index"
            :class="[
              'searchable-dropdown__item',
              {
                'border-t-[1px] ': index !== 0,
              },
            ]"
            @click="handleSelect(item, index)"
          >
            <p class="searchable-dropdown__item__inner">
              {{ labelKey ? item[labelKey] : item }}
            </p>
          </div>
        </div>
      </template>
    </s-dropdown>
  </s-form-group>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";

import SDropdown from "@/stories/Common/Dropdown/SDropdown.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";

interface Props {
  list: Array<object>;
  label: string;
  valueKey: string;
  labelKey: string;
  iconKey: string;
  error: boolean;
  disabled: boolean;
  placeholder: string;
  modelValue: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  valueKey: undefined,
  iconKey: "",
  labelKey: "",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const isDropdownOpen = ref(false);
const currentItem = ref("");
function handleSelect(item: any, idx: number) {
  isDropdownOpen.value = false;
  currentItem.value = item;
  let current = undefined;

  props.valueKey ? (current = item[props.valueKey]) : (current = item);

  emit("update:modelValue", current);
}

function onToggleDropdown(isOpened: boolean) {
  isDropdownOpen.value = isOpened;
}

async function getCurrent() {
  if (props.modelValue) {
    currentItem.value = props.list.find((e) => e.id == props.modelValue);
  }
}

onMounted(async () => {
  await getCurrent();
});

const customList = ref();

watch(
  () => props.list,
  () => {
    customList.value = props.list;
  },
  {
    immediate: true,
  }
);
// setTimeout(getCurrent, 500)

const search = ref("");

watch(
  () => search.value,
  () => {
    customList.value = props.list.filter((el: any) => {
      return el.label.match(search.value);
    });
  }
);
</script>

<style scoped lang="scss">
.searchable-dropdown__item {
  padding-left: 16px;
  background: #f7faf8;

  transition: all 200ms;
  &:hover {
    background: #7dba281a;
  }
  &__inner {
    padding: 14px 0;
    border-bottom: 1px solid #e8e8e8;
  }
}

.dropdown-search {
  padding: 12px;
  background: #ebf2ed;
  &__input {
    background: #ffffff;
    border: 1.01772px solid #f0f5f2;
    border-radius: 8.14177px;
    outline: none;
    padding: 8px 10px;
  }
}
</style>
