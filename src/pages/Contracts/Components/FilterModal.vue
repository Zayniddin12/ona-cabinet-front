<template>
  <el-dialog
    :title="$t('filter')"
    width="480px"
    v-model="filterShow"
    class="filter-modal"
  >
    <div class="filter-modal__body">
      <div class="filter-modal__item">
        <label for="name"> {{ $t("status") }} </label>

        <el-select
          v-model="filterData.status"
          id="name"
          :placeholder="$t('choose_status')"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="filter-modal__item w-50">
          <label for="name"> {{ $t("started_date") }} </label>

          <DatePicker
            v-model="filterData.start_date"
            :max-date="filterData.end_date"
          />
        </div>
        <div class="filter-modal__item w-50">
          <label for="name"> {{ $t("ended_date") }} </label>

          <DatePicker
            v-model="filterData.end_date"
            :min-date="filterData.start_date"
          />
        </div>
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
import dayjs from "dayjs";
import { onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import DatePicker from "@/components/Datepicker/DatePicker.vue";
import router from "@/router";
import SButton from "@/stories/Common/Button/SButton.vue";

interface Props {
  show?: boolean;
  participantList?: any;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["close", "submit"]);
const route = useRoute();

const { t } = useI18n();

const filterShow = ref(false);

const filterData = ref<{
  status: number | null;
  start_date: string;
  end_date: string;
}>({
  status: null,
  start_date: "",
  end_date: "",
});

const filterClear = () => {
  filterData.value = {
    status: null,
    start_date: "",
    end_date: "",
  };
};

const submitForm = () => {
  const start_date = dayjs(filterData.value.start_date).format("DD.MM.YYYY");
  const end_date = dayjs(filterData.value.end_date).format("DD.MM.YYYY");
  const query = {
    status: filterData.value.status || undefined,
    end_date: filterData.value.end_date ? end_date : undefined,
    start_date: filterData.value.start_date ? start_date : undefined,
  };
  router.push({
    name: route.name,
    query,
  });
  emit("submit", query);
};

const statusList = [
  {
    value: undefined,
    label: t("all"),
  },
  {
    value: 1,
    label: t("statusArr[0]"),
  },
  {
    value: 2,
    label: t("statusArr[1]"),
  },
  {
    value: 3,
    label: t("statusArr[2]"),
  },
];

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
  filterData.value.status = Number(route.query.status) || null;
  filterData.value.start_date = route.query.start_date
    ? String(route.query.start_date)
    : "";
  filterData.value.end_date = route.query.start_date
    ? String(route.query.end_date)
    : "";
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
