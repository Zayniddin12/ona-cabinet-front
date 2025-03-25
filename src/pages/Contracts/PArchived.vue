<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.contract") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <div class="">
    <STable
      v-bind="{ loading, total: paginationData.total, data: tableData, offset }"
      :header-data="
        useRoleManagement('add', ['admin', 'responsible_person'])
          ? RPHeaderData
          : RPHeaderData.slice(0, -1)
      "
      :title="$t('menus.archive_contract')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('menus.contract')"
      class="main-table user-table"
      search-class="search"
      :current-page="paginationData.currentPage"
      :items-per-page="paginationData.defaultLimit"
      @search="onSearch"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
    >
      <template #afterSearch>
        <div class="user-table__actions ms-6">
          <SButton variant="secondary" text="" @click="filterModal = true">
            <template #pre-icon>
              <InlineSvg src="/assets/ona/svg/filter.svg" />
            </template>
          </SButton>
        </div>
      </template>
      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data?.index, offset) }}
      </template>
      <template v-slot:name="{ row: data }">
        <div class="position-relative">
          <RouterLink :to="`/contracts/${data?.id}`" class="user-table__item">
            <h3>
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.participant }}
              </WordHighlighter>
            </h3>
            <p>ID: {{ data?.participant_id }}</p>
          </RouterLink>
        </div>
      </template>
      <template v-slot:started_date="{ row: data }">
        {{ formatDate(data?.start_date) }}
      </template>
      <template v-slot:end_date="{ row: data }">
        {{ formatDate(data?.end_date) }}
      </template>
      <template v-slot:actions="{ row: data }">
        <el-dropdown
          class="d-flex justify-content-end user-table__action-dropdown"
          trigger="click"
          placement="bottom-end"
        >
          <div>
            <button class="btn btn-active-light w-25px h-25px p-0">
              <InlineSvg
                src="/assets/ona/svg/dots-vertical.svg"
                class="text-2x dot"
              />
            </button>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                class="border-b restart user-table__trash-dropdown"
                @click="showRestartModal(data?.id)"
                v-if="useRoleManagement('', [])"
              >
                <inline-svg
                  src="/assets/ona/svg/restart.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span class="restart_text">{{ $t("restart_activity") }} </span>
              </el-dropdown-item>
              <el-dropdown-item
                class="border-b delete user-table__trash-dropdown"
                @click="showDeleteModal(data?.id)"
              >
                <inline-svg
                  src="/assets/svg/buttons/trash.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span class="trash-text">{{ $t("delete") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </STable>
  </div>

  <FilterModal
    :show="filterModal"
    @close="filterModal = false"
    @submit="submitFilter"
    @clear="clearFilter"
  />

  <SDeleteTaskModal
    :show="showRestart"
    :loading="restartLoading"
    title="restart_contract_status"
    text="restart_contract_status_text"
    button-text="restart"
    buttonVariant="primary"
    @close="showRestart = false"
    @submit="restartContract"
  />
  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="delete_contract"
    text="delete_task_text"
    button-text="delete"
    @close="showDelete = false"
    @submit="removeContract"
  />
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";
import { useStore } from "vuex";

import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex, formatDate } from "@/helpers";
import FilterModal from "@/pages/Contracts/Components/FilterModal.vue";
import { RPHeaderData } from "@/pages/Contracts/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const filterModal = ref<boolean>(false);
const contractID = ref<number | null>(null);
const showDelete = ref<boolean>(false);
const showRestart = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const restartLoading = ref<boolean>(false);

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.contract",
      route: "/contracts",
      link: false,
    },
  ];
});

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});

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
  `api/v2/main/ContractList?deleted=true${
    isResponsiblePerson.value ? "&self=true" : ""
  }`
);

const submitFilter = (query: object) => {
  filterModal.value = false;

  fetchTableData({ ...query });
};

const clearFilter = () => {
  fetchTableData();
};

function showDeleteModal(id: number) {
  contractID.value = id;
  showDelete.value = true;
}

const removeContract = async () => {
  deleteLoading.value = true;
  ApiService.delete(`api/v2/main/ContractDelete/${contractID.value}`)
    .then(() => {
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => {
      deleteLoading.value = false;
      showDelete.value = false;
      fetchTableData();
    });
};

function showRestartModal(id: number) {
  contractID.value = id;
  showRestart.value = true;
}

const restartContract = () => {
  restartLoading.value = true;
  ApiService.patch(`api/v2/main/ContractUpdate/${contractID.value}`, {
    deleted: false,
  })
    .then(() => {
      toast.success(t("recovered_successfully"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => {
      showRestart.value = false;
      restartLoading.value = false;
      fetchTableData();
    });
};
</script>

<style lang="scss">
.filter__label {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #b5b5c3;
}
</style>
