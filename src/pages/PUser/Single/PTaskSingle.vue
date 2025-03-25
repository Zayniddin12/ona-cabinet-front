<template>
  <div>
    <Teleport v-if="mounted" to="#header-toolbar">
      <div class="bg-white toolbar-header">
        <div
          class="container py-0 d-flex align-items-center justify-content-between"
        >
          <el-breadcrumb class="d-flex align-items-center" separator="•">
            <el-breadcrumb-item :to="{ name: 'Dashboard' }">
              {{ $t("main") }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              :to="{ name: 'UserSingle', params: { id: $route.params.id } }"
              >{{ $t("user") }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              :to="{ name: 'userTasks', params: { id: $route.params.id } }"
              >{{ $t("task") }}
            </el-breadcrumb-item>
            <el-breadcrumb-item class="line-clamp-1"
              >{{ task?.name_uz }}
            </el-breadcrumb-item>
          </el-breadcrumb>

          <div class="d-flex align-items-center gap-4">
            <SButton
              v-if="task?.status === 'on_process'"
              variant="secondary"
              @click="showDone = true"
            >
              <div class="d-flex align-items-center gap-1">
                <inline-svg src="/assets/ona/svg/done-outline.svg" />
                {{ $t("made") }}
              </div>
            </SButton>
            <SButton variant="danger" @click="showDelete = true">
              <div class="d-flex align-items-center gap-1">
                <inline-svg src="/assets/ona/svg/trash.svg" />
                {{ $t("delete") }}
              </div>
            </SButton>
            <SButton
              v-if="task?.status === 'on_process'"
              @click="editTaskModalOpen(task)"
            >
              <div class="d-flex align-items-center gap-1">
                <inline-svg src="/assets/ona/svg/pen.svg" />
                {{ $t("edit") }}
              </div>
            </SButton>
          </div>
        </div>
      </div>
    </Teleport>
    <SUserTaskSingleHeader :title="task?.name_uz">
      <template #details>
        <li v-if="task?.akt_number">
          <div>
            <p class="detail-content">
              {{ task?.akt_number }}
            </p>
            <p class="detail-title">
              {{ $t("akt") }}
            </p>
          </div>
        </li>
        <li v-if="task?.akt_number">
          <div>
            <p class="detail-content">
              {{ task?.responsible_data?.user }}
            </p>
            <p class="detail-title">
              {{ $t("responsible_person") }}
            </p>
          </div>
        </li>
        <li v-if="task?.responsible_person">
          <div>
            <p class="detail-content">
              {{ task?.responsible_person }}
            </p>
            <p class="detail-title">
              {{ $t("responsible_person") }}
            </p>
          </div>
        </li>
        <li v-if="task?.deadline">
          <div>
            <p class="detail-content">
              {{ dayjs(task?.deadline).format("DD.MM.YYYY") }}
            </p>
            <p class="detail-title">
              {{ $t("period") }}
            </p>
          </div>
        </li>
        <li v-if="task?.status">
          <div>
            <p class="detail-content" :class="checkColor(task?.status)">
              {{ $t(task?.status) }}
            </p>
            <p class="detail-title">
              {{ $t("task_status") }}
            </p>
          </div>
        </li>
      </template>
    </SUserTaskSingleHeader>
    <div class="card-task p-8">
      <p class="card-task__title">{{ $t("program") }}</p>

      <div v-if="task?.program?.name" class="mt-5 d-flex flex-column gap-1">
        <li class="d-flex align-items-center gap-2">
          <div class="dot flex-shrink-0" />
          <p class="text-dark-black leading-140 fs-4">
            {{ task?.program?.name }}
          </p>
        </li>
      </div>
    </div>

    <SEditTask
      :form="Form"
      :show="editShow"
      @close="editShow = false"
      v-bind="{ responsiblePersons, programs }"
      :loading="buttonLoading"
      @submit="editTask"
    />
    <SDeleteTaskModal
      :show="showDelete"
      @close="showDelete = false"
      @submit="showDelete = false"
    />

    <SDeleteTaskModal
      :show="showDone"
      button-variant="primary"
      :title="$t('to_done')"
      :button-text="$t('done')"
      :text="$t('to_done_text')"
      @close="showDone = false"
      @submit="toComplete"
      :loading="buttonLoading"
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
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import ApiService from "@/core/services/ApiService";
import SUserTaskSingleHeader from "@/pages/PUser/components/Single/SUserTaskSingleHeader.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SEditTask from "@/pages/PUser/Single/components/Tasks/SEditTask.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

const { mounted } = useMounted();

const responsiblePersons = ref([]);
const programs = ref([]);
const editShow = ref(false);
const showDone = ref(false);
const showDelete = ref(false);
const task: any = ref();
const toast = useToast();
const { t } = useI18n();
const buttonLoading = ref(false);
const route = useRoute();
const router = useRouter();
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

function getSingle() {
  ApiService.get(`api/v2/main/TaskDetail/${route.params.task}`).then(
    (res: any) => {
      task.value = res?.data;
    }
  );
}
watch(
  () => route.params.task,
  () => getSingle()
);

onMounted(() => {
  getSingle();
  // Responsible People
  ApiService.query("api/v2/main/ResponsiblePersonList?active=true", {}).then(
    (res: any) => {
      responsiblePersons.value = res?.data?.results;
    }
  );
  // Programs
  ApiService.query("api/v2/main/ProgramList", {}).then((res: any) => {
    programs.value = res?.data?.results;
  });
});

// Edit Task

function editTaskModalOpen(data: any) {
  if (data) {
    Form.values.id = data?.id;
    Form.values.task = data?.name_uz;
    Form.values.akt = data?.akt_number;
    Form.values.program = data?.program?.id;
    Form.values.responsible_person = data?.responsible_data?.id;
    Form.values.deadline = data?.deadline;
    editShow.value = true;
  }
}

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

  ApiService.put(`api/v2/main/TaskUpdate/${route.params.task}`, data)
    .then(() => {
      toast.success(t("successfully_edited"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      getSingle();
      editShow.value = false;
    })
    .catch((err: any) => {
      showResponseError(err?.response?.data?.errors);
    })
    .finally(() => (buttonLoading.value = false));
}

// Check status color
const checkColor = (status: string) => {
  if (status === "on_process") {
    return "text-yellow";
  } else if (status === "not_completed") {
    return "text-blue";
  } else {
    return "green";
  }
};

// Show error
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

// Complete

function toComplete() {
  buttonLoading.value = true;
  ApiService.patch(`api/v2/main/TaskUpdate/${route.params.task}`, {
    status: "completed",
  })
    .then(() => {
      getSingle();
      showDone.value = false;
    })
    .catch((err: any) => {
      toast.error(t(err?.response?.data?.detail), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (buttonLoading.value = false));
}

// Delete Task
function deleteTask() {
  buttonLoading.value = true;
  ApiService.delete(`api/v2/main/TaskDelete/${route.params.task}`)
    .then(() => {
      showDelete.value = false;
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });

      router.push(`/dashboard/participants/${route.params.id}/tasks`);
    })
    .catch((err: any) => {
      showResponseError(err?.response?.data?.errors);
    })
    .finally(() => (buttonLoading.value = false));
}
</script>

<style lang="scss" scoped>
.toolbar-header {
  padding: 8px;
  border-top: 1px solid #eff2f5;
}

.card-task {
  background: #ffffff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  margin-top: 28px;

  .dot {
    width: 4px;
    height: 4px;
    background: #1c1f20;
    border-radius: 999px;
  }

  &__title {
    font-weight: 500;
    font-size: 22px;
    line-height: 140%;
    color: #1c1f20;
  }
}
</style>
