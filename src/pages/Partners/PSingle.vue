<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("partners") }}
  </Teleport>

  <Teleport v-if="mounted" to="#header-toolbar">
    <CHeadSection :routes="breadcrumbLink">
      <SButton
        v-if="useRoleManagement('', [])"
        variant="danger"
        @click="showDelete = true"
      >
        <template #pre-icon>
          <img src="/assets/svg/buttons/trash.svg" alt="cancel" />
        </template>
        <p class="btn-text">
          {{ $t("delete") }}
        </p>
      </SButton>
      <SButton
        v-if="useRoleManagement('edit')"
        variant="primary"
        @click="activeEdit"
      >
        <template #pre-icon>
          <inline-svg src="/assets/ona/svg/pen.svg" class="me-1" />
        </template>
        <p class="btn-text">
          {{ $t("edit") }}
        </p>
      </SButton>
    </CHeadSection>
  </Teleport>

  <div>
    <SSingleHeaderCard
      @download="downloadShow = true"
      @last="showLastUpdates = true"
      :title="locale === 'uz' ? user?.name_uz : user?.name_ru"
      v-bind="{ loading }"
    >
      <template #badges>
        <div class="d-flex align-items-center gap-1 mt-1">
          <PreloaderSkeleton
            width="90px"
            v-bind="{ loading }"
            height="20px"
            preloader-class="mb-1"
          >
            <p class="text-secondary-dark fs-7 fw-bold">
              <inline-svg src="/assets/ona/svg/user-solid.svg" />

              ID: {{ user?.partner_id }}
            </p>
          </PreloaderSkeleton>
        </div>
      </template>
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
                {{ $t(user.type) }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="80px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("partner_type") }}
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
              <a
                :href="`tel: ${user?.phone}`"
                class="hover-phone partner-single-details__title"
              >
                {{ formatPhoneNumber(`+998${user?.phone}`) }}
              </a>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="100px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("phone_number") }}
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
                {{ formatMoneyDecimal(user?.amount, 0) }} UZS
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="100px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("amount_of_aid") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
        <li>
          <div>
            <PreloaderSkeleton
              width="150px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <p class="partner-single-details__title">
                {{ user?.region?.title }}
              </p>
            </PreloaderSkeleton>
            <PreloaderSkeleton width="150px" v-bind="{ loading }" height="20px">
              <p class="partner-single-details__subtitle">
                {{ $t("region") }}
              </p>
            </PreloaderSkeleton>
          </div>
        </li>
      </template>
    </SSingleHeaderCard>
  </div>
  <CActionModal
    :show="modalActive"
    @close="closeModal"
    @submit="submitEdit"
    :form="form"
    type="edit"
    :regions="regions"
  />
  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="delete_partner"
    text="delete_task_text"
    button-text="delete"
    @close="showDelete = false"
    @submit="removePartner"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import ApiService from "@/core/services/ApiService";
import { formatMoneyDecimal, formatPhoneNumber, isPhone } from "@/helpers";
import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";
import CActionModal from "@/pages/Partners/Components/CActionModal.vue";
import SSingleHeaderCard from "@/pages/Partners/Components/SSingleHeaderCard.vue";
import { TPartner } from "@/pages/Partners/data";
import CHeadSection from "@/pages/PUser/components/CHeadSection.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

const { mounted } = useMounted();
const router = useRouter();
const route = useRoute();
const { locale, t } = useI18n();
const toast = useToast();

const showLastUpdates = ref(false);
const regions = ref();
const user = ref();
const modalActive = ref(false);
const downloadShow = ref(false);
const showDelete = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const loading = ref<boolean>(false);

const breadcrumbLink = computed(() =>
  [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.cashiers",
      route: "/",
      link: false,
    },
    {
      name: user.value?.name_uz,
      route: "/",
      link: false,
    },
  ].filter((p) => p.name)
);

const form = useForm<TPartner>(
  {
    name_uz: "",
    name_ru: "",
    type: null,
    partner_id: null,
    phone: "",
    amount: null,
    region: null,
  },
  {
    name_uz: { required },
    name_ru: { required },
    type: { required },
    partner_id: { required },
    phone: { required, isPhone },
    amount: { required },
    region: { required },
  }
);

const removePartner = () => {
  deleteLoading.value = true;

  ApiService.delete(`api/v2/main/PartnerDelete/${route.params.id}`)
    .then(() => {
      toast.success(t("successfully_removed_partner"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => {
      deleteLoading.value = false;
      showDelete.value = false;
      router.go(-1);
    });
};

const fetchPartner = async () => {
  loading.value = true;

  await ApiService.get(`/api/v2/main/PartnerDetail/${route.params.id}`)
    .then(({ data }) => {
      user.value = data;
      form.values.name_uz = data?.name_uz;
      form.values.name_ru = data?.name_ru;
      form.values.type = data?.type;
      form.values.partner_id = data?.partner_id;
      form.values.phone = data?.phone;
      form.values.amount = data?.amount;
      form.values.region = data?.region?.id;
    })
    .finally(() => {
      loading.value = false;
    });
};

const activeEdit = () => {
  modalActive.value = true;
};

const closeModal = () => {
  fetchPartner();
  modalActive.value = false;
};

const submitEdit = async () => {
  await ApiService.put(`api/v2/main/PartnerUpdate/${route.params.id}`, {
    name_uz: form.values.name_uz,
    name_ru: form.values.name_ru,
    partner_id: form.values.partner_id,
    type: form.values.type,
    amount: String(form.values.amount).replaceAll(" ", ""),
    region: form.values.region,
    phone: form.values.phone.replaceAll(" ", ""),
  })
    .then(() => {
      modalActive.value = false;
      fetchPartner();
      toast.success(t("successfully_edited"), {
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

fetchPartner();
ApiService.get("api/v1/regions/search").then(({ data }) => {
  regions.value = data?.results;
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
  padding: 9px 0;
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
</style>

<style>
.el-switch__label.is-active {
  color: #1c1f20 !important;
}

.hover-phone:hover p {
  color: #00a3ff !important;
}

.el-popper {
  white-space: pre-line !important;
  text-align: center !important;
}
</style>
