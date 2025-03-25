<template>
  <div>
    <UserComments
      title="curator_comments"
      :subtitle="$t('comments', { count: paginationData?.total })"
      :header-data="userCommentsHeaderData"
      statusKey="is_active"
      v-bind="{ total: paginationData?.total, offset, tableData, loading }"
      @add="showAdd = true"
      @delete="openDelete"
      @view="openView"
      @edit="openEdit"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
      @on-search="onSearch"
    />
    <SCommentAdd
      :show="showAdd"
      @close="showAdd = false"
      @submit="createComment"
    />
    <SDeleteTaskModal
      title="delete_comment"
      :show="showDelete"
      @close="showDelete = false"
      @submit="deleteComment"
      :loading="buttonLoading"
    />
    <SCommentAdd
      :show="showEdit"
      @close="showEdit = false"
      @submit="editComment"
      :data="selectedComment"
      :loading="buttonLoading"
      edit
    />
    <el-dialog width="30%" v-model="showView" :title="$t('comment')">
      <div class="comment-view">
        <div class="comment-view-card">
          <p class="comment-view-card__title">{{ $t("commenter") }}</p>
          <p class="comment-view-card__subtitle">
            {{ selectedComment?.creator?.username }}
          </p>
        </div>
        <div class="comment-view-card">
          <p class="comment-view-card__title">{{ $t("comment") }}</p>
          <p class="comment-view-card__subtitle">
            {{ selectedComment?.comment }}
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import SCommentAdd from "@/pages/PUser/Single/components/Comment/SCommentAdd.vue";
import UserComments from "@/pages/PUser/Single/components/Table/UserComments.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import { userCommentsHeaderData } from "@/pages/PUser/Single/data";

const showAdd = ref(false);
const showDelete = ref(false);
const showView = ref(false);
const showEdit = ref(false);
const selectedComment: any = ref({});
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const buttonLoading = ref(false);
const {
  offset,
  loading,
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  onSearch,
  fetchTableData,
} = useTableFetch(
  `api/v2/participants/participantCommentList/${route?.params?.id}`
);

function openView(data: any) {
  selectedComment.value = data;
  showView.value = true;
}

function openEdit(data: any) {
  selectedComment.value = data;
  showEdit.value = true;
}

function openDelete(data: any) {
  selectedComment.value = data;
  showDelete.value = data;
}

// Create Comment
function createComment(message: string) {
  buttonLoading.value = true;
  const data = {
    participant: +route?.params?.id,
    comment: message,
  };
  ApiService.post("api/v2/participants/participantCommentCreate/", data)
    .then(() => {
      toast.success(t("successfully_added"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      fetchTableData();
      showAdd.value = false;
    })
    .catch((err: any) => {
      showResponseError(err?.response?.data?.errors);
    })
    .finally(() => (buttonLoading.value = false));
}

// Delete Comment
function deleteComment() {
  buttonLoading.value = true;
  ApiService.delete(
    `api/v2/participants/participantCommentDelete/${selectedComment.value.id}`
  )
    .then(() => {
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      fetchTableData();
      showDelete.value = false;
    })
    .catch((err: any) => {
      showResponseError(err?.response?.data?.errors);
    })
    .finally(() => (buttonLoading.value = false));
}

// Edit Comment

function editComment(message: string) {
  buttonLoading.value = true;
  const data: any = {
    participant: +route?.params?.id,
    comment: message,
  };
  ApiService.put(
    `api/v2/participants/participantCommentUpdate/${selectedComment.value.id}/`,
    data
  )
    .then(() => {
      toast.success(t("successfully_edited"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      fetchTableData();
      showEdit.value = false;
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

<style lang="scss" scoped>
.comment-view {
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &-card {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__title {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      color: #191e36;
      opacity: 0.7;
    }

    &__subtitle {
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
      color: #191e36;
    }
  }
}
</style>
