<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.transactions") }}
  </Teleport>
  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <SModeratorTable
    v-bind="{
      offset,
      loading,
    }"
    :total-count="paginationData.total"
    :items-per-page="paginationData.defaultLimit"
    :data="tableData"
    :current-page="paginationData.currentPage"
    @on-change-filter="onChangeFilter"
    @search="onSearch"
    @add="showAdd = true"
    @edit="showEditModal"
    @delete="showDeleteModal"
    @on-delete="onDelete"
    @restart="showRestartModal"
    @page-change="onPageChange"
    @change="showPasswordModal"
    @on-items-per-page-change="onChangeLimit"
  />

  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="stop_moderator_status"
    text="stop_moderator_status_text"
    button-text="stop"
    @close="showDelete = false"
    @submit="deactivateModerator"
  />

  <SDeleteTaskModal
    :show="showRestart"
    :loading="deleteLoading"
    title="restart_moderator_status"
    text="restart_moderator_status_text"
    button-text="restart"
    buttonVariant="primary"
    @close="showRestart = false"
    @submit="activateModerator"
  />

  <SDeleteTaskModal
    :show="deleteModal"
    :loading="deleteLoading"
    title="delete_moderator_status"
    text="delete_modeartor_text"
    button-text="delete"
    @close="deleteModal = false"
    @submit="onDeleteItem"
  />

  <SModeratorAddModal
    v-bind="{ isEdit, users }"
    :is-me="activeModerator?.id === users.id"
    :show="showAdd"
    :default-data="activeModerator"
    @close="closeAddModal"
    @update="onPageChange(1)"
  />

  <SModeratorChangePassword
    :moderator-id="activeModerator?.id"
    :show="showPassword"
    @close="showPassword = false"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { computed, Ref, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { handleError } from "@/helpers";
import SModeratorAddModal from "@/pages/Moderators/components/Modals/SModeratorAddModal.vue";
import SModeratorChangePassword from "@/pages/Moderators/components/Modals/SModeratorChangePassword.vue";
import SModeratorTable from "@/pages/Moderators/components/Table/SModeratorTable.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import { IModerator, IModeratorAdd } from "@/types/moderators";

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const showDelete = ref(false);
const deleteModal = ref(false);
const showRestart = ref(false);
const showAdd = ref(false);
const showPassword = ref(false);
const route = useRoute();
const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.transactions",
      route: "/dashboard/moderators",
      link: false,
    },
  ];
});

const users = computed(() => {
  return useStore().getters.currentUser;
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
} = useTableFetch<IModerator>("api/v2/main/ModeratorList");

const formPassword = useForm(
  {
    password: "",
    repeatPassword: "",
  },
  {
    password: {
      required,
    },
    repeatPassword: {
      required,
      sameAs(value: any) {
        return value === formPassword.values.password;
      },
    },
  }
);

function closeAddModal() {
  showAdd.value = false;
  isEdit.value = false;
}

const isEdit = ref(false);

function showEditModal(data: IModeratorAdd) {
  activeModerator.value = data;
  isEdit.value = true;
  showAdd.value = true;
}

const activeModerator = ref();
const deleteLoading = ref(false);

function showDeleteModal(moderator: IModerator) {
  activeModerator.value = moderator;
  showDelete.value = true;
}
function onDelete(moderator: IModerator) {
  activeModerator.value = moderator;
  deleteModal.value = true;
}
const showRestartModal = (moderator: IModerator) => {
  activeModerator.value = moderator;
  showRestart.value = true;
};

function onDeleteItem() {
  ApiService.patch(`/api/v2/main/ModeratorUpdate/${activeModerator.value.id}`, {
    is_deleted: true,
  })
    .then(() => {
      toast.success(t("delete_moderator"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      deleteModal.value = false;
      fetchTableData();
    })
    .catch(({ response }) => handleError(response?.data))
    .finally(() => (deleteLoading.value = false));
}
function deactivateModerator() {
  ApiService.patch(`/api/v2/main/ModeratorUpdate/${activeModerator.value.id}`, {
    is_active: false,
  })
    .then(() => {
      toast.success(t("do_inactive"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      showDelete.value = false;
      fetchTableData();
    })
    .catch(({ response }) => handleError(response?.data))
    .finally(() => (deleteLoading.value = false));
}

function activateModerator() {
  ApiService.patch(`/api/v2/main/ModeratorUpdate/${activeModerator.value.id}`, {
    is_active: true,
  })
    .then(() => {
      toast.success(t("successfully_reseted"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      showRestart.value = false;
      fetchTableData();
    })
    .catch(({ response }) => handleError(response?.data))
    .finally(() => (deleteLoading.value = false));
}

function showPasswordModal(moderator: IModerator) {
  activeModerator.value = moderator;
  showPassword.value = true;
}

const filter: Ref<{ is_active?: boolean; is_editor?: boolean }> = ref({});
const routeQuery = computed(() => {
  const query = { ...route.query };
  for (let key in query) {
    if (query[key] === "") {
      delete query[key];
    }
    if (key === "page") {
      delete query[key];
    }
  }
  return query;
});

watch(
  () => routeQuery.value,
  () => {
    fetchTableData(routeQuery.value);
  }
);

function onChangeFilter(newValue: { is_active: boolean; is_editor: boolean }) {
  filter.value = newValue;
  onPageChange(1, filter.value);
}
</script>
