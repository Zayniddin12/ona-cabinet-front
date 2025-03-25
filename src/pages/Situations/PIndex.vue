<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.situations") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <STable
    v-bind="{ total: paginationData?.total, loading, offset }"
    :data="tableData"
    :header-data="
      useRoleManagement('edit')
        ? servicesHeaderData
        : servicesHeaderData.slice(0, -1)
    "
    is-not-end
    :title="$t('menus.situations')"
    class="i-table-two main-table user-table"
    :subtitleCount="paginationData?.total"
    :subtitle="$t('menus.situationsCount')"
    :search="$route.query.search"
    @search="onSearch"
    @page-change="onPageChange"
    @on-items-per-page-change="onChangeLimit"
    :current-page="paginationData.currentPage"
    :items-per-page="paginationData.defaultLimit"
  >
    <template #afterSearch>
      <SButton
        v-if="useRoleManagement('edit')"
        variant="primary"
        text="menus.add_new"
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
      {{ $t(`selection_type_arr[${data?.selection_type - 1}]`) }}
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
            <el-dropdown-item class="border-b" @click="editTaskModalOpen(data)">
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
              @click="showDeleteModal(data.id)"
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
  <SActionModal
    :form="form"
    :show="addShow"
    @close="closeModal('add')"
    add
    @submit="addSituation"
    :options_uz="options_uz"
    :options_ru="options_ru"
    :place-list="placeList"
    :placeListRu="placeListRu"
  />
  <SActionModal
    :form="form"
    :show="editShow"
    @close="closeModal('edit')"
    edit
    :options_uz="options_uz"
    :options_ru="options_ru"
    @submit="editSituation"
    :place-list="placeList"
    :placeListRu="placeListRu"
  />
  <SDeleteTaskModal
    title="delete_task"
    :show="showDelete"
    @close="showDelete = false"
    :loading="deleteLoading"
    @submit="deleteSituation"
  />
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { required } from "@vuelidate/validators";
import { computed, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex } from "@/helpers";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SActionModal from "@/pages/Situations/components/SActionModal.vue";
import { servicesHeaderData } from "@/pages/Situations/data";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const showDelete = ref(false);
const deleteLoading = ref();
const addShow = ref(false);
const editShow = ref(false);
const situationID = ref(0);
const placeList = ref([]);
const placeListRu = ref([]);

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const options_uz = ref([
  {
    label: "Yagona tanlov",
    value: 1,
  },
  {
    label: "Ko‘p tanlov",
    value: 2,
  },
]);

const options_ru = ref([
  {
    label: "Единственный выбор",
    value: 1,
  },
  {
    label: "Множественный выбор",
    value: 2,
  },
]);

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.situations",
      route: "/dashboard/situations",
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
} = useTableFetch("https://devona.uicgroup.tech/api/v2/main/ConditionTypeList");

const form = useForm(
  {
    title_uz: "",
    title_ru: "",
    place: null,
    selection_type: null,
  },
  {
    title_uz: {
      required,
    },
    title_ru: {
      required,
    },
    place: {
      required,
    },
    selection_type: {
      required,
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
  form.values.place = null;
  form.values.selection_type = null;
  form.$v.value.$reset();
};

function editTaskModalOpen(data: any) {
  situationID.value = data?.id;
  ApiService.get(`api/v2/main/ConditionTypeDetail/${data?.id}`).then((res) => {
    form.values.title_uz = res?.data.title_uz;
    form.values.title_ru = res?.data.title_ru;
    form.values.place = res?.data.place;
    form.values.selection_type = res?.data.selection_type;
  });
  editShow.value = true;
}

function showDeleteModal(id: number) {
  situationID.value = id;

  showDelete.value = true;
}

function deleteSituation() {
  deleteLoading.value = true;
  ApiService.delete(`api/v2/main/ConditionTypeDelete/${situationID.value}`)
    .then(() => {
      toast.success(t("successfully_removed"), {
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
    .finally(() => {
      deleteLoading.value = false;
      showDelete.value = false;
      fetchTableData();
    });
}

const addSituation = () => {
  const postObj = {
    title_uz: form.values.title_uz,
    title_ru: form.values.title_ru,
    place: form.values.place,
    selection_type: form.values.selection_type,
  };
  ApiService.post("api/v2/main/ConditionTypeCreate", postObj)
    .then(() => {
      closeModal("add");
      fetchTableData();
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
};

function editSituation() {
  const editObj = {
    title_uz: form.values.title_uz,
    title_ru: form.values.title_ru,
    place: form.values.place,
    selection_type: form.values.selection_type,
  };
  ApiService.put(
    `api/v2/main/ConditionTypeUpdate/${situationID.value}`,
    editObj
  )
    .then(() => {
      closeModal("edit");
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

onBeforeMount(() => {
  ApiService.get("api/v2/main/ConditionTypePlace", {
    headers: {
      "Accept-Language": "uz",
    },
  }).then((res) => {
    placeList.value = res.data;
  });
  ApiService.get("api/v2/main/ConditionTypePlace", {
    headers: {
      "Accept-Language": "ru",
    },
  }).then((res) => {
    placeListRu.value = res.data;
  });
});
</script>

<style>
.btn-style {
  margin-left: 20px;
}
</style>
