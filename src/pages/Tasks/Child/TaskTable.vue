<template>
  <STable
    v-bind="{
      loading,
      total: paginationData.total,
      data: tableData,
      offset,
      bgRed,
    }"
    :header-data="AllTasksHeaderData"
    :subtitleCount="paginationData?.total"
    class="main-table"
    withoutHeader
    statusKey="status"
    :statusColors="{
      on_process: 'red',
      not_completed: 'blue',
      completed: 'green',
    }"
    @search="onSearch"
    @page-change="onPageChange"
    @on-items-per-page-change="onChangeLimit"
    :current-page="paginationData.currentPage"
    :items-per-page="paginationData.defaultLimit"
  >
    <template #afterSearch>
      <SButton variant="primary" :text="$t('menus.add_new')" class="ms-6">
        <template #pre-icon>
          <img src="/assets/svg/buttons/plus.svg" alt="plus" />
        </template>
      </SButton>
    </template>
    <template v-slot:id="{ row: data }"> {{ data?.index }}.</template>
    <template v-slot:task_name="{ row: data }">
      <router-link
        :to="`/dashboard/participants/${route?.params?.id}/tasks/${data?.id}`"
        class="task__title"
      >
        <WordHighlighter :query="$route?.query?.search || ''">
          {{ data?.name }}
        </WordHighlighter>
      </router-link>
    </template>
    <template v-slot:akt_number="{ row: data }">
      {{ data?.akt_number }}
    </template>
    <template v-slot:task_status="{ row: data }">
      <SBadge :text="$t(data?.status)" :variant="getVariant(data?.status)" />
    </template>
    <template v-slot:deadline="{ row: data }">
      {{ parseDate(data?.deadline) }}
    </template>
    <template v-slot:responsible_person="{ row: data }">
      {{ data?.responsible_person }}
    </template>
    <template
      v-if="useRoleManagement('delete', 'admin')"
      v-slot:actions="{ row: data }"
    >
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
            <el-dropdown-item class="border-b" @click="editTaskModalOpen(data)">
              <div class="d-flex align-items-center">
                <inline-svg
                  src="/assets/ona/svg/pen-solid.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span>{{ $t("edit") }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              v-if="useRoleManagement('delete', 'superadmin')"
              class="border-b delete"
              @click="openDelete(data)"
            >
              <div class="d-flex align-items-center">
                <inline-svg
                  src="/assets/ona/svg/trash.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span>{{ $t("delete") }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </STable>
  <SEditTask
    :form="Form"
    :show="editShow"
    @close="editShow = false"
    v-bind="{ responsiblePersons, programs }"
    @submit="editTask"
    @fetch-more-programs="fetchMorePrograms"
    @fetch-more-resposible-persons="fetchMoreResponsiblePerson"
    @search-program="searchProgram"
    @search-responsible-person="searchResponsiblePerson"
  />

  <SDeleteTaskModal
    :show="showDelete"
    @close="showDelete = false"
    @submit="deleteTask"
    :loading="buttonLoading"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import { useForm } from "@/composables/useForm";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { parseDate, updateQueryParams } from "@/helpers";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SEditTask from "@/pages/PUser/Single/components/Tasks/SEditTask.vue";
import { AllTasksHeaderData } from "@/pages/Tasks/data";
import SBadge from "@/stories/Common/Badge/SBadge.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import { ITask } from "@/types/tasks";

const showDelete = ref(false);
const toast = useToast();
const buttonLoading = ref(false);
const responsiblePersons = ref([]);
const programs = ref([]);
const { t } = useI18n();
const selectedTask = ref(null);
function openDelete(task: ITask) {
  selectedTask.value = task;
  showDelete.value = true;
}
function deleteTask() {
  buttonLoading.value = true;
  ApiService.delete(`api/v2/main/TaskDelete/${selectedTask.value.id}`)
    .then(() => {
      fetchTableData();
      showDelete.value = false;
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch((err: any) => {
      showResponseError(err?.response?.data?.errors);
    })
    .finally(() => (buttonLoading.value = false));
}
// Show Error
function showResponseError(err: any) {
  if (err) {
    toast.error(t(err[0]?.error), {
      icon: {
        iconClass: "error-icon",
        iconTag: "div",
      },
    });
  } else {
    toast.error(t("something_went_wrong"), {
      icon: {
        iconClass: "error-icon",
        iconTag: "div",
      },
    });
  }
}
function searchProgram(searchText?: string) {
  programParams.offset = 0;
  programParams.search = searchText;
  fetchPrograms(false);
}
function fetchMoreResponsiblePerson() {
  if (responsiblePersonParams.hasNext) {
    responsiblePersonParams.offset += 20;
    fetchResponsiblePersons();
  }
}
function searchResponsiblePerson(searchText?: string) {
  responsiblePersonParams.offset = 0;
  responsiblePersonParams.search = searchText;
  fetchResponsiblePersons(false);
}
const programParams = reactive({
  offset: 0,
  limit: 20,
  hasNext: false,
});
function fetchPrograms(merge = true) {
  ApiService.query("api/v2/main/ProgramList", {
    params: programParams,
  }).then((res: any) => {
    programs.value = merge
      ? [...programs.value, ...(res?.data?.results ?? [])]
      : res?.data?.results;
    programParams.hasNext = !!res.data.next;
  });
}
fetchPrograms();
function fetchMorePrograms() {
  if (programParams.hasNext) {
    programParams.offset += 20;
    fetchPrograms();
  }
}
const responsiblePersonParams = reactive({
  offset: 0,
  limit: 20,
  hasNext: false,
});
function editTaskModalOpen(data: any) {
  if (data) {
    Form.values.id = data?.id;
    Form.values.task = data?.name;
    Form.values.akt = data?.akt_number;
    Form.values.program = data?.program?.id;
    Form.values.responsible_person = data?.responsible_data?.id;
    Form.values.deadline = data?.deadline;
    editShow.value = true;
  }
}

function fetchResponsiblePersons(merge = true) {
  ApiService.query("api/v2/main/ResponsiblePersonList?active=true", {
    params: responsiblePersonParams,
  }).then((res: any) => {
    responsiblePersons.value = merge
      ? [...responsiblePersons.value, ...(res?.data?.results ?? [])]
      : res?.data?.results;
    responsiblePersonParams.hasNext = !!res.data.next;
  });
}
fetchResponsiblePersons();

const Form = useForm(
  {
    task: "",
    akt: null,
    program: null,
    responsible_person: null,
    deadline: "",
  },
  {
    task: {
      required,
    },
    akt: {
      required,
    },
    program: {
      required,
    },
    responsible_person: {
      required,
    },
    deadline: {
      required,
    },
  }
);

function editTask() {
  buttonLoading.value = true;
  const data: any = {
    status: "on_process",
    akt_number: Form.values.akt,
    name_uz: Form.values.task,
    responsible_person: Form.values.responsible_person,
    program: Form.values.program,
    deadline: dayjs(Form.values.deadline).format("YYYY-MM-DD"),
  };

  ApiService.put(`api/v2/main/TaskUpdate/${Form.values.id}`, data)
    .then(() => {
      toast.success(t("successfully_edited"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      fetchTableData();
      editShow.value = false;
    })
    .catch((err: any) => {
      showResponseError(err?.response?.data?.errors);
    })
    .finally(() => (buttonLoading.value = false));
}

interface Props {
  data?: string;
  status?: string;
  bgRed?: string;
}
defineProps<Props>();
const editShow = ref(false);
const route = useRoute();
const router = useRouter();
const getStatus = computed(() => {
  if (route.name === "LateTasks") {
    return "on_process";
  } else if (route.name === "UndoneTasks") {
    return "not_completed";
  } else if (route.name === "DoneTasks") {
    return "completed";
  } else {
    return "";
  }
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
} = useTableFetch(`api/v2/main/TaskList?status=${getStatus.value}`);

function getVariant(status: string) {
  if (status === "not_completed") {
    return "red";
  } else if (status === "on_process") {
    return "yellow";
  } else {
    return "green";
  }
}

onMounted(() => {
  fetchTableData();
});
watch(
  () => route.query,
  () => {
    fetchTableData();
    updateQueryParams({ total: paginationData.total }, false);
  }
);

watch(
  () => paginationData.total,
  () => {
    // router.push({ query: { total: paginationData.total } });
    updateQueryParams({ total: paginationData.total }, false);
  }
);
</script>

<style>
.btn-style {
  margin-left: 20px;
}
.task__title {
  color: #1c1f20;

  &:hover {
    color: #00a3ff;
  }
}
</style>
