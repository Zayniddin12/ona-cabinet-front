<template>
  <el-dialog
    :title="$t('filter')"
    width="480px"
    v-model="filterShow"
    class="filter-modal"
  >
    <div>
      <div class="filter-modal__item">
        <label for="name"> {{ $t("partner_type") }} </label>
        <el-select
          v-model="filterData.type"
          id="name"
          :placeholder="$t('choose_type')"
        >
          <el-option
            v-for="item in partnerTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="filter-modal__item">
        <label for="name"> {{ $t("region") }} </label>
        <el-select
          v-model="filterData.region"
          id="name"
          :placeholder="$t('choose_region')"
        >
          <el-option
            v-for="item in regionComputed"
            :key="item.id"
            :label="item.title"
            :value="item.code"
          />
        </el-select>
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-end gap-4 mt-7">
      <SButton
        class="w-50"
        variant="secondary"
        :text="$t('clear')"
        @click="filterClear"
      />
      <SButton class="w-50" :text="$t('save')" @click="submitForm" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import router from "@/router";
import SButton from "@/stories/Common/Button/SButton.vue";

interface Props {
  show?: boolean;
  regions?: { code: number; id: number; title: string }[];
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close", "submit"]);
const { t } = useI18n();
const route = useRoute();

const regionComputed = computed(() => {
  return [
    { code: undefined, id: undefined, title: t("all") },
    ...props.regions,
  ];
});

const filterShow = ref(false);
const filterData = ref<{ type: string; region: number | null }>({
  type: "",
  region: null,
});
const partnerTypeList = [
  {
    value: undefined,
    label: t("all"),
  },
  {
    value: "jismoniy",
    label: t("jismoniy"),
  },
  {
    value: "yuridik",
    label: t("yuridik"),
  },
];

const filterClear = () => {
  filterData.value = {
    type: "",
    region: null,
  };
};

const submitForm = () => {
  const query = {
    type: filterData.value.type || undefined,
    region: filterData.value.region || undefined,
  };
  router.push({
    name: route.name,
    query,
  });
  emit("submit", query);
};

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

onBeforeMount(() => {
  filterData.value.type = route.query.type || "";
  filterData.value.region = Number(route.query.region) || null;
});
</script>

<style lang="scss" scoped>
.filter-modal {
  &__body {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  .el-dialog__body {
    padding: 24px !important;
  }

  &__item {
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
</style>
