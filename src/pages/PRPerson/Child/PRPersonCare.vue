<template>
  <div>
    <STable
      :header-data="RPCareHeaderData"
      :title="$t('hisCare')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('menus.participants')"
      class="main-table user-table"
      statusKey="active"
      :statusColors="{
        false: 'gray',
        true: 'green',
      }"
      search-class="search"
      v-bind="{ loading, total: paginationData.total, data: tableData, offset }"
      :current-page="paginationData.currentPage"
      @search="onSearch"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
    >
      <template #afterSearch>
        <div class="user-table__actions ms-6">
          <SButton variant="secondary" text="" @click="showFilter = true">
            <template #pre-icon>
              <inline-svg src="/assets/ona/svg/filter.svg" />
            </template>
          </SButton>
          <ElDropdown
            trigger="click"
            placement="bottom-end"
            popper-class="user-table__actions"
          >
            <SButton
              variant="green"
              :text="$t('excel')"
              :loading="downloadLoading"
            >
              <template #pre-icon>
                <inline-svg src="/assets/ona/svg/excel.svg" class="me-1" />
              </template>
            </SButton>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  <button
                    class="btn btn-style user-table__actions-dropdown-item"
                    @click="downloadExcel"
                  >
                    <inline-svg src="/assets/ona/svg/download.svg" />
                    <span> {{ $t("import_excel") }} </span>
                  </button>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </template>
      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data?.index, offset) }}
      </template>
      <template v-slot:name="{ row: data }">
        <div class="position-relative user-table__item">
          <router-link
            :to="`/dashboard/participants/${data?.id}/main`"
            class="user-table__link transition-200"
          >
            <WordHighlighter :query="$route?.query?.search || ''">
              {{ data?.full_name }}
            </WordHighlighter>
          </router-link>
          <p>ID: {{ data?.ID }}</p>
        </div>
      </template>
      <template v-slot:birthday="{ row: data }">
        {{ formatDate(data?.birth_date) }}
      </template>
      <template v-slot:ijt="{ row: data }">
        {{ data?.point }}
      </template>
      <template v-slot:region="{ row: data }">
        {{ data?.living_region ? data?.living_region?.title : "-" }}
      </template>
      <template v-slot:illness="{ row: data }">
        {{ $t(data?.sickness_count ? "available" : "not_available") }}
      </template>
      <template v-slot:actions="{ row: data }">
        <el-dropdown
          class="user-table__action-dropdown"
          trigger="click"
          placement="bottom-end"
        >
          <button class="btn w-25px h-25px p-0">
            <inline-svg src="/assets/ona/svg/dots-vertical.svg" class="dot" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                class="border-b"
                @click="
                  $router.push(`/dashboard/participants/${data?.id}/main`)
                "
              >
                <div class="d-flex align-items-center">
                  <inline-svg
                    src="/assets/ona/svg/eye-solid.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span>{{ $t("view") }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <template #footerLeft>
        <STableLabels :labels="tableLabels" />
      </template>
    </STable>
    <CUserFilterModal
      wrapperStyle="row-cols-3"
      width="1048px"
      :show="showFilter"
      @close="showFilter = false"
      v-bind="{ filters }"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import useParticipantFilter from "@/composables/useParticipantFilter";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex, formatDate } from "@/helpers";
import { RPCareHeaderData } from "@/pages/PRPerson/data";
import CUserFilterModal from "@/pages/PUser/components/Modals/CUserFilterModal.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import STableLabels from "@/stories/Common/TableLabels/STableLabels.vue";

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const downloadLoading = ref(false);
const { filters } = useParticipantFilter();
const {
  offset,
  loading,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `api/v2/participants/participantList/?responsible_person=${route.params.id}`
);

onMounted(() => {
  getWomenList();
});
const getWomenList = async () => {
  loading.value = true;
  await ApiService.get(
    `api/v2/participants/participantList/?responsible_person=${route.params.id}`
  ).finally(() => {
    loading.value = false;
  });
};
// const resetModal = ref<boolean>(true);
const filter = ref<{ search: string; type: number | null }>({
  search: "",
  type: null,
});

const tableLabels = [
  {
    color: "green",
    title: t("active"),
  },
  {
    color: "grey",
    title: t("inactive"),
  },
];

function downloadExcel() {
  downloadLoading.value = true;
  const params = route.query;
  ApiService.query(
    `api/v2/participants/participantGenerateExcel?responsible_person=${route.params.id}`,
    {
      params,
      responseType: "blob",
    }
  )
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xls"); //or any other extension
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch((err) => {
      toast.error(err, {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (downloadLoading.value = false));
}

watch(
  () => route.query.ordering,
  () => fetchTableData()
);

// Filter

const routeQuery = computed(() => {
  const query = { ...route.query };
  for (let key in query) {
    if (query[key] === "") {
      delete query[key];
    }
    if (key === "page") {
      delete query[key];
    }
  }
  return query;
});

const showFilter = ref(false);
const tableFilteredData = ref();

watch(
  () => tableData.value,
  () => {
    tableFilteredData.value = tableData.value.map((item) => ({
      ...item,
    }));
  },
  {
    deep: true,
    immediate: true,
  }
);
watch(
  () => routeQuery.value,
  () => {
    fetchTableData(routeQuery.value);
    showFilter.value = false;
  }
);
</script>

<style lang="scss">
.filter__label {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #b5b5c3;
}
</style>
