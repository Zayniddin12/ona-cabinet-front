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
        useRoleManagement('edit') ? RPHeaderData : RPHeaderData.slice(0, -1)
      "
      :title="$t('menus.active_services')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('programs')"
      class="main-table user-table program__table"
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
          <SButton
            v-if="useRoleManagement('add')"
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
                @click="openEditModal(data?.id)"
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
                v-if="useRoleManagement('edit', 'superadmin')"
                class="border-b delete user-table__trash-dropdown"
                @click="showDeleteModal(data?.id)"
              >
                <inline-svg
                  src="/assets/svg/buttons/trash.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span class="trash-text">{{ $t("put_archive") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </STable>
  </div>

  <ActionModal
    :show="addModal"
    add
    :form="form"
    @close="closeAddModal"
    @submit="createProgram"
  />
  <ActionModal
    :show="editModal"
    @close="closeEditModal"
    edit
    :form="form"
    @submit="editProgram"
  />
  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="stop_program_status"
    text="stop_program_status_text"
    button-text="stop"
    @close="showDelete = false"
    @submit="removeProgram"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";
import { useStore } from "vuex";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex, handleError } from "@/helpers";
import ActionModal from "@/pages/Programs/Components/ActionModal.vue";
import { RPHeaderData } from "@/pages/Programs/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const editModal = ref<boolean>(false);
const addModal = ref<boolean>(false);
const programID = ref<number | null>(null);
const showDelete = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
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
} = useTableFetch("api/v2/main/ProgramList?deleted=false");

const form = useForm(
  {
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    code: "",
    order_number: "",
  },
  {
    name_uz: { required },
    name_ru: { required },
    description_uz: { required },
    description_ru: { required },
    code: { required },
    order_number: { required },
  }
);

// EDIT

const openEditModal = async (id: number) => {
  editModal.value = true;
  programID.value = id;

  await ApiService.get(`/api/v2/main/ProgramDetail/${id}`).then(({ data }) => {
    form.values.name_uz = data?.name_uz;
    form.values.name_ru = data?.name_ru;
    form.values.description_uz = data?.description_uz;
    form.values.description_ru = data?.description_ru;
    form.values.code = data?.code;
    form.values.order_number = data?.order_number;
  });
};

const closeEditModal = () => {
  editModal.value = false;
  form.values.name_uz = "";
  form.values.name_ru = "";
  form.values.description_uz = "";
  form.values.description_ru = "";
  form.values.code = "";
  form.values.order_number = "";

  form.$v.value.$reset();
};

const editProgram = async () => {
  await ApiService.put(`api/v2/main/ProgramUpdate/${programID.value}`, {
    name_uz: form.values.name_uz,
    name_ru: form.values.name_ru,
    description_uz: form.values.description_uz,
    description_ru: form.values.description_ru,
    code: form.values.code,
    order_number: form.values.order_number,
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
    })
    .finally(() => {
      closeEditModal();
      fetchTableData();
    });
};

// ADD
const closeAddModal = () => {
  addModal.value = false;
  form.values.name_uz = "";
  form.values.name_ru = "";
  form.values.description_uz = "";
  form.values.description_ru = "";
  form.values.code = "";
  form.values.order_number = "";

  form.$v.value.$reset();
};

const createProgram = () => {
  ApiService.post("/api/v2/main/ProgramCreate", form.values)
    .then(() => {
      onPageChange(1);
      toast.success(t("successfully_added"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch(({ response }) => handleError(response?.data));
  closeAddModal();
};

// REMOVE

function showDeleteModal(id: number) {
  programID.value = id;
  showDelete.value = true;
}

const removeProgram = () => {
  deleteLoading.value = true;
  ApiService.patch(`api/v2/main/ProgramUpdate/${programID.value}`, {
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

// download excel

function downloadExcel() {
  downloadLoading.value = true;
  ApiService.query("api/v2/main/GenerateProgramExcel?deleted=false", {
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

.program__table {
  tbody td:nth-child(2) {
    width: 40%;
  }
}
</style>
