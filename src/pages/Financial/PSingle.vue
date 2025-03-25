<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("history_of_support") }}
  </Teleport>

  <Teleport v-if="mounted" to="#header-toolbar">
    <FHeadSections v-bind="{ routes }">
      <template #after-section>
        <SButton
          v-if="useRoleManagement('', [])"
          variant="danger"
          @click="showDelete = true"
          class="ms-6"
        >
          <template #pre-icon>
            <img src="/assets/svg/buttons/trash.svg" alt="cancel" />
          </template>
          <p class="btn-text">
            {{ $t("delete") }}
          </p>
        </SButton>
      </template>

      <template #before-section>
        <router-link
          :to="{
            path: '/dashboard/financialEdit',
            query: { id: data?.id },
          }"
          class="ms-6"
        >
          <SButton v-if="useRoleManagement('edit')">
            <template #pre-icon>
              <img src="/assets/svg/buttons/edit.svg" alt="done" />
            </template>
            <p class="btn-text">
              {{ $t("edit") }}
            </p>
          </SButton>
        </router-link>
      </template>
    </FHeadSections>
  </Teleport>

  <FSingleInfo :data="data" />
  <FSingleInfoMain class="mt-6" :data="data" />
  <SDeleteTaskModal
    title="financial_assistance_delete"
    :show="showDelete"
    @close="showDelete = false"
    @submit="deleteCondition"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import ApiService from "@/core/services/ApiService";
import FHeadSections from "@/pages/Financial/components/FHeadSections.vue";
import FSingleInfo from "@/pages/Financial/components/FSingleInfo.vue";
import FSingleInfoMain from "@/pages/Financial/components/FSingleInfoMain.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const { mounted } = useMounted();

const data = ref();
const showDelete = ref(false);

const routes: any = ref([]);

function deleteCondition() {
  ApiService.delete(`api/v2/main/FinSupportDelete/${route.params.id}`)
    .then(() => {
      showDelete.value = false;
      toast.success(t("successfully_removed_partner"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      router.push("/dashboard/financial");
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

onMounted(() => {
  ApiService.get(`api/v2/main/FinSupportDetail/${route.params.id}`).then(
    (res) => {
      data.value = res.data;
      routes.value = [
        {
          name: "main",
          route: "/",
          link: false,
        },
        {
          name: "history_of_support",
          route: "/dashboard/financial",
          link: false,
        },
        {
          name: data.value?.participant?.full_name,
          route: "/",
          link: false,
        },
      ];
    }
  );
});
</script>

<style scoped>
.btn-text {
  margin-left: 4px;
}
</style>
