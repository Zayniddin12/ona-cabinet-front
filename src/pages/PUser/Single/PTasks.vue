<template>
  <div>
    <UserTasksTable
      title="menus.tasks"
      :subtitle="$t('tasks_count', { count: paginationData?.total })"
      :header-data="
        useRoleManagement('edit', 'admin')
          ? userTasksHeaderData
          : userTasksHeaderData.slice(0, -1)
      "
      :current-page="paginationData.currentPage"
      :items-per-page="paginationData.defaultLimit"
      fetch-url=""
      statusKey="is_active"
      :statusColors="{ true: 'green', false: 'gray' }"
      @add="addShow = true"
      @delete="openDelete"
      @edit="editTaskModalOpen"
      v-bind="{ total: paginationData?.total, offset, tableData, loading }"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
    />

    <SAddTask
      v-bind="{ responsiblePersons, programs }"
      :form="Form"
      :show="addShow"
      :loading="buttonLoading"
      @fetch-more-programs="fetchMorePrograms"
      @fetch-more-resposible-persons="fetchMoreResponsiblePerson"
      @search-program="searchProgram"
      @search-responsible-person="searchResponsiblePerson"
      @close="addShow = false"
      @submit="createTask"
    />

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
  </div>
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

import { useForm } from "@/composables/useForm";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import UserTasksTable from "@/pages/PUser/Single/components/Table/UserTasksTable.vue";
import SAddTask from "@/pages/PUser/Single/components/Tasks/SAddTask.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SEditTask from "@/pages/PUser/Single/components/Tasks/SEditTask.vue";
import { userTasksHeaderData } from "@/pages/PUser/Single/data";
import { ITask } from "@/types/tasks";

const editShow = ref(false);
const showDelete = ref(false);
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const addShow = ref(false);
const buttonLoading = ref(false);
const responsiblePersons = ref([]);
const programs = ref([]);
const selectedTask = ref();

interface IParams {
  search?: string;
  offset: number;
  limit: number;
  hasNext: boolean;
}

const {
  offset,
  loading,
  tableData,
  paginationData,
  onPageChange,
  fetchTableData,
  onChangeLimit,
} = useTableFetch(`/api/v2/main/TaskList?participant=${route.params.id}`);
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

// Check Route
watch(
  () => route.query.status,
  () => {
    fetchTableData();
  }
);

const responsiblePersonParams = reactive<IParams>({
  offset: 0,
  limit: 20,
  hasNext: false,
});

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

const programParams = reactive<IParams>({
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

function fetchMorePrograms() {
  if (programParams.hasNext) {
    programParams.offset += 20;
    fetchPrograms();
  }
}

function searchProgram(searchText?: string) {
  programParams.offset = 0;
  programParams.search = searchText;
  fetchPrograms(false);
}

// Get Data
onMounted(() => {
  fetchResponsiblePersons();
  fetchPrograms();
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

// Create Task
function createTask() {
  buttonLoading.value = true;
  const data = {
    status: "on_process",
    akt_number: Form.values.akt,
    name_uz: Form.values.task,
    responsible_person: Form.values.responsible_person,
    program: Form.values.program,
    deadline: dayjs(Form.values.deadline).format("YYYY-MM-DD"),
    participant: +route.params.id,
  };

  ApiService.post("api/v2/main/TaskCreate", data)
    .then(() => {
      toast.success(t("successfully_added"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      fetchTableData();
      addShow.value = false;
    })
    .catch((err: any) => {
      showResponseError(err?.response?.data?.errors);
    })
    .finally(() => (buttonLoading.value = false));
}

// Delete Task
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

// Edit Task

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
</script>
