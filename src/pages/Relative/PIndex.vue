<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.relative") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <CreateAPIKeyModal />
  <STable
    v-bind="{ loading, offset }"
    :subtitleCount="paginationData?.total"
    :total="paginationData?.total"
    :items-per-page="paginationData.defaultLimit"
    :header-data="
      useRoleManagement('edit')
        ? servicesHeaderData
        : servicesHeaderData.slice(0, -1)
    "
    :data="tableData"
    :title="$t('menus.relative')"
    class="main-table user-table"
    :subtitle="$t('menus.relative')"
    :search="$route.query.search"
    :current-page="paginationData.currentPage"
    @search="onSearch"
    @page-change="onPageChange"
    @on-items-per-page-change="onChangeLimit"
  >
    <template #afterSearch>
      <SButton
        v-if="useRoleManagement('edit')"
        variant="primary"
        :text="$t('add_new')"
        @click="addShow = true"
        class="ms-6"
      >
        <template #pre-icon>
          <img src="/assets/svg/buttons/plus.svg" alt="plus" />
        </template>
      </SButton>
    </template>
    <template v-slot:id="{ row: data }">
      {{ calcTabIndex(data?.index, offset) }}
    </template>
    <template v-slot:name="{ row: data }">
      <WordHighlighter :query="$route?.query?.search || ''">
        {{ data?.name }}
      </WordHighlighter>
    </template>
    <template v-slot:action="{ row: data }">
      <el-dropdown
        class="d-flex justify-content-end user-table__action-dropdown"
        trigger="click"
        placement="bottom-end"
      >
        <div>
          <button class="btn btn-active-light w-25px h-25px p-0">
            <inline-svg
              src="/assets/ona/svg/dots-vertical.svg"
              class="text-2x dot"
            />
          </button>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="border-b">
              <div
                class="d-flex align-items-center user-table__edit-dropdown"
                @click="editTaskModalOpen(data?.id)"
              >
                <inline-svg
                  src="/assets/svg/buttons/edit.svg"
                  class="text-2x d-inline-block me-2 blackEdit"
                />
                <span class="edit-text">{{ $t("edit") }}</span>
              </div>
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
  <CActionModal
    :form="form"
    :show="addShow"
    @close="addShow = false"
    @submit="submitForm('add')"
    add
  />
  <CActionModal
    :form="form"
    :show="editShow"
    @close="editShow = false"
    @submit="submitForm('edit')"
    edit
  />
  <SDeleteTaskModal
    title="remove_relative"
    :show="showDelete"
    @close="showDelete = false"
    @submit="deleteRelative"
    :loading="deleteLoading"
  />
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { required } from "@vuelidate/validators";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import CreateAPIKeyModal from "@/components/modals/forms/CreateAPIKeyModal.vue";
import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex } from "@/helpers";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import CActionModal from "@/pages/Relative/components/CActionModal.vue";
import { servicesHeaderData } from "@/pages/Relative/data";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const {
  loading,
  offset,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch("https://devona.uicgroup.tech/api/v2/main/RelativeTypeList");

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const addShow = ref(false);
const editShow = ref(false);
const relativeId = ref(0);
const showDelete = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.relative",
      route: "/dashboard/relative",
      link: false,
    },
  ];
});

const form = useForm(
  {
    name_uz: "",
    name_ru: "",
  },
  {
    name_uz: {
      required,
    },
    name_ru: {
      required,
    },
  }
);

function editTaskModalOpen(id: number) {
  relativeId.value = id;
  ApiService.get(`/api/v2/main/RelativeTypeDetail/${id}`).then(({ data }) => {
    form.values.name_uz = data?.name_uz;
    form.values.name_ru = data?.name_ru;
  });

  editShow.value = true;
}

function submitForm(type: string) {
  const obj = {
    name_uz: form.values.name_uz,
    name_ru: form.values.name_ru,
  };
  if (type === "add") {
    ApiService.post("api/v2/main/RelativeTypeCreate", obj)
      .then(() => {
        fetchTableData();
        addShow.value = false;
        toast.success(t("successfully_added"), {
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
      });
  } else {
    ApiService.put(`api/v2/main/RelativeTypeUpdate/${relativeId.value}`, obj)
      .then(() => {
        editShow.value = false;
        fetchTableData();
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
      });
  }
}

function showDeleteModal(id: number) {
  relativeId.value = id;
  showDelete.value = true;
}

function deleteRelative() {
  deleteLoading.value = true;
  ApiService.delete(`api/v2/main/RelativeTypeDelete/${relativeId.value}`)
    .then(() => {
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch(() => {
      showDelete.value = false;
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => {
      deleteLoading.value = false;
      showDelete.value = false;
      onPageChange(1);
    });
}
</script>

<style>
.btn-style {
  margin-left: 20px;
}
</style>
