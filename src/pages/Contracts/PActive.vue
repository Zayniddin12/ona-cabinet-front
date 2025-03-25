<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.contract") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <div class="">
    <STable
      v-bind="{
        loading,
        total: paginationData.total,
        data: filtered ? filteredTableData : tableComputedData,
        offset,
      }"
      :header-data="
        useRoleManagement('edit', ['responsible_person'])
          ? RPHeaderData
          : RPHeaderData.slice(0, -1)
      "
      :title="$t('menus.active_contract')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('menus.contract')"
      class="main-table user-table"
      statusKey="activeStatus"
      pin
      :statusColors="{ twenty_days_left: 'yellow', ten_days_left: 'red' }"
      search-class="search"
      :current-page="paginationData.currentPage"
      :items-per-page="paginationData.defaultLimit"
      :search="$route.query.search"
      @search="searchFilter"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
    >
      <template #beforeSearch>
        <div class="w-100">
          <el-select v-model="filterDate" :placeholder="$t('all')">
            <el-option
              v-for="(item, ind) in tableDateFilters"
              :key="ind"
              :label="$t(item.title)"
              :value="item.id"
              :class="item.color"
            />
          </el-select>
        </div>
      </template>
      <template #afterSearch>
        <div class="user-table__actions ms-6">
          <SButton variant="secondary" text="" @click="filterModal = true">
            <template #pre-icon>
              <InlineSvg src="/assets/ona/svg/filter.svg" />
            </template>
          </SButton>
          <el-dropdown
            trigger="click"
            placement="bottom-end"
            class="se-dropdown"
            popper-class="se-dropdown-popper"
            :loading="downloadLoading"
          >
            <SButton variant="green" :text="$t('excel')">
              <template #pre-icon>
                <inline-svg src="/assets/ona/svg/excel.svg" class="me-1" />
              </template>
            </SButton>
            <template #dropdown>
              <el-dropdown-item @click="downloadExcel">
                <div class="d-flex align-items-center">
                  <inline-svg
                    src="/assets/ona/svg/download.svg"
                    class="d-inline-block me-2"
                  />
                  <span> {{ $t("import_excel") }} </span>
                </div>
              </el-dropdown-item>
            </template>
          </el-dropdown>
          <SButton
            v-if="useRoleManagement('add', ['responsible_person'])"
            @click="addModal = true"
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
                v-if="useRoleManagement('edit')"
                class="border-b"
                @click="openEdit(data?.id)"
              >
                <div
                  class="d-flex align-items-center user-table__edit-dropdown"
                >
                  <InlineSvg
                    src="/assets/svg/buttons/edit.svg"
                    class="text-2x d-inline-block me-2 blackEdit"
                  />
                  <span class="edit-text">{{ $t("edit") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                class="border-b"
                @click="pinFunc(data)"
                v-if="
                  useRoleManagement('edit') && data?.pinned
                    ? true
                    : pinCount < 6
                "
              >
                <div
                  class="d-flex align-items-center user-table__edit-dropdown"
                >
                  <InlineSvg
                    :src="
                      data?.pinned
                        ? '/assets/ona/svg/unpin.svg'
                        : '/assets/ona/svg/pin.svg'
                    "
                    class="text-2x d-inline-block me-2 blackEdit"
                  />
                  <span class="edit-text">{{
                    data?.pinned ? $t("unpin") : $t("pin")
                  }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                class="border-b delete user-table__trash-dropdown"
                @click="showDeleteModal(data?.id)"
                v-if="useRoleManagement('', [])"
              >
                <inline-svg
                  src="/assets/svg/buttons/trash.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span class="trash-text">{{ $t("make_inactive") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <template #footerLeft>
        <STableLabels :labels="tableLabels" />
      </template>
    </STable>
  </div>

  <ActionModal
    :show="addModal"
    @close="closeModal('add')"
    @submit="submitForm"
    add
    :form="form"
    :participantList="participantList.results"
    @on-search="fetchUserSearch"
  />
  <ActionModal
    :show="editModal"
    @close="closeModal('edit')"
    @submit="submitEdit"
    edit
    :form="form"
    :participantList="participantList.results"
    @on-search="fetchUserSearch"
  />

  <FilterModal
    :show="filterModal"
    @close="filterModal = false"
    @submit="submitFilter"
    @clear="clearFilter"
  />

  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="stop_contract_status"
    text="stop_contract_status_text"
    button-text="stop"
    @close="showDelete = false"
    @submit="removeUser"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";
import { useStore } from "vuex";
import { array } from "yup";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import {
  calcTabIndex,
  debounce,
  formatDate,
  updateQueryParams,
} from "@/helpers";
import ActionModal from "@/pages/Contracts/Components/ActionModal.vue";
import FilterModal from "@/pages/Contracts/Components/FilterModal.vue";
import { RPHeaderData } from "@/pages/Contracts/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import STableLabels from "@/stories/Common/TableLabels/STableLabels.vue";

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();
const route = useRoute();

const editModal = ref<boolean>(false);
const addModal = ref<boolean>(false);
const filterModal = ref<boolean>(false);
const participantList = ref([]);
const contractID = ref();
const showDelete = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const downloadLoading = ref(false);

const inputValue = ref("");
const participantParams = computed(() => {
  return {
    search: inputValue.value,
    limit: 20,
    offset: 0,
  };
});
const search = ref("");

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
const ten_days_left = ref(false);
const twenty_days_left = ref(false);

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
  pinCount,
} = useTableFetch(
  `api/v2/main/ContractList?deleted=false${
    isResponsiblePerson.value ? "&self=true" : ""
  }`
);

const tableComputedData = computed(() => {
  return tableData.value.map((el) => {
    if (el.twenty_days_left) {
      if (el.ten_days_left) {
        el.activeStatus = "ten_days_left";
      } else {
        el.activeStatus = "twenty_days_left";
      }
    }
    return el;
  });
});

const tableLabels = [
  {
    color: "yellow",
    title: t("twenty_days_to_end"),
  },
  {
    color: "red",
    title: t("ten_days_to_end"),
  },
];

// filterData
const filterDate = ref<number>(1);
const filteredTableData = ref<any[]>([]);
const filtered = ref(false);

const tableDateFilters = [
  {
    id: 1,
    color: "green",
    title: t("all"),
  },
  {
    id: 2,
    color: "yellow",
    title: t("twenty_days_to_end"),
  },
  {
    id: 3,
    color: "red",
    title: t("ten_days_to_end"),
  },
];

watch(
  () => filterDate.value,
  (value) => {
    if (value === 2) {
      twenty_days_left.value = true;
      ten_days_left.value = false;
    } else if (value === 3) {
      twenty_days_left.value = false;
      ten_days_left.value = true;
    } else {
      twenty_days_left.value = false;
      ten_days_left.value = false;
    }
    updateQueryParams({
      ten_days_left: ten_days_left.value,
      twenty_days_left: twenty_days_left.value,
    });
  }
);
// FormData

const form = useForm(
  {
    participant: "",
    id: "",
    status: null,
    start_date: "",
    end_date: "",
    files: [],
    file_id: [],
  },
  {
    participant: { required },
    status: { required },
    start_date: { required },
    end_date: { required },
    file_id: { required },
  }
);

// Filter

const submitFilter = (query: object) => {
  filterModal.value = false;

  fetchTableData({ ...query });
};

const clearFilter = () => {
  fetchTableData();
};

// FETCH MORE
const fetchUserSearch = (searchText: string) => {
  participantParams.value.search = searchText;
  ApiService.query("/api/v2/participants/participantList", {
    params: {
      ...participantParams.value,
      my_participants: isResponsiblePerson.value ? "true" : undefined,
    },
  }).then((res: any) => {
    participantList.value = res?.data;
  });
};

// RemoveUser

function showDeleteModal(id: number) {
  contractID.value = id;
  showDelete.value = true;
}

const removeUser = () => {
  deleteLoading.value = true;
  ApiService.patch(`api/v2/main/ContractUpdate/${contractID.value}`, {
    deleted: true,
  })
    .then(() => {
      toast.success(t("archived_successfully"), {
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

// AddModal

const closeModal = (status: string) => {
  if (status === "add") {
    addModal.value = false;
  } else {
    editModal.value = false;
  }

  form.values.participant = "";
  form.values.status = null;
  form.values.start_date = "";
  form.values.end_date = "";
  form.values.files = [];
  form.values.id = "";
  form.$v.value.$reset();
};

const submitForm = async () => {
  const participant =
    typeof form.values.participant === "number"
      ? form.values.participant
      : form.values.participant?.id;
  await ApiService.post("/api/v2/main/ContractCreate", {
    participant,
    start_date: dayjs(form.values.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(form.values.end_date).format("YYYY-MM-DD"),
    files: form.values.file_id,
    status: form.values.status,
  })
    .then(() => {
      toast.success(t("successfully_added"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch((err) => {
      toast.error(err, {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
  closeModal("add");
  fetchTableData();
};

//  EDIT

const submitEdit = async () => {
  const participant = form.values.participant?.id;
  await ApiService.put(`/api/v2/main/ContractUpdate/${contractID.value}`, {
    participant,
    start_date: dayjs(form.values.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(form.values.end_date).format("YYYY-MM-DD"),
    files: form.values.file_id,
    status: form.values.status,
  })
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch((err) => {
      toast.error(err, {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
  closeModal("edit");
  fetchTableData();
};

const openEdit = async (id: number) => {
  contractID.value = id;
  await ApiService.get(`/api/v2/main/ContractDetail/${id}`).then(({ data }) => {
    form.values.participant = data?.participant?.full_name;
    form.values.status = data?.status;
    form.values.id = data?.status;
    form.values.start_date = data?.participant.id;
    form.values.end_date = data?.end_date;
    form.values.files = data?.files;
    form.values.file_id = data?.files?.map((el) => el.id);
  });

  editModal.value = true;
};

const pinFunc = async (data: { id: number; pinned: boolean }) => {
  await ApiService.patch(`api/v2/main/ContractUpdate/${data?.id}`, {
    pinned: !data?.pinned,
  })
    .then(() => {
      fetchTableData();
      toast.success(
        data?.pinned ? t("successfully_unpinned") : t("successfully_pinned"),
        {
          icon: {
            iconClass: "done-icon",
            iconTag: "div",
          },
        }
      );
      loading.value = false;
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

// download excel

function downloadExcel() {
  downloadLoading.value = true;
  ApiService.query("api/v2/main/GenerateContractExcel", {
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

watch(
  () => inputValue.value,
  () => {
    fetchUserSearch();
  },
  { deep: true }
);
onBeforeMount(async () => {
  await ApiService.query("/api/v2/participants/participantList", {
    params: {
      ...participantParams.value,
      my_participants: isResponsiblePerson.value ? "true" : undefined,
    },
  })
    .then((res) => {
      participantList.value = res.data;
    })
    .catch((error) => {
      throw error;
    });
});

watch(
  () => route.query,
  () => fetchTableData()
);

const searchFilter = (val: string) => {
  debounce("search", () => updateQueryParams({ search: val }));
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
