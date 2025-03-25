<template>
  <div class="global-breadcrumb">
    <SBreadcrumb :routes="routes" />
  </div>

  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("recent_changes") }}
  </Teleport>

  <div>
    <STable
      v-bind="{ loading, offset }"
      :total-count="paginationData.total"
      :items-per-page="paginationData.defaultLimit"
      :current-page="paginationData.currentPage"
      :total="paginationData.total"
      :header-data="usersRecentChangesHeaderData"
      :data="tableData"
      :title="$t('recent_changes')"
      :subtitle-count="paginationData.total"
      :subtitle="$t('changes_count')"
      class="main-table user-table"
      search-class="search"
      @search="onSearch"
      @on-items-per-page-change="onChangeLimit"
      @page-change="onPageChange"
    >
      <template #afterSearch>
        <div class="user-table__actions ms-6">
          <SButton variant="secondary" text="" @click="showFilterModal = true">
            <template #pre-icon>
              <inline-svg src="/assets/ona/svg/filter.svg" />
            </template>
          </SButton>
        </div>
      </template>
      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data.index, offset) }}
      </template>
      <template v-slot:userName="{ row: data }">
        <div class="position-relative">
          <div class="user-table__item">
            <h3>
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.participant?.full_name }}
              </WordHighlighter>
            </h3>
            <p>ID: {{ data?.participant?.ID }}</p>
          </div>
        </div>
      </template>
      <template v-slot:grade="{ row: data }">
        <span>{{ data?.participant?.point }}</span>
      </template>
      <template v-slot:time="{ row: data }">
        {{ dayjs(data?.timestamp).format("DD.MM.YYYY, HH:mm:ss") }}
      </template>
      <template v-slot:responsible_person="{ row: data }">
        {{ data?.participant?.responsible_person }}
      </template>
      <template v-slot:status="{ row: data }">
        <SBadge
          :text="getStatus(data?.action)?.text"
          :variant="getStatus(data?.action)?.variant"
        />
      </template>
      <template v-slot:actions="{ row: data }">
        <RouterLink
          class="action-btn"
          :to="`/dashboard/participants/recent-changes/${data?.id}`"
        >
          <inline-svg src="/assets/ona/svg/eye.svg" />
        </RouterLink>
      </template>
    </STable>
  </div>

  <LogFilter
    :show="showFilterModal"
    @close="showFilterModal = false"
    @change="onFilter"
  />
  <CBallInfoModal
    :show="showBall"
    @close="showBall = false"
    v-bind="{ pointList }"
  />
</template>
<script setup lang="ts">
import axios from "axios";
import dayjs from "dayjs";
import { tabsEmits } from "element-plus";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import WordHighlighter from "vue-word-highlighter";

import { useMounted } from "@/composables/useMounted";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import ActionModal from "@/pages/Contracts/Components/ActionModal.vue";
import CBallInfoModal from "@/pages/PUser/components/Modals/CBallInfoModal.vue";
import LogFilter from "@/pages/PUser/components/Modals/LogFilter.vue";
import { usersRecentChangesHeaderData } from "@/pages/PUser/data";
import { IParticipantLog } from "@/pages/PUser/types/participant";
import SBadge from "@/stories/Common/Badge/SBadge.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

import { calcTabIndex, updateQueryParams } from "../../../helpers";

const { mounted } = useMounted();
const {
  offset,
  loading,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch<IParticipantLog[]>("api/v2/main/ParticipantLogList");

const { t } = useI18n();

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.finally_change",
      route: "/",
      link: false,
    },
  ];
});

function getStatus(statusCode: number) {
  const status = {
    1: {
      variant: "green",
      text: t("changed"),
    },
    0: {
      variant: "blue",
      text: t("created"),
    },
    2: {
      variant: "red",
      text: t("deleted"),
    },
  };

  return status[statusCode as keyof typeof status];
}

const showFilterModal = ref(false);

async function onFilter(params: { [key: string]: string }) {
  updateQueryParams(params, true);
  await fetchTableData(params);
  showFilterModal.value = false;
}

const pointList = ref([]);
const showBall = ref(false);
async function getPointList(id: number) {
  showBall.value = true;
  await axios.get(`api/v2/participants/${id}/points/`).then((res) => {
    pointList.value = res.data?.conditions;
  });
}
</script>
