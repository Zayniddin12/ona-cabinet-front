<template>
  <div class="task-card">
    <div class="head d-flex align-items-center justify-content-between w-100">
      <div class="d-flex flex-column align-items-start">
        <h2 class="task__title">
          {{ $t("activity") }}
        </h2>
        <p class="text--secondary">
          <span class="mr-2">{{ totalHours }}</span>
        </p>
      </div>
      <div class="d-flex align-items-center">
        <p class="text--secondary me-3">{{ $t("date") }}</p>
        <DatePicker v-model="filter.date" />
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div id="chart" :key="loading">
        <apexchart
          type="line"
          height="450"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </transition>
  </div>
  <ActionModal
    :show="resetModal"
    @close="resetModal = false"
    reset
    :form="resetForm"
  />
</template>
<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { isPhone, updateQueryParams } from "@/helpers";
import ActionModal from "@/pages/PRPerson/Components/ActionModal.vue";
import DatePicker from "@/pages/Tasks/Components/DatePicker.vue";
import { IDate, IObject } from "@/types";

const route = useRoute();
const { t } = useI18n();

const resetModal = ref<boolean>(false);
const loading = ref(true);
const filter = reactive<{ date: IDate }>({
  date: {
    start: null,
    end: null,
  },
});
const series = ref([
  {
    data: [],
  },
]);
const totalHours = computed(() => {
  const total = series.value[0].data.reduce((acc: number, item: any) => {
    return acc + item;
  }, 0);
  return convertMinutesToHoursAndMinutes(total);
});
const chartOptions = ref({
  chart: {
    height: 450,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      autoSelected: "pan",
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.5,
    },
  },
  xaxis: {
    type: "datetime",
    categories: [],
    rotate: -45,
    tooltip: {
      enabled: false,
    },
    labels: {
      formatter: function (value: Date) {
        return dayjs(value).format("DD.MM.YYYY");
      },
      offsetX: 20,
    },
  },
  yaxis: {
    labels: {
      minWidth: 90,
      formatter: function (val: number) {
        return val + " " + t("minutes");
      },
    },
  },
  tooltip: {
    custom: function ({
      series,
      seriesIndex,
      dataPointIndex,
    }: {
      series: IObject;
      seriesIndex: [];
      dataPointIndex: number;
    }) {
      return (
        '<div class="pr-person-chart-tooltip">' +
        "<span>" +
        convertMinutesToHoursAndMinutes(series[seriesIndex][dataPointIndex]) +
        "</span>" +
        "</div>"
      );
    },
  },
});
function convertMinutesToHoursAndMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} ${t("minutes")}`;
  } else {
    return `${hours} ${t("hours")} ${remainingMinutes} ${t("minutes")}`;
  }
}
const resetForm = useForm(
  {
    type: 2,
    name: "Мусаев Хайрулла",
    phone_number: "+998 97 183 53 53",
    date_from: "2022-02-06T06:21:15.557Z",
    date_to: "2023-02-06T06:21:15.557Z",
  },
  {
    name: { required },
    type: { required },
    date_from: { required },
    date_to: { required },
    phone_number: { required, isPhone },
  }
);

watch(
  () => filter.date,
  (newValue) => {
    const queryParams: IObject = {
      created_at_after: newValue.start
        ? dayjs(newValue.start).format("YYYY-MM-DD")
        : undefined,
      created_at_before: newValue.end
        ? dayjs(newValue.end).format("YYYY-MM-DD")
        : undefined,
    };
    updateQueryParams(queryParams);
  },
  { deep: true }
);

function fetchChartData(param?: object) {
  loading.value = true;
  ApiService.query(`api/v2/main/ResponsiblePersonActivity/${route.params.id}`, {
    params: {
      ...param,
    },
  })
    .then((res: any) => {
      series.value[0].data = [];
      chartOptions.value.xaxis.categories = [];

      res?.data?.forEach((el: { daily_activity: string; date: string }) => {
        series.value[0].data.push(el?.daily_activity);
        chartOptions.value.xaxis.categories.push(el?.date);
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

onBeforeMount(() => {
  fetchChartData();
});

watch(
  () => route.query,
  (newValue) => {
    fetchChartData(newValue);
  },
  { deep: true }
);
</script>

<style lang="scss">
.pr-person-chart-tooltip {
  background: #1c1f20;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  padding: 8px 16px;
}
.filter__label {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #b5b5c3;
}

.task-card {
  .head {
    padding: 28px 28px 0 28px;
  }

  .task__title {
    text-transform: capitalize;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #1c1f20;
  }

  .task__list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 16px 0 0 0;
    padding: 0;
  }

  .text--secondary {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #b5b5c3;
  }
}
</style>
