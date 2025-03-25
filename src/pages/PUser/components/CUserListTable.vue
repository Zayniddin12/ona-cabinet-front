<template>
  <STable
    v-bind="{ loading, offset }"
    :subtitle-count="paginationData.total"
    :total="paginationData.total"
    :items-per-page="paginationData.defaultLimit"
    :header-data="headerData"
    :data="tableFilteredData"
    :title="$t(title)"
    :subtitle="$t(subtitle)"
    class="main-table user-table"
    :statusKey="statusKey"
    :statusColors="statusColors"
    search-class="search"
    :search="$route.query.search"
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
          class="se-dropdown"
          popper-class="se-dropdown-popper"
          v-if="
            $route.name === 'ActiveParticipants' ||
            $route.name === 'InActiveParticipants'
          "
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
            <ElDropdownItem>
              <div class="d-flex align-items-center" @click="downloadExcel">
                <inline-svg
                  src="/assets/ona/svg/download.svg"
                  class="d-inline-block me-2"
                />
                <span> {{ $t("import_excel") }} </span>
              </div>
            </ElDropdownItem>
            <ElDropdownItem v-if="statusKey !== 'inactive'">
              <div class="d-flex align-items-center" @click="uploadExcel">
                <inline-svg
                  src="/assets/ona/svg/upload.svg"
                  class="d-inline-block me-2"
                />
                <span> {{ $t("export_excel") }} </span>
              </div>
            </ElDropdownItem>
          </template>
        </ElDropdown>
        <SButton
          v-if="
            $route.name === 'ActiveParticipants' &&
            useRoleManagement('edit', ['superadmin', 'responsible_person'])
          "
          @click="$router.push({ name: 'ParticipantsAdd' })"
          variant="primary"
          :text="$t('add_new')"
        >
          <template #pre-icon>
            <img src="/assets/svg/buttons/plus.svg" alt="plus" />
          </template>
        </SButton>
      </div>
    </template>
    <template v-slot:id="{ row: data }">
      {{ calcTabIndex(data?.index, offset) }}
    </template>
    <template v-slot:full_name="{ row: data }">
      <div class="position-relative">
        <ElDropdown
          trigger="hover"
          placement="bottom-start"
          popper-class="user-info-dropdown"
        >
          <RouterLink
            :to="`/dashboard/participants/${data?.id}`"
            class="user-table__item"
          >
            <h3>
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.full_name }}
              </WordHighlighter>
            </h3>
            <p class="mt-1">ID: {{ data?.ID }}</p>
          </RouterLink>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>
                <CUserInfoCard :data="data" />
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </template>
    <template v-slot:birth_date="{ row: data }">
      {{ data?.birth_date ? parseDate(data?.birth_date) : "-" }}
    </template>
    <template v-slot:point="{ row: data }">
      <span
        @click="getPointList(data?.id, data?.point)"
        class="cursor-pointer"
        >{{ data?.point }}</span
      >
    </template>
    <template v-slot:living_region="{ row: data }">
      {{ data?.living_region?.title }}
    </template>
    <template v-slot:sickness_count="{ row: data }">
      <span v-if="data?.sickness_count"> {{ $t("available") }} </span>
      <span v-else> {{ $t("not_available") }} </span>
    </template>
    <template v-slot:actions="{ row: data }">
      <ElDropdown
        class="user-table__action-dropdown"
        trigger="click"
        placement="bottom-end"
      >
        <button class="btn w-25px h-25px p-0">
          <inline-svg src="/assets/ona/svg/dots-vertical.svg" class="dot" />
        </button>

        <template #dropdown>
          <RouterLink
            v-if="$route.name !== 'ArchivedParticipants'"
            :to="{ name: 'ParticipantsEdit', params: { id: data.id } }"
          >
            <ElDropdownItem class="border-b">
              <div class="d-flex align-items-center">
                <inline-svg
                  src="/assets/ona/svg/pen-solid.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span>{{ $t("edit") }}</span>
              </div>
            </ElDropdownItem>
          </RouterLink>
          <ElDropdownItem
            v-if="
              $route.name !== 'ArchivedParticipants' &&
              useRoleManagement('edit', 'superadmin')
            "
            class="delete"
            @click="updateUserStatus(data.id)"
          >
            <div class="d-flex align-items-center">
              <inline-svg
                src="/assets/ona/svg/trash.svg"
                class="text-2x d-inline-block me-2"
              />
              <span>{{ $t("put_archive") }}</span>
            </div>
          </ElDropdownItem>
          <ElDropdownItem
            v-if="$route.name === 'ArchivedParticipants'"
            @click="updateUserStatus(data.id, false)"
          >
            <div class="d-flex align-items-center">
              <inline-svg
                src="/assets/ona/svg/restart.svg"
                class="text-2x d-inline-block me-2"
              />
              <span>{{ $t("recovery") }}</span>
            </div>
          </ElDropdownItem>
        </template>
      </ElDropdown>
    </template>
  </STable>

  <CUserFilterModal
    width="1048px"
    :show="showFilter"
    wrapperStyle="row-cols-3"
    v-bind="{ filters }"
    @close="showFilter = false"
    @fetch-program="fetchProgram"
    @program-search="searchProgram"
  />
  <CBallInfoModal
    :show="showBall"
    @close="showBall = false"
    v-bind="{ pointList, pointsCount }"
  />
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";
import { useStore } from "vuex";

import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex, parseDate } from "@/helpers";
import CUserInfoCard from "@/pages/PUser/components/CUserInfoCard.vue";
import CBallInfoModal from "@/pages/PUser/components/Modals/CBallInfoModal.vue";
import CUserFilterModal from "@/pages/PUser/components/Modals/CUserFilterModal.vue";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import { IPointList } from "@/types";

interface Props {
  headerData: Array<any>;
  data: Array<any>;
  title: string;
  subtitle: string;
  fetchUrl: string;
  filters?: Array<any>;
  statusKey?: string;
  statusColors?: any;
  active?: boolean;
  deleted?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const store = useStore();
const pointList = ref([]);
const showBall = ref(false);
const pointsCount = ref(0);
async function getPointList(id: number, points: number) {
  pointsCount.value = points;
  showBall.value = true;
  await axios.get(`api/v2/participants/${id}/points/`).then((res) => {
    pointList.value = res.data?.conditions;
  });
}
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
const {
  offset,
  loading,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
  fetchTrigger,
  responseData,
} = useTableFetch(`${props.fetchUrl}`);

const showFilter = ref(false);

const tableFilteredData = ref();
const programParams = ref<{ offset: number; search: string | undefined }>({
  offset: 0,
  search: "",
});

const fetchProgram = () => {
  if (store.state.ProgramModule.count > programParams.value.offset) {
    programParams.value.offset = programParams.value.offset + 10;
    store.dispatch(Actions.FETCH_PROGRAMS, {
      params: programParams.value,
      config: { merge: true },
    });
  }
};

const searchProgram = (search?: string) => {
  programParams.value.offset = 0;
  programParams.value.search = search;

  store.dispatch(Actions.FETCH_PROGRAMS, {
    params: programParams.value,
    config: { merge: false },
  });
};

watch(
  () => tableData.value,
  () => {
    tableFilteredData.value = tableData.value.map((item) => ({
      ...item,
      [props.statusKey]: true,
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
  }
);

const downloadLoading = ref(false);

function downloadExcel() {
  downloadLoading.value = true;
  const params = route.query;
  if (props.statusKey === "inactive") {
    ApiService.query("api/v2/participants/participantGenerateExcel/", {
      params: {
        active: false,
        ...params,
      },
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
  } else {
    ApiService.query("api/v2/participants/participantGenerateExcel/", {
      params: {
        active: true,
        deleted: false,
        ...params,
      },
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
}

function uploadExcel() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".xls,.xls";
  fileInput.click();
  fileInput.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files[0];
    const formData = new FormData();
    formData.append("file", file);
    ApiService.post("api/v2/participants/participantImportExcel/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        toast.success(t("upload_successfully"), {
          icon: {
            iconClass: "done-icon",
            iconTag: "div",
          },
        });
        fetchTableData();
      })
      .catch((err) => {
        toast.error(err, {
          icon: {
            iconClass: "error-icon",
            iconTag: "div",
          },
        });
      });
  };
}

function updateUserStatus(id: number, newValue = true) {
  ApiService.patch(`api/v2/participants/participantUpdate/${id}/`, {
    deleted: newValue,
  }).then(() => {
    onPageChange(1);
    toast.success(
      newValue ? t("archived_successfully") : t("recovered_successfully"),
      {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      }
    );
  });
}

watch(
  () => fetchTrigger.value,
  () => {
    store.commit(
      Mutations.SET_PARTICIPANT_STATISTICS,
      responseData.value.statistics
    );
  }
);
</script>
