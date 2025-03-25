<template>
  <ElDialog
    v-bind="{ width }"
    v-model="filterShow"
    :title="$t('filter')"
    class="filter-modal"
  >
    <form :class="bodyClass" @submit.prevent="submit">
      <div class="filter-modal__body row" :class="wrapperStyle">
        <div
          v-for="(item, index) in filterList"
          :key="'PAFI' + index"
          class="filter-modal__item"
        >
          <label for="name"> {{ item?.fieldLabel }} </label>

          <SRemoteSearch
            v-if="item.searchable"
            v-model="item.fieldValue"
            id="name"
            label-key="name"
            value-key="id"
            :placeholder="item.fieldPlaceholder"
            :options="item?.options"
            :default-value="item.fieldValue"
            observe
            @on-search="$emit('program-search', $event)"
            @fetch-data="$emit('fetch-program')"
          />

          <ElSelect
            v-else-if="item?.type === 'select'"
            v-model="item.fieldValue"
            id="name"
            class="select-padding-zero"
            size="large"
            :placeholder="item.fieldPlaceholder"
            :key="item.fieldValue"
          >
            <ElOption
              v-for="optionItem in item?.options"
              :key="selectOptionValue(item, optionItem)"
              :label="selectOptionLabel(item, optionItem)"
              :value="selectOptionValue(item, optionItem)"
            />
          </ElSelect>

          <ElSelect
            v-if="item?.type === 'condition'"
            v-model="item.fieldValue"
            id="name"
            class="select-padding-zero"
            size="large"
            :placeholder="item.fieldPlaceholder"
            :key="item.fieldValue"
            :multiple="item.selectType === 2"
          >
            <ElOption
              v-for="optionItem in item.options"
              :key="selectOptionValue(item, optionItem)"
              :label="selectOptionLabel(item, optionItem)"
              :value="selectOptionValue(item, optionItem)"
            />

            <template #empty>
              <SButton
                text=""
                loading
                variant="custom"
                class="condition-select-loader mx-auto my-2 bg-transparent"
                spinner-color="#30A1DB"
              />
            </template>
          </ElSelect>

          <SInput
            v-if="item?.type === 'input'"
            v-maska="item.mask"
            :model-value="item?.fieldValue"
            v-model="item.fieldValue"
            :placeholder="item?.fieldPlaceholder"
          />
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-end gap-4 mt-6">
        <SButton
          class="w-25"
          :class="{ 'w-100': full }"
          variant="secondary"
          :text="$t('clear')"
          @click="clear"
        />
        <SButton
          type="submit"
          class="w-25"
          :class="{ 'w-100': full }"
          :text="$t('save')"
        />
      </div>
    </form>
  </ElDialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { replaceZero, updateQueryParams } from "@/helpers";
import SButton from "@/stories/Common/Button/SButton.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";
import {
  IParticipantOption,
  IParticipantsFilterItem,
} from "@/types/participants";

interface Props {
  show?: boolean;
  filters?: Array<any>;
  width?: string;
  bodyClass?: string;
  full?: boolean;
  wrapperStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "80%",
});

// ******* EMITS *******
const emit = defineEmits<{
  (e: "close"): void;
  (e: "change", value: any): void;
}>();

const router = useRouter();
const { t } = useI18n();

const filterShow = ref(false);
const filterList: Ref<IParticipantsFilterItem[]> = ref([]);

watch(
  () => props.show,
  () => {
    filterShow.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => filterShow.value,
  () => {
    if (!filterShow.value) {
      emit("close");
    }
  }
);
watch(
  () => props.filters,
  (value) => {
    if (value?.length) {
      filterList.value = [...value];
    }
  },
  {
    immediate: true,
  }
);

function clear() {
  router.replace({ path: router.currentRoute.value.path });
  emit("close");
}

function submit() {
  const result: any = {
    conditions: [],
  };

  filterList.value.forEach((i: IParticipantsFilterItem) => {
    if (i.type === "select") {
      result[i.paramKey] = replaceZero(i.fieldValue);

      if (i.paramKey === "programs") {
        const program = i.options?.find(
          (option: IParticipantOption) => option.id
        );
        localStorage.setItem("search-program", JSON.stringify(program));
      }

      return;
    }

    if (i.type === "input") {
      const value = String(i.fieldValue)?.replace(/ /g, "");
      value.replace(/ /g, "");

      result[i.paramKey] = +value === 0 ? undefined : value;
      return;
    }

    if (
      i.type !== "condition" ||
      i.fieldValue === 0 ||
      (Array.isArray(i.fieldValue) && i.fieldValue?.includes(0))
    ) {
      return;
    }

    if (i.fieldValue === t("all")) {
      const allKeyIdx = result.conditions.findIndex(
        (condition: number) => condition === i.fieldValue
      );

      if (allKeyIdx !== -1) {
        result.conditions.slice(allKeyIdx, 1);
      }

      return;
    }

    result.conditions =
      i.selectType === 1
        ? [...result.conditions, i.fieldValue]
        : [...result.conditions, ...i.fieldValue];
  });

  updateQueryParams(result);

  emit("close");
}

function selectOptionValue(
  item: IParticipantsFilterItem,
  optionItem: IParticipantOption
) {
  return item.optionValueKey
    ? optionItem[item.optionValueKey]
    : optionItem.value;
}

function selectOptionLabel(
  item: IParticipantsFilterItem,
  optionItem: IParticipantOption
) {
  return item.optionLabelKey
    ? optionItem[item.optionLabelKey]
    : optionItem.label;
}
</script>

<style lang="scss">
.filter-modal {
  .el-dialog__body {
    padding: 14px 24px 24px !important;
  }

  &__item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #191e36;
      opacity: 0.7;
      margin-bottom: 12px;
    }
  }
}

.condition-select-loader {
  background: transparent !important;
}
</style>
