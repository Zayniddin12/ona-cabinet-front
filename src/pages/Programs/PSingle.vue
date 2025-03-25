<template>
  <Teleport v-if="mounted" to="#header-toolbar">
    <CHeadSection :routes="breadcrumbLink">
      <template v-if="useRoleManagement('edit', 'superadmin')">
        <SButton
          v-if="!user?.deleted"
          variant="danger"
          @click="showDelete = true"
        >
          <template #pre-icon>
            <img src="/assets/svg/buttons/trash.svg" alt="cancel" />
          </template>
          <p class="btn-text">
            {{ $t("put_archive") }}
          </p>
        </SButton>
        <SButton v-else variant="primary" @click="showRestart = true">
          <template #pre-icon>
            <inline-svg
              src="/assets/ona/svg/restart-white.svg"
              alt="cancel"
              class="me-1"
            />
          </template>
          <p class="btn-text">
            {{ $t("get_archive") }}
          </p>
        </SButton>
      </template>
      <template v-if="useRoleManagement('edit')">
        <SButton
          v-if="!user?.deleted"
          variant="primary"
          @click="editModal = true"
        >
          <template #pre-icon>
            <inline-svg src="/assets/ona/svg/pen.svg" class="me-1" />
          </template>
          <p class="btn-text">
            {{ $t("edit") }}
          </p>
        </SButton>
      </template>
    </CHeadSection>
  </Teleport>

  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("programs") }}
  </Teleport>

  <div>
    <SSingleHeaderCard
      @download="downloadShow = true"
      @last="showLastUpdates = true"
      :title="locale === 'uz' ? user?.name_uz : user?.name_ru"
      v-bind="{ loading }"
    >
      <template #details>
        <li>
          <div>
            <PreloaderSkeleton
              width="80px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <p class="partner-single-details__title">
                {{ user?.code }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="80px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("code") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
        <li>
          <div>
            <PreloaderSkeleton
              width="100px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <p class="partner-single-details__title transition-200">
                {{ user?.order_number }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="100px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("serial_number") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
        <li>
          <div>
            <PreloaderSkeleton
              width="100px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <p class="partner-single-details__title transition-200">
                {{ user?.women_count }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="100px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("number_of_women") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
      </template>
    </SSingleHeaderCard>

    <div class="task-card">
      <h2 class="task__title">
        <PreloaderSkeleton width="70px" v-bind="{ loading }" height="35px">
          {{ $t("description") }}
        </PreloaderSkeleton>
      </h2>
      <PreloaderSkeleton width="100%" v-bind="{ loading }" height="200px">
        <div
          class="v-html__text"
          v-html="locale === 'uz' ? user?.description_uz : user?.description_ru"
        />
      </PreloaderSkeleton>
    </div>
    <div>
      <STable
        :header-data="RPCareHeaderData"
        :title="$t('hisCare')"
        :subtitleCount="paginationData?.total"
        :subtitle="$t('menus.participants')"
        class="main-table user-table"
        statusKey="active"
        :statusColors="{
          false: 'gray',
          true: 'green',
        }"
        search-class="search"
        v-bind="{
          loading,
          total: paginationData.total,
          data: tableData,
          offset,
        }"
        :current-page="paginationData.currentPage"
        @search="onSearch($event, true)"
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
              popper-class="user-table__actions"
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
                <ElDropdownMenu>
                  <ElDropdownItem>
                    <button
                      class="btn btn-style user-table__actions-dropdown-item"
                      @click="downloadExcel"
                    >
                      <inline-svg src="/assets/ona/svg/download.svg" />
                      <span> {{ $t("import_excel") }} </span>
                    </button>
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </div>
        </template>
        <template v-slot:id="{ row: data }">
          {{ calcTabIndex(data?.index, offset) }}
        </template>
        <template v-slot:name="{ row: data }">
          <div class="position-relative user-table__item">
            <router-link
              :to="`/dashboard/participants/${data?.id}/main`"
              class="user-table__link transition-200"
            >
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.full_name }}
              </WordHighlighter>
            </router-link>
            <p>ID: {{ data?.ID }}</p>
          </div>
        </template>
        <template v-slot:birthday="{ row: data }">
          {{ formatDate(data?.birth_date) }}
        </template>
        <template v-slot:ijt="{ row: data }">
          {{ data?.point }}
        </template>
        <template v-slot:region="{ row: data }">
          {{ data?.living_region ? data?.living_region?.title : "-" }}
        </template>
        <template v-slot:illness="{ row: data }">
          {{ $t(data?.sickness_count ? "available" : "not_available") }}
        </template>
        <template v-slot:actions="{ row: data }">
          <el-dropdown
            class="user-table__action-dropdown"
            trigger="click"
            placement="bottom-end"
          >
            <button class="btn w-25px h-25px p-0">
              <inline-svg src="/assets/ona/svg/dots-vertical.svg" class="dot" />
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  class="border-b"
                  @click="
                    $router.push(`/dashboard/participants/${data?.id}/main`)
                  "
                >
                  <div class="d-flex align-items-center">
                    <inline-svg
                      src="/assets/ona/svg/eye-solid.svg"
                      class="text-2x d-inline-block me-2"
                    />
                    <span>{{ $t("view") }}</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

        <template #footerLeft>
          <STableLabels :labels="tableLabels" />
        </template>
      </STable>
      <CUserFilterModal
        wrapperStyle="row-cols-3"
        width="1048px"
        :show="showFilter"
        @close="showFilter = false"
        v-bind="{ filters }"
      />
    </div>
  </div>
  <ActionModal
    :show="editModal"
    @close="closeEditModal"
    edit
    :form="form"
    @submit="editProgram"
  />
  <SDeleteTaskModal
    :show="showRestart"
    :loading="restartLoading"
    title="restart_program_status"
    text="restart_program_status_text"
    button-text="restart"
    buttonVariant="primary"
    @close="showRestart = false"
    @submit="restartUser"
  />
  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="stop_program_status"
    text="stop_program_status_text"
    button-text="stop"
    @close="showDelete = false"
    @submit="removeUser"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useParticipantFilter from "@/composables/useParticipantFilter";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex, formatDate } from "@/helpers";
import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";
import ActionModal from "@/pages/Programs/Components/ActionModal.vue";
import SSingleHeaderCard from "@/pages/Programs/Components/SSingleHeaderCard.vue";
import { RPCareHeaderData } from "@/pages/PRPerson/data";
import CHeadSection from "@/pages/PUser/components/CHeadSection.vue";
import CUserFilterModal from "@/pages/PUser/components/Modals/CUserFilterModal.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import STableLabels from "@/stories/Common/TableLabels/STableLabels.vue";

const { mounted } = useMounted();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t, locale } = useI18n();
const downloadShow = ref<boolean>(false);
const showLastUpdates = ref<boolean>(false);
const editModal = ref<boolean>(false);
const showDelete = ref<boolean>(false);
const showRestart = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const restartLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const user = ref({});
// -------------------------------- ------------------------

const {
  offset,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `/api/v2/participants/participantList/?programs=${route.params.id}`
);
const showFilter = ref(false);

const tableLabels = [
  {
    color: "green",
    title: t("active"),
  },
  {
    color: "grey",
    title: t("inactive"),
  },
];
const downloadLoading = ref(false);
const { filters } = useParticipantFilter();
function downloadExcel() {
  downloadLoading.value = true;
  const params = route.query;
  ApiService.query(
    `api/v2/participants/participantGenerateExcel?responsible_person=${route.params.id}`,
    {
      params,
      responseType: "blob",
    }
  )
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
      toast.error(err, {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (downloadLoading.value = false));
}
// ----------------------------------- ---------------------
const breadcrumbLink = computed(() =>
  [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "programs",
      route: "/programs",
      link: true,
    },
    {
      name: locale.value === "uz" ? user?.value?.name_uz : user.value?.name_ru,
      route: "/responsible-person",
      link: true,
    },
  ].filter((p) => p.name)
);

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

// Fetch data
const getProgram = async () => {
  loading.value = true;

  await ApiService.get(`/api/v2/main/ProgramDetail/${route.params.id}`)
    .then(({ data }) => {
      user.value = data;
      form.values.name_uz = data?.name_uz;
      form.values.name_ru = data?.name_ru;
      form.values.description_uz = data?.description_uz;
      form.values.description_ru = data?.description_ru;
      form.values.code = data?.code;
      form.values.order_number = data?.order_number;
    })
    .finally(() => {
      loading.value = false;
    });
};

// const getWomenList = async () => {
//   await ApiService.get(
//     `/api/v2/participants/participantList/?programs=${route.params.id}`
//   ).then((res) => {
//     console.log(res.data);
//   });
// };
// Remove Program

const removeUser = () => {
  ApiService.patch(`api/v2/main/ProgramUpdate/${route.params.id}`, {
    deleted: true,
  }).then(() => {
    toast.success(t("archived_successfully"), {
      icon: {
        iconClass: "done-icon",
        iconTag: "div",
      },
    });
    router.go(-1);
  });
};

// Restart Program

const restartUser = () => {
  ApiService.patch(`api/v2/main/ProgramUpdate/${route.params.id}`, {
    deleted: false,
  }).then(() => {
    toast.success(t("recovered_successfully"), {
      icon: {
        iconClass: "done-icon",
        iconTag: "div",
      },
    });
    router.go(-1);
  });
};

// Edit Program

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
  await ApiService.put(`api/v2/main/ProgramUpdate/${route.params.id}`, {
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
      getProgram();
    });
};

onBeforeMount(async () => {
  await getProgram();
});
</script>

<style lang="scss" scoped>
.partner-single {
  &__status {
    background: #34ba281a;
    padding: 6px 20px;
    border-radius: 6px;
    font-weight: 400;
    font-size: 12px;
    color: #34ba28;
    line-height: 14px;
  }

  &-details {
    &__title {
      font-weight: 700;
      font-size: 14px;
      line-height: 130%;
      color: #353d35;

      span {
        font-weight: 500;
      }
    }

    &__subtitle {
      font-weight: 500;
      font-size: 13px;
      line-height: 130%;
      color: #b5b5c3;
      margin-top: 1px;
    }
  }
}

.toolbar-header {
  padding: 8px;
  border-top: 1px solid #eff2f5;
}

.download-li {
  margin-top: -4px;
  cursor: pointer;
  transition: all 200ms ease-in;

  &:hover {
    opacity: 70%;
  }

  &:active {
    transform: scale(0.9);
  }
}

.task-card {
  background: #fff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  padding: 28px;

  .task__title {
    text-transform: capitalize;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #1c1f20;
    margin-bottom: 16px;
  }

  .v-html__text {
    font-weight: 400;
    font-size: 16px;
    line-height: 140%;
    color: #1c1f20;
  }
}
</style>
