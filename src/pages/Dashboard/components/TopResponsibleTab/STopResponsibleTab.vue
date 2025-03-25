<template>
  <div class="i-table bg-white rounded-4">
    <slot name="header">
      <header class="d-flex p-6 justify-content-between">
        <div>
          <h2 class="i-table__title fw-bold text-i-primary text-capitalize">
            {{ title }}
          </h2>
          <p v-if="subtitle" class="fs-7 text-i-secondary">{{ subtitle }}</p>
        </div>
        <div class="d-flex align-items-start">
          <button
            class="tab-button-hover px-8 bg-transparent rounded-6 hover fw-semibold py-2 border text-secondary-dark fs-7"
            :class="{ 'i-bg-blue-100 text-white': active === 'current' }"
            @click="active = 'current'"
          >
            {{ $t("current_month") }}
          </button>
          <button
            class="tab-button-hover px-8 bg-transparent rounded-6 hover fw-semibold py-2 border text-secondary-dark fs-7"
            :class="{ 'i-bg-blue-100 text-white': active === '6_months' }"
            @click="active = '6_months'"
          >
            {{ $t("6_months") }}
          </button>
        </div>
      </header>
    </slot>
    <Transition name="fade" mode="out-in">
      <main :key="active">
        <KTDataTable
          id="response"
          v-if="active === 'current'"
          v-bind="{ data: lastList, currentPage, total }"
          :header="TableHeader"
          @change-page="$emit('page-change', $event)"
          :isNotEnd="isNotEnd"
        >
          <template v-slot:id="{ row: data }">
            <inline-svg
              v-if="data?.index === 1"
              src="/assets/ona/svg/crown.svg"
            />
            <span v-else>{{ data.index }}.</span>
          </template>
          <template v-slot:label="{ row: data }">
            <SUserCard
              responsible
              :disabled="isResponsiblePerson"
              :data="{
                full_name: data?.user?.first_name,
                ID: data?.id,
                id: data?.id,
              }"
            />
          </template>
          <template v-slot:averageUsed="{ row: data }">
            {{
              data.daily_activity
                ? `~${minutesToHours(+data?.daily_activity)} ${$t("hours")}`
                : "-"
            }}
          </template>
          <template v-slot:care="{ row: data }">
            <div class="d-flex align-items-center gap-1">
              <inline-svg src="/assets/ona/svg/users.svg" />
              {{ $t("care_count", { count: data.participant_count }) }}
            </div>
          </template>
          <template v-slot:phoneNumber="{ row: data }">
            <p class="text-left">
              {{ formatPhoneNumber(`+998${data.phone}`) }}
            </p>
          </template>
          <template #footerLeft>
            <slot name="footerLeft" />
          </template>
        </KTDataTable>
        <KTDataTable
          id="response"
          v-else
          v-bind="{ data, currentPage, total }"
          :header="TableHeader"
          @change-page="$emit('page-change', $event)"
          :isNotEnd="isNotEnd"
        >
          <template v-slot:id="{ row: data }">
            <inline-svg
              v-if="data?.index === 1"
              src="/assets/ona/svg/crown.svg"
            />
            <span v-else>{{ data.index }}.</span>
          </template>
          <template v-slot:label="{ row: data }">
            <SUserCard
              responsible
              :data="{
                full_name: data?.user?.first_name,
                ID: data?.id,
                id: data?.id,
              }"
            />
          </template>
          <template v-slot:averageUsed="{ row: data }">
            {{
              data.daily_activity
                ? `~${minutesToHours(+data?.daily_activity)} ${$t("hours")}`
                : "-"
            }}
          </template>
          <template v-slot:care="{ row: data }">
            <div class="d-flex align-items-center gap-1">
              <inline-svg src="/assets/ona/svg/users.svg" />
              {{ $t("care_count", { count: data.participant_count }) }}
            </div>
          </template>
          <template v-slot:phoneNumber="{ row: data }">
            <p class="text-left">
              {{ formatPhoneNumber(`+998${data.phone}`) }}
            </p>
          </template>
          <template #footerLeft>
            <slot name="footerLeft" />
          </template>
        </KTDataTable>
      </main>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import { convertMinToHour, formatPhoneNumber, minutesToHours } from "@/helpers";
import SUserCard from "@/stories/Common/Cards/User/SUserCard.vue";

const { t } = useI18n();
const active = ref("current");

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});

// ******* PROPS *******
interface Props {
  title: string;
  subtitle: string;
  lastList: Array<any>;
  data: Array<any>;
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
    columnName: "averageUsed",
    columnLabel: t("average_used"),
  },
  {
    columnName: "care",
    columnLabel: t("hisCare"),
  },
  {
    columnName: "phoneNumber",
    columnLabel: t("phone_number"),
  },
];
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
</style>

<style lang="scss">
.text-left {
  text-align: left !important;
}
</style>
