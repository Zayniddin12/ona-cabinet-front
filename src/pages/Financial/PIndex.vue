<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("history_of_support") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>

  <CreateAPIKeyModal />

  <STable
    v-bind="{ total: paginationData?.total }"
    :data="tableData"
    :header-data="
      useRoleManagement('add', ['responsible_person'])
        ? servicesHeaderData
        : servicesHeaderData.slice(0, -1)
    "
    :title="$t('history_of_support')"
    class="main-table user-table"
    :subtitle="$t('history_of_support')"
    :subtitle-count="paginationData?.total"
    :search="$route.query.search"
    :current-page="paginationData.currentPage"
    @search="onSearch"
    @page-change="onPageChange"
    @on-items-per-page-change="onChangeLimit"
  >
    <template #beforeSearch>
      <div class="d-flex align-items-center">
        <p class="text--secondary me-3">{{ $t("date") }}</p>
        <DatePicker v-model="filter.date" />
      </div>
    </template>
    <template #afterSearch>
      <div v-if="useRoleManagement('add', ['responsible_person'])" class="d-flex ms-6">
        <ElDropdown
          trigger="click"
          placement="bottom-end"
          class="se-dropdown"
          popper-class="se-dropdown-popper"
        >
          <SButton
            variant="green"
            :loading="downloadLoading"
            :text="$t('excel')"
            class="mr-4"
          >
            <template #pre-icon>
              <inline-svg src="/assets/ona/svg/excel.svg" class="me-1" />
            </template>
          </SButton>
          <template #dropdown>
            <ElDropdownItem @click="downloadExcel">
              <div class="d-flex align-items-center">
                <inline-svg
                  src="/assets/ona/svg/download.svg"
                  class="d-inline-block me-2"
                />
                <span> {{ $t("import_excel") }} </span>
              </div>
            </ElDropdownItem>
          </template>
        </ElDropdown>
        <router-link :to="{ name: 'financialCreate' }">
          <SButton variant="primary" text="add_new" class="">
            <template #pre-icon>
              <img src="/assets/svg/buttons/plus.svg" alt="plus" />
            </template>
          </SButton>
        </router-link>
      </div>
    </template>

    <template v-slot:id="{ row: data }">
      {{ data?.index }}
    </template>
    <template v-slot:participant="{ row: data }">
      <RouterLink
        :to="'financial/' + `${data?.id}`"
        class="user-table__item user-table__link"
      >
        <WordHighlighter :query="$route?.query?.search || ''">
          {{ data?.participant.full_name }}
        </WordHighlighter>
      </RouterLink>
    </template>
    <template v-slot:akt_number="{ row: data }">
      {{ data?.akt_number }}
    </template>
    <template v-slot:akt_date="{ row: data }">
      <span>{{ parseDate(data?.akt_date) }}</span>
    </template>
    <template v-slot:action="{ row: data }">
      <el-dropdown
        class="d-flex justify-content-end user-table__action-dropdown"
        trigger="click"
        placement="bottom-end"
      >
        <div>
          <button class="btn w-25px h-25px p-0">
            <inline-svg src="/assets/ona/svg/dots-vertical.svg" class="dot" />
          </button>
        </div>
        <template #dropdown>
          <el-dropdown-menu @click="getUserId(data?.id)">
            <el-dropdown-item class="border-b">
              <div class="d-flex align-items-center user-table__edit-dropdown">
                <inline-svg
                  src="/assets/svg/buttons/edit.svg"
                  class="text-2x d-inline-block me-2 blackEdit"
                />
                <router-link
                  :to="{
                    path: '/dashboard/financialEdit',
                    query: { id: data?.id },
                  }"
                >
                  <span class="edit-text">{{ $t("edit") }}</span>
                </router-link>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              v-if="useRoleManagement('', [])"
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

  <FModalEdit :form="Form" :show="editShow" @close="editShow = false" />
  <SDeleteTaskModal
    :title="$t('history_of_support_delete')"
    :show="showDelete"
    @close="showDelete = false"
    @submit="deleteCondition"
  />
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";
import { useStore } from "vuex";

import CreateAPIKeyModal from "@/components/modals/forms/CreateAPIKeyModal.vue";
import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { debounce, parseDate, updateQueryParams } from "@/helpers";
import FModalEdit from "@/pages/Financial/components/FModalEdit.vue";
import { servicesHeaderData } from "@/pages/Financial/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import DatePicker from "@/pages/Tasks/Components/DatePicker.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import { IObject, ISearchDateFilter } from "@/types";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const { mounted } = useMounted();

const showDelete = ref(false);
const editShow = ref(false);
const userId = ref();
const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "history_of_support",
      route: "/",
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
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `https://devona.uicgroup.tech/api/v2/main/FinSupportList${
    isResponsiblePerson.value ? "?self=true" : ""
  }`
);

const filter = reactive<ISearchDateFilter>({
  search: "",
  date: {
    start: null,
    end: null,
  },
});

const Form = useForm(
  {
    name: "",
    akt_number: null,
    date: null,
  },
  {
    name: {
      required,
    },
    akt_number: {
      required,
    },

    date: {
      required,
    },
  }
);

// function editTaskModalOpen(data: any) {
//   if (data) {
//     Form.values.name = data?.merchant?.name;
//     Form.values.akt_number = data?.serviceType;
//     Form.values.date = data?.deadline;
//     editShow.value = true;
//   }
// }

function getUserId(id: number) {
  userId.value = id;
}

function deleteCondition() {
  ApiService.delete(`api/v2/main/FinSupportDelete/${userId.value}`)
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
    .catch(() => {
      showDelete.value = false;
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
}

const downloadLoading = ref(false);

function downloadExcel() {
  downloadLoading.value = true;
  ApiService.query("api/v2/main/GenerateFinSupportExcel", {
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
  () => filter.date,
  async (newValue) => {
    const queryParams: IObject = {
      akt_date__gte: newValue.start
        ? dayjs(newValue.start).format("YYYY-MM-DD")
        : undefined,
      akt_date__lte: newValue.end
        ? dayjs(newValue.end).format("YYYY-MM-DD")
        : undefined,
    };
    await updateQueryParams(queryParams);
  },
  { deep: true }
);

watch(
  () => route.query,
  () => fetchTableData()
);

watch(
  () => filter.search,
  (newValue) => {
    debounce("search", () => updateQueryParams({ search: newValue }));
  },
  { deep: true }
);
</script>
