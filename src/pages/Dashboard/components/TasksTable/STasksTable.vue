<template>
  <div class="i-table bg-white rounded-4">
    <slot name="header">
      <header class="d-flex p-6 justify-content-between pb-6">
        <div>
          <h2 class="i-table__title fw-bold text-i-primary text-capitalize">
            {{ title }}
          </h2>
          <p v-if="subtitle" class="fs-7 text-i-secondary">{{ subtitle }}</p>
        </div>
        <RouterLink
          to="/dashboard/task/all"
          class="fs-16 hover-opacity lh-16 fw-semibold text-blue"
        >
          {{ $t("all_tasks") }}
          <inline-svg src="/assets/ona/svg/arrow-right.svg" />
        </RouterLink>
      </header>
    </slot>
    <KTDataTable
      v-bind="{ data, currentPage, total }"
      :header="TableHeader"
      @change-page="$emit('page-change', $event)"
      :isNotEnd="isNotEnd"
    >
      <template v-slot:id="{ row: data }"> {{ data.index }}.</template>
      <template v-slot:label="{ row: data }">
        {{ data?.name }}
      </template>
      <template v-slot:akt="{ row: data }"> {{ data.akt_number }}</template>
      <template v-slot:status="{ row: data }">
        <SBadge
          class="w-75 d-flex align-items-center justify-content-center"
          :text="$t(data?.status)"
          :variant="getVariant(data?.status)"
        />
      </template>
      <template v-slot:responsible="{ row: data }">
        {{ data?.responsible_person }}
      </template>
      <template v-slot:deadline="{ row: data }">
        <p class="text-left">
          {{ dayjs(data?.deadline).format("DD.MM.YYYY") }}
        </p>
      </template>
      <template #footerLeft>
        <slot name="footerLeft" />
      </template>
    </KTDataTable>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import SBadge from "@/stories/Common/Badge/SBadge.vue";

const { t } = useI18n();

// ******* PROPS *******
interface Props {
  title: string;
  subtitle: string;
  data: Array<string>;
  hasSearch?: boolean;
  currentPage?: number;
  total?: number;
  isNotEnd?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "Title",
  subtitle: "Subtitle",
  currentPage: 1,
  total: 0,
});

const TableHeader = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "label",
    columnLabel: t("label"),
  },
  {
    columnName: "akt",
    columnLabel: t("akt_ID"),
  },
  {
    columnName: "status",
    columnLabel: t("task_status"),
  },
  {
    columnName: "responsible",
    columnLabel: t("menus.responsible_person"),
  },
  {
    columnName: "deadline",
    columnLabel: t("deadline"),
  },
];

function getVariant(status: string) {
  if (status === "not_completed") {
    return "red";
  } else if (status === "on_process") {
    return "yellow";
  } else {
    return "green";
  }
}
</script>

<style lang="scss" scoped>
.i-table {
  th:first-child {
    padding-left: 20px;
    border-radius: 8px 0 0 8px;
  }

  th:last-child {
    padding-right: 20px !important;
    border-radius: 0 8px 8px 0;
  }

  .table.table-row-bordered tr:first-of-type {
    border-top: none !important;
  }
}

button {
  outline: none;
  border: none !important;
}

.tab-button-hover:hover {
  opacity: 80%;
}

.bg-blue-opacity {
  background: #30a1db1a;
}

.bg-yellow-opacity {
  background: #ffa8001a;
}
</style>
