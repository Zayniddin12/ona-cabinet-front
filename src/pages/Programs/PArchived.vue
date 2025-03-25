<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("programs") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <div class="">
    <STable
      v-bind="{ loading, total: paginationData.total, data: tableData, offset }"
      :header-data="
        useRoleManagement('edit', 'superadmin')
          ? RPHeaderData
          : RPHeaderData.slice(0, -1)
      "
      :title="$t('menus.archive_services')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('programs')"
      class="main-table user-table"
      search-class="search"
      @search="onSearch"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
      :current-page="paginationData.currentPage"
      :items-per-page="paginationData.defaultLimit"
    >
      <template #afterSearch>
        <div class="user-table__actions ms-6">
          <el-dropdown
            trigger="click"
            placement="bottom-end"
            popper-class="user-table__actions"
          >
            <SButton variant="green" :text="$t('excel')">
              <template #pre-icon>
                <inline-svg src="/assets/ona/svg/excel.svg" class="me-1" />
              </template>
            </SButton>
            <template #dropdown>
              <el-dropdown-menu :loading="downloadLoading">
                <el-dropdown-item @click="downloadExcel">
                  <button
                    class="btn btn-style user-table__actions-dropdown-item"
                  >
                    <inline-svg src="/assets/ona/svg/download.svg" />
                    <span> {{ $t("import_excel") }} </span>
                  </button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>

      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data?.index, offset) }}
      </template>
      <template v-slot:name="{ row: data }">
        <RouterLink
          :to="isResponsiblePerson ? '#' : `/programs/${data?.id}`"
          class="user-table__item"
          :style="isResponsiblePerson ? 'cursor: default' : ''"
        >
          <h3 class="text-break line-clamp-2">
            <WordHighlighter :query="$route?.query?.search || ''">
              {{ data?.name }}
            </WordHighlighter>
          </h3>
        </RouterLink>
      </template>
      <template v-slot:code="{ row: data }">
        {{ data?.code }}
      </template>
      <template v-slot:order_number="{ row: data }">
        {{ data?.order_number }}
      </template>
      <template v-slot:women_count="{ row: data }">
        {{ data?.women_count }}
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
                class="border-b"
                @click="showRestartModal(data?.id)"
              >
                <div
                  class="d-flex align-items-center user-table__edit-dropdown"
                >
                  <inline-svg
                    src="/assets/ona/svg/restart.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span class="restart_text">{{ $t("out_archive") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="useRoleManagement('', [])"
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
  <SDeleteTaskModal
    :show="showRestart"
    :loading="restartLoading"
    title="restart_program_status"
    text="restart_program_status_text"
    button-text="restart"
    buttonVariant="primary"
    @close="showRestart = false"
    @submit="restartProgram"
  />
  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="delete_program"
    text="delete_task_text"
    button-text="delete"
    @close="showDelete = false"
    @submit="removeProgram"
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
import { RPHeaderData } from "@/pages/Programs/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

import { calcTabIndex } from "../../helpers";

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const programID = ref<number | null>(null);
const showDelete = ref<boolean>(false);
const showRestart = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const restartLoading = ref<boolean>(false);
const downloadLoading = ref(false);

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.services",
      route: "/programs",
      link: false,
    },
  ];
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
} = useTableFetch("api/v2/main/ProgramList?deleted=true");

// Delete Program

function showDeleteModal(id: number) {
  programID.value = id;
  showDelete.value = true;
}

const removeProgram = async () => {
  deleteLoading.value = true;
  ApiService.delete(`api/v2/main/ProgramDelete/${programID.value}`)
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

// Restart Program

function showRestartModal(id: number) {
  programID.value = id;
  showRestart.value = true;
}

const restartProgram = async () => {
  restartLoading.value = true;
  await ApiService.patch(`api/v2/main/ProgramUpdate/${programID.value}`, {
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
      restartLoading.value = false;
      showRestart.value = false;
      fetchTableData();
    });
};

// download excel

function downloadExcel() {
  downloadLoading.value = true;
  ApiService.query("api/v2/main/GenerateProgramExcel?deleted=true", {
    responseType: "blob",
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xls");
      link.click();
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

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});
</script>

<style lang="scss">
.filter__label {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #b5b5c3;
}
</style>
