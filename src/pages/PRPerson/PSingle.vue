<template>
  <Teleport v-if="mounted" to="#header-toolbar">
    <CHeadSection :routes="breadcrumbLink">
      <template v-if="useRoleManagement('edit')">
        <SButton
          v-if="user?.active"
          variant="danger"
          @click="showDelete = true"
        >
          <template #pre-icon>
            <img src="/assets/svg/buttons/trash.svg" alt="cancel" />
          </template>
          <p class="btn-text">
            {{ $t("make_inactive") }}
          </p>
        </SButton>
        <SButton
          v-else
          :text="$t('make_active')"
          variant="secondary"
          @click="showActive = true"
          :loading="buttonLoading"
        />
      </template>
      <template v-if="useRoleManagement('edit')">
        <SButton variant="primary" @click="editModal = true">
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
    {{ $t("menus.responsible_people") }}
  </Teleport>
  <div>
    <SSingleHeaderCard
      @download="downloadShow = true"
      @last="showLastUpdates = true"
      :title="user?.user?.first_name"
    >
      <!--      <template #badges>-->
      <!--        <div class="d-flex align-items-center gap-1 mt-1">-->
      <!--          <inline-svg src="/assets/ona/svg/user-solid.svg" />-->
      <!--          <p class="text-secondary-dark fs-7 fw-bold">ID: {{ user?.id }}</p>-->
      <!--        </div>-->
      <!--      </template>-->
      <template #details>
        <li>
          <div>
            <p class="partner-single-details__title">
              {{ $t(`contract_type_arr[${user?.contract_type - 1}]`) }}
            </p>
            <p class="partner-single-details__subtitle">
              {{ $t("menus.contract_type") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <div class="d-flex align-items-center gap-1">
              <p class="partner-single-details__title transition-200">
                {{
                  `~ ${minutesToHours(+user?.daily_activity)} ${$t("hours")}`
                }}
              </p>
            </div>
            <p class="partner-single-details__subtitle">
              {{ $t("average_used") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <div class="d-flex align-items-center gap-1">
              <p class="partner-single-details__title transition-200">
                {{
                  `~ ${minutesToHours(+user?.weekly_activity)} ${$t("hours")}`
                }}
              </p>
            </div>
            <p class="partner-single-details__subtitle">
              {{ $t("average_used_weekly") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <div class="d-flex align-items-center gap-1">
              <p class="partner-single-details__title transition-200">
                {{
                  `~ ${minutesToHours(+user?.monthly_activity)} ${$t("hours")}`
                }}
              </p>
            </div>
            <p class="partner-single-details__subtitle">
              {{ $t("average_used_monthly") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <p class="partner-single-details__title">
              {{ formatDate(user?.start_date) }}
            </p>
            <p class="partner-single-details__subtitle">
              {{ $t("started_date") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <p class="partner-single-details__title">
              {{ formatDate(user?.end_date) }}
            </p>
            <p class="partner-single-details__subtitle">
              {{ $t("ended_date") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <a :href="`tel: ${person.phone_number}`" class="hover-phone">
              <p class="partner-single-details__title transition-200">
                {{ formatPhoneNumber(`+998${user.phone}`) }}
              </p>
            </a>
            <p class="partner-single-details__subtitle">
              {{ $t("phone_number") }}
            </p>
          </div>
        </li>
      </template>
    </SSingleHeaderCard>
    <div class="task-card d-flex flex-column w-100 mb-8">
      <div class="d-flex flex-column align-items-start head">
        <ul class="task__list">
          <li v-for="(link, ind) in navLinks" :key="ind">
            <RouterLink
              :to="{ name: link.name }"
              class="nav-link"
              active-class="task-active"
            >
              {{ $t(link.title) }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <RouterView />
    </div>
  </div>
  <ActionModal
    :show="editModal"
    @close="closeEditModal('edit')"
    :form="form"
    edit
    :contractType="contractType"
    :moderators="moderators"
    @submit="editPerson"
  />

  <SDeleteTaskModal
    :show="showDelete"
    :title="$t('inactive_r_person')"
    :text="$t('inactive_r_person_text')"
    :button-text="$t('make_inactive')"
    @submit="inActivePerson"
    :loading="buttonLoading"
    @close="showDelete = false"
  />
  <SDeleteTaskModal
    :show="showActive"
    :title="$t('active_r_person')"
    :text="$t('active_r_person_text')"
    :button-text="$t('make_active')"
    button-variant="primary"
    @submit="ActivePerson"
    :loading="buttonLoading"
    @close="showActive = false"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import ApiService from "@/core/services/ApiService";
import { formatDate, formatPhoneNumber, isPhone } from "@/helpers";
import ActionModal from "@/pages/PRPerson/Components/ActionModal.vue";
import SSingleHeaderCard from "@/pages/PRPerson/Components/SSingleHeaderCard.vue";
import { navLinks, person } from "@/pages/PRPerson/data";
import CHeadSection from "@/pages/PUser/components/CHeadSection.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

const showActive = ref(false);
const buttonLoading = ref(false);
const showDelete = ref(false);
const route = useRoute();
const router = useRouter();
const { mounted } = useMounted();
const moderators = ref<any>([]);
const downloadShow = ref<boolean>(false);
const showLastUpdates = ref<boolean>(false);
const editModal = ref<boolean>(false);
const { t } = useI18n();
const toast = useToast();
const user: any = ref({});

const breadcrumbLink = ref();
function minutesToHours(minutes: number) {
  return Math.round(minutes / 60);
}

const form = useForm(
  {
    user: null,
    contract_type: null,
    phone: "",
    start_date: "",
    end_date: "",
  },
  {
    user: { required },
    contract_type: { required },
    start_date: { required },
    end_date: { required },
    phone: { required, isPhone },
  }
);

const closeEditModal = () => {
  editModal.value = false;

  form.$v.value.$reset();
};

const contractType = [
  { name: "outsourced", id: 1 },
  { name: "in_the_state", id: 2 },
];

async function getModerators(user: any) {
  try {
    const response = await ApiService.get("/api/v2/main/ModeratorList");
    const moderatorsData = response?.data?.results || [];
    moderators.value = [user, ...moderatorsData];
  } catch (error) {
    console.error("Error fetching moderators:", error);
  }
}

async function getSingle() {
  await ApiService.get(
    `/api/v2/main/ResponsiblePersonDetail/${route.params.id}`
  ).then((res) => {
    user.value = res.data;
    getModerators(user.value.user);

    breadcrumbLink.value = [
      {
        name: "main",
        route: "/",
        link: false,
      },
      {
        name: "menus.responsible_people",
        route: "/responsible-person",
        link: true,
      },
      {
        name: res?.data?.user?.first_name,
        route: "/responsible-person",
        link: true,
      },
    ];
  });
}

onBeforeMount(async () => {
  getSingle();
});

watch(
  () => user.value,
  (newValue: any) => {
    form.values.user = newValue.user?.id;
    form.values.contract_type = newValue.contract_type;
    form.values.start_date = newValue.start_date;
    form.values.end_date = newValue.end_date;
    form.values.phone = newValue.phone;
  }
);

function editPerson() {
  ApiService.put(`/api/v2/main/ResponsiblePersonUpdate/${route.params.id}`, {
    user: form.values.user,
    contract_type: form.values.contract_type,
    phone: form.values.phone.replaceAll(" ", ""),
    start_date: dayjs(form.values.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(form.values.end_date).format("YYYY-MM-DD"),
  })
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      getSingle();
      closeEditModal();
    })
    .catch((err) => {
      toast.error(t(err?.response?.data?.errors[0].error), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
}

function inActivePerson() {
  buttonLoading.value = true;
  ApiService.put(`/api/v2/main/ResponsiblePersonUpdate/${route.params.id}`, {
    active: false,
  })
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      showDelete.value = false;
      router.push("/responsible-person");
    })
    .catch((err) => {
      toast.error(t(err?.response?.data?.errors[0].error), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (buttonLoading.value = false));
}

function ActivePerson() {
  buttonLoading.value = true;
  ApiService.put(`/api/v2/main/ResponsiblePersonUpdate/${route.params.id}`, {
    active: true,
  })
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      showActive.value = false;
      router.push("/responsible-person");
    })
    .catch((err) => {
      toast.error(t(err?.response?.data?.errors[0].error), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (buttonLoading.value = false));
}

function convertMinutesToHoursAndMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} ${t("minutes")}`;
  } else {
    return `${hours} ${t("hours")} ${remainingMinutes} ${t("minutes")}`;
  }
}
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

  .head {
    padding: 28px 28px 0 28px;
    position: relative;
    z-index: 10;
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

  .nav-link {
    position: relative;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #a2abbe;
    padding: 8px 12px 14px 12px;
    margin-right: 12px;
    background: transparent;
    transition: 0.3s ease all;

    &:before {
      content: "";
      width: 100%;
      height: 100%;
      display: block;
      background: linear-gradient(
        180deg,
        rgba(48, 161, 219, 0) 0%,
        rgba(48, 161, 219, 0.1) 100%
      );
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: 0.3s ease all;
    }

    &:after {
      content: "";
      width: 100%;
      height: 2px;
      background-color: #30a1db;
      display: block;
      border-radius: 3px;
      position: absolute;
      inset: auto 0 0 0;
      opacity: 0;
      transition: 0.3s ease all;
    }
  }

  .nav-link.task-active {
    color: #30a1db;

    &:after {
      opacity: 1;
    }

    &:before {
      opacity: 1;
    }

    transition: 1s ease all;
  }

  .text--secondary {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #b5b5c3;
  }
}
</style>
