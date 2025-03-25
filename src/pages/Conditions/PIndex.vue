<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("conditions") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <CreateAPIKeyModal />
  <STable
    v-bind="{ total: paginationData?.total, offset, loading }"
    :data="tableData"
    :header-data="
      useRoleManagement('edit')
        ? servicesHeaderData
        : servicesHeaderData.slice(0, -1)
    "
    is-not-end
    :title="$t('conditions')"
    class="i-table-two main-table user-table"
    :subtitle="$t('conditions')"
    :subtitle-count="paginationData?.total"
    :search="$route.query.search"
    @search="onSearch"
    @page-change="onPageChange"
    @on-items-per-page-change="onChangeLimit"
    :current-page="paginationData.currentPage"
    :items-per-page="paginationData.defaultLimit"
  >
    <template #beforeSearch>
      <Dropdown1 />
    </template>

    <template #afterSearch>
      <SButton
        v-if="useRoleManagement('edit')"
        variant="primary"
        text="add_new"
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
    <template v-slot:title="{ row: data }">
      <WordHighlighter :query="$route?.query?.search || ''">
        {{ data?.title }}
      </WordHighlighter>
    </template>
    <template v-slot:serviceType="{ row: data }">
      <WordHighlighter :query="$route?.query?.search || ''">
        {{ data?.condition_type?.title }}
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
          <el-dropdown-menu @click="getConditionId(data.id)">
            <el-dropdown-item
              class="border-b"
              @click="editTaskModalOpen(data?.id)"
            >
              <div class="d-flex align-items-center user-table__edit-dropdown">
                <inline-svg
                  src="/assets/svg/buttons/edit.svg"
                  class="text-2x d-inline-block me-2 blackEdit"
                />
                <span class="edit-text">{{ $t("edit") }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              class="border-b delete user-table__trash-dropdown"
              @click="showDelete = true"
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
    @close="closeModal('add')"
    @submit="submitForm('add')"
    add
    :options="options"
  />
  <CActionModal
    :form="form"
    :show="editShow"
    @close="closeModal('edit')"
    @submit="submitForm('edit')"
    edit
    :options="options"
  />
  <SDeleteTaskModal
    title="delete_condition"
    :show="showDelete"
    @close="showDelete = false"
    @submit="deleteCondition"
  />
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { maxValue, minValue, required } from "@vuelidate/validators";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import CreateAPIKeyModal from "@/components/modals/forms/CreateAPIKeyModal.vue";
import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex } from "@/helpers";
import CActionModal from "@/pages/Conditions/components/CActionModal.vue";
import { servicesHeaderData } from "@/pages/Conditions/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const { mounted } = useMounted();

const showDelete = ref(false);
const addShow = ref(false);
const editShow = ref(false);
const conditionID = ref(0);
const options = ref([]);

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "conditions",
      route: "/dashboard/conditions",
      link: false,
    },
  ];
});

const { t } = useI18n();
const toast = useToast();

const {
  loading,
  offset,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch("https://devona.uicgroup.tech/api/v2/main/ConditionList");

const form = useForm(
  {
    title_uz: "",
    title_ru: "",
    type: null,
    point: null,
  },
  {
    title_uz: {
      required,
    },
    title_ru: {
      required,
    },
    type: {
      required,
    },
    point: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(100),
    },
  }
);

const closeModal = (type: string) => {
  if (type === "add") {
    addShow.value = false;
  } else {
    editShow.value = false;
  }

  form.values.title_uz = "";
  form.values.title_ru = "";
  form.values.type = null;
  form.values.point = null;
  form.$v.value.$reset();
};

function editTaskModalOpen(id: any) {
  ApiService.get(`api/v2/main/ConditionDetail/${id}`).then(({ data }) => {
    form.values.title_uz = data?.title_uz;
    form.values.title_ru = data?.title_ru;
    form.values.type = data?.type;
    form.values.point = data?.point;
  });
  editShow.value = true;
}

function getConditionId(id: number) {
  conditionID.value = id;
}

function deleteCondition() {
  ApiService.delete(`api/v2/main/ConditionDelete/${conditionID.value}`)
    .then(() => {
      showDelete.value = false;
      fetchTableData();
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch((error) => {
      toast.error(error, {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
}

const submitForm = (type: string) => {
  const dataObj = {
    title_uz: form.values.title_uz,
    title_ru: form.values.title_ru,
    type: form.values.type,
    point: form.values.point,
  };

  if (type === "add") {
    ApiService.post("api/v2/main/ConditionCreate", dataObj)
      .then(() => {
        fetchTableData();
        closeModal("add");
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
    ApiService.put(`api/v2/main/ConditionUpdate/${conditionID.value}`, dataObj)
      .then(() => {
        fetchTableData();
        closeModal("edit");
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
};

ApiService.get("api/v2/main/ConditionTypeList").then((res) => {
  options.value = res?.data.results;
});
</script>

<style>
.btn-style {
  margin-left: 20px;
}
</style>
