<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.type_of_supports") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <div class="">
    <STable
      v-bind="{ loading, total: paginationData.total, data: tableData, offset }"
      :header-data="SupportsTableData"
      :title="$t('menus.type_of_supports')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('menus.type_of_supports')"
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
          <SButton
            @click="downloadExcel"
            :loading="excelLoading"
            variant="green"
            :text="$t('excel')"
          >
            <template #pre-icon>
              <inline-svg src="/assets/ona/svg/excel.svg" class="me-1" />
            </template>
          </SButton>
          <SButton @click="addSupport" variant="primary" :text="$t('add_new')">
            <template #pre-icon>
              <img src="/assets/svg/buttons/plus.svg" alt="plus" />
            </template>
          </SButton>
        </div>
      </template>
      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data?.index, offset) }}
      </template>
      <template v-slot:label="{ row: data }">
        <div class="position-relative">
          <div class="user-table__item">
            <h3>
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.title }}
              </WordHighlighter>
            </h3>
          </div>
        </div>
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
                @click="openEdit(data?.id, data?.title_uz, data?.title_ru)"
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
                class="border-b delete user-table__trash-dropdown"
                @click="openDelete(data?.id)"
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

  <SupportModal
    :show="addModal"
    add
    @close="addModal = false"
    @submit="submitAdd"
    v-bind="{ form, loading: buttonLoading }"
  />

  <SupportModal
    :show="editModal"
    edit
    @close="editModal = false"
    @submit="submitEdit"
    v-bind="{ form, loading: buttonLoading }"
  />

  <SDeleteTaskModal
    :show="showDelete"
    :title="$t('delete_support')"
    :text="$t('delete_responsible_person_text')"
    @close="showDelete = false"
    @submit="removeSupport"
    :loading="buttonLoading"
  />
</template>
<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex } from "@/helpers";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SupportModal from "@/pages/TypeOfSupports/Components/SupportModal.vue";
import { SupportsTableData } from "@/pages/TypeOfSupports/data";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const {
  offset,
  loading,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch("api/v2/support-type-list/");

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const addModal = ref<boolean>(false);
const editModal = ref<boolean>(false);
const buttonLoading = ref<boolean>(false);
const excelLoading = ref<boolean>(false);
const supportId = ref();
const showDelete = ref<boolean>(false);
const form = useForm(
  {
    support_type_uz: null,
    support_type_ru: null,
  },
  {
    support_type_uz: { required },
    support_type_ru: { required },
  }
);
const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.type_of_supports",
      route: "/dashboard/type-of-supports",
      link: false,
    },
  ];
});

// Add
const addSupport = () => {
  addModal.value = true;
};

const submitAdd = async () => {
  buttonLoading.value = true;
  await ApiService.post(`/api/v2/support-type-create/`, {
    title_uz: form.values.support_type_uz,
    title_ru: form.values.support_type_ru,
  })
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch(() => {
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (buttonLoading.value = false));

  form.values.support_type_uz = "";
  form.values.support_type_ru = "";
  form.$v.value.$reset();
  addModal.value = false;
  fetchTableData();
};

// Edit
const openEdit = async (id: number, title_uz: string, title_ru: string) => {
  supportId.value = id;
  form.values.support_type_uz = title_uz;
  form.values.support_type_ru = title_ru;

  editModal.value = true;
};

const submitEdit = async () => {
  buttonLoading.value = true;
  await ApiService.patch(`api/v2/support-type-update/${supportId.value}/`, {
    title_uz: form.values.support_type_uz,
    title_ru: form.values.support_type_ru,
  })
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch(() => {
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (buttonLoading.value = false));

  form.values.support_type_uz = "";
  form.values.support_type_ru = "";
  form.$v.value.$reset();
  editModal.value = false;
  fetchTableData();
};

// Delete
function openDelete(id: number) {
  supportId.value = id;
  showDelete.value = true;
}
const removeSupport = async () => {
  buttonLoading.value = true;

  await ApiService.delete(`api/v2/support-type-delete/${supportId.value}/`)
    .then(() => {
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      fetchTableData();
      showDelete.value = false;
    })
    .finally(() => (buttonLoading.value = false));
};

// Download Excel
function downloadExcel() {
  excelLoading.value = true;
  ApiService.get(`api/v2/support-type-list?export=1`)
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
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (excelLoading.value = false));
}
</script>
