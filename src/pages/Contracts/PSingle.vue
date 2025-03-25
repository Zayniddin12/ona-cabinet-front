<template>
  <Teleport v-if="mounted" to="#header-toolbar">
    <CHeadSection :routes="breadcrumbLink">
      <template
        v-if="useRoleManagement('edit', 'superadmin') || isResponsiblePerson"
      >
        <a
          class="btn mbtn d-flex align-items-center justify-content-center position-relative type__download"
          :href="user?.files?.[0]?.file"
          target="_blank"
        >
          <inline-svg
            src="/assets/ona/svg/download-icon.svg"
            alt="cancel"
            class="me-1"
          />
          <p class="btn-text">
            {{ $t("download_docs") }}
          </p>
        </a>
        <SButton
          v-if="
            (user?.deleted && useRoleManagement('', [])) || isResponsiblePerson
          "
          variant="primary"
          @click="showRestart = true"
        >
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
        <SButton
          v-else-if="
            (!user?.deleted && useRoleManagement('', [])) || isResponsiblePerson
          "
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
      </template>
      <template v-if="useRoleManagement('edit') || isResponsiblePerson">
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
    {{ $t("menus.contract") }}
  </Teleport>

  <div>
    <SSingleHeaderCard
      @download="downloadShow = true"
      @last="showLastUpdates = true"
      :title="user?.participant?.full_name"
      v-bind="{ loading }"
    >
      <template #badges>
        <PreloaderSkeleton
          width="90px"
          v-bind="{ loading }"
          height="20px"
          preloader-class="mb-1"
        >
          <div class="d-flex align-items-center gap-1 mt-1">
            <inline-svg src="/assets/ona/svg/user-solid.svg" />
            <p class="text-secondary-dark fs-7 fw-bold">
              ID: {{ user?.participant?.ID }}
            </p>
          </div>
        </PreloaderSkeleton>
      </template>
      <template #details>
        <li>
          <div>
            <PreloaderSkeleton
              width="90px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <p class="partner-single-details__title transition-200">
                {{ $t(`statusArr[${user?.status - 1}]`) }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="90px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("status") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
        <li>
          <div>
            <PreloaderSkeleton
              width="120px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <p class="partner-single-details__title transition-200">
                {{ formatDateWithMonth(user?.start_date) }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="120px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("started_date") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
        <li>
          <div>
            <PreloaderSkeleton
              width="120px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <p class="partner-single-details__title transition-200">
                {{ formatDateWithMonth(user?.end_date) }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="120px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("ended_date") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
      </template>
      <template #single-file>
        <SFileCard
          style="padding-bottom: 12px"
          v-for="(file, ind) of user?.files"
          :key="ind"
          :file="file"
          v-bind="{ loading }"
        />
      </template>
    </SSingleHeaderCard>
  </div>
  <ActionModal
    :show="editModal"
    @close="closeEditModal"
    @submit="submitEdit"
    edit
    :form="form"
    :participantList="participantList.results"
    @on-search="fetchParticipant"
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
import dayjs from "dayjs";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import SFileCard from "@/components/cards/SFileCard.vue";
import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import ApiService from "@/core/services/ApiService";
import { formatDateWithMonth } from "@/helpers";
import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";
import ActionModal from "@/pages/Contracts/Components/ActionModal.vue";
import SSingleHeaderCard from "@/pages/PRPerson/Components/SSingleHeaderCard.vue";
import CHeadSection from "@/pages/PUser/components/CHeadSection.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { mounted } = useMounted();
const { t } = useI18n();
const loading = ref(false);
const showDelete = ref(false);
const showRestart = ref(false);
const deleteLoading = ref(false);
const restartLoading = ref(false);
const downloadShow = ref(false);
const showLastUpdates = ref(false);
const editModal = ref(false);
const participantList = ref([]);

const breadcrumbLink = computed(() =>
  [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.contract",
      route: "/responsible-person",
      link: true,
    },
    {
      name: user.value?.participant?.full_name,
      route: "/responsible-person",
      link: true,
    },
  ].filter((p) => p.name)
);
// search
const participantParams = computed(() => {
  return {
    search: "",
    limit: 20,
    offset: 0,
  };
});

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});

const fetchParticipant = (searchText: string) => {
  participantParams.value.search = searchText;
  ApiService.query("api/v2/participants/participantList", {
    params: { ...participantParams.value },
  }).then((res: any) => {
    participantList.value.results = res.data.results;
  });
};

const form = useForm(
  {
    participant: "",
    status: null,
    start_date: "",
    end_date: "",
    files: [],
    file_id: [],
  },
  {
    participant: { required },
    status: { required },
    start_date: { required },
    end_date: { required },
    file_id: { required },
  }
);

const user = ref({
  participant: "",
  start_date: "",
  end_date: "",
  files_id: "",
  status: "",
});

// FETCH CONTRACT
const fetchContract = async () => {
  loading.value = true;
  await ApiService.get(`/api/v2/main/ContractDetail/${route.params.id}`)
    .then(({ data }) => {
      user.value = data;
      form.values.participant = data?.participant;
      form.values.status = data?.status;
      form.values.start_date = data?.start_date;
      form.values.end_date = data?.end_date;
      form.values.files = data?.files;
      form.values.file_id = data?.files?.map((el: { id: number }) => el.id);
    })
    .finally(() => {
      loading.value = false;
    });
};
watch(
  () => route.params.id,
  () => fetchContract()
);

// EDIT
const closeEditModal = () => {
  editModal.value = false;
};

const submitEdit = async () => {
  const participant =
    typeof form.values.participant === "number"
      ? form.values.participant
      : form.values.participant?.id;

  await ApiService.put(`/api/v2/main/ContractUpdate/${route.params.id}`, {
    participant: participant,
    start_date: dayjs(form.values.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(form.values.end_date).format("YYYY-MM-DD"),
    files: form.values.file_id,
    status: form.values.status,
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
    });
  closeEditModal();
  fetchContract();
};

// REMOVE
const removeUser = () => {
  router.go(-1);

  ApiService.patch(`api/v2/main/ContractUpdate/${route.params.id}`, {
    deleted: true,
  }).then(() => {
    toast.success(t("archived_successfully"), {
      icon: {
        iconClass: "done-icon",
        iconTag: "div",
      },
    });
  });
};

// RESTART

const restartUser = () => {
  router.go(-1);

  ApiService.patch(`api/v2/main/ContractUpdate/${route.params.id}`, {
    deleted: false,
  }).then(() => {
    toast.success(t("recovered_successfully"), {
      icon: {
        iconClass: "done-icon",
        iconTag: "div",
      },
    });
  });
};

onBeforeMount(async () => {
  await fetchContract();

  await ApiService.get("/api/v2/participants/participantList").then((res) => {
    participantList.value = res.data;
  });
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

.task-card {
  background: #fff;
  border: 1px solid #e5eaee;
  border-radius: 12px;

  .head {
    padding: 28px 28px 0 28px;
  }

  .task__title {
    text-transform: capitalize;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #1c1f20;
  }

  .task__list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 16px 0 0 0;
    padding: 0;
  }

  .text--secondary {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #b5b5c3;
  }
}

.file {
  display: flex;
  flex-direction: row;
  width: 317px;
  background-color: #f5f7f7;
  gap: 20px;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 24px;

  &-wrapper {
    display: flex;
    align-items: end;
    justify-content: end;
  }
  &-card {
    display: flex;
    width: 317px;
    padding: 12px;
    border-radius: 6px;
    align-items: center;
    border-style: none;
    background-color: #f5f7f7;
  }
  .file__title {
    font-weight: 500;
    font-size: 22px;
    line-height: 140%;
    color: #3f4254;
  }
}

.type__download {
  background: rgba(48, 161, 219, 0.1);
  color: #30a1db;

  .icon svg path {
    stroke: white;
  }

  &:hover {
    transition: 0.3s ease all;
    background: rgba(48, 161, 219, 0.35);
  }
}
</style>
