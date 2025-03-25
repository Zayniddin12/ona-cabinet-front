<template>
  <apexchart
    ref="chartRef"
    :options="options"
    :series="series"
    height="200"
    type="area"
  ></apexchart>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  data?: any;
}

const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();

const options = computed(() => {
  return {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    toolbar: {
      show: false,
    },
    colors: ["#30A1DB"],
    fill: {
      type: "solid",
      colors: ["#E1F0FF"],
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
    },
    xaxis: {
      categories: props.data?.map((el: any) => {
        const day = dayjs(el?.date).format("DD");
        const month = new Date(el?.date).getMonth();

        return day + `-${t(`months[${month}]`)}`;
      }),

      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#A2ABBE",
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: "#30A1DB",
          width: 1,
          dashArray: 3,
        },
      },
    },

    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#A2ABBE",
          fontSize: "12px",
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      enabled: false,
      style: {
        fontSize: "12px",
      },
      marker: {
        show: false,
      },
    },
  };
});

const series = computed(() => [
  {
    data: props.data?.map((el: any) => el?.count),
  },
]);
</script>
