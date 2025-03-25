<template>
  <Teleport v-if="mounted" to="#header-toolbar">
    <FHeadSections :routes="routes">
      <template #after-section>
        <SButton variant="secondary" class="ms-6">
          <template #pre-icon>
            <img src="/assets/svg/buttons/cancel.svg" alt="cancel" />
          </template>
          <router-link :to="{ name: 'Financial' }" class="btn-text">
            {{ $t("cancel") }}
          </router-link>
        </SButton>
      </template>
      <template #before-section>
        <SButton @click="onSubmit" class="ms-6">
          <template #pre-icon>
            <img src="/assets/svg/buttons/done.svg" alt="done" />
          </template>
          <p class="btn-text">
            {{ $t("save") }}
          </p>
        </SButton>
      </template>
    </FHeadSections>
  </Teleport>
  <FCreateMain
    :form="Form"
    class="mt-5"
    ref="exposeRef"
    :user-list="userList.results"
    @fetch-data="fetchMore"
    @fetch-search-data="fetchUserList"
    :currentLanguage="currentLanguage"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import ApiService from "@/core/services/ApiService";
import FCreateMain from "@/pages/Financial/components/FCreateMain.vue";
import FHeadSections from "@/pages/Financial/components/FHeadSections.vue";
import router from "@/router";
import SButton from "@/stories/Common/Button/SButton.vue";

// const userList = ref([]);

const toast = useToast();
const { t } = useI18n();
const { mounted } = useMounted();

const successfully = ref(false);

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "financial_assistance",
      route: "/dashboard/financial",
      link: false,
    },
    {
      name: "menus.add_new",
      route: "/",
      link: false,
    },
  ];
});
const exposeRef = ref();

const Form = useForm(
  {
    participant: null,
    akt_number: "",
    sum: "",
    akt_date: null,
    given_accessories_ru: null,
    given_accessories_uz: null,
    description_uz: null,
    description_ru: null,
  },
  {
    participant: {
      required,
    },
    akt_number: {
      required,
    },
    sum: {
      required,
    },
    akt_date: {
      required,
    },
    description_uz: {
      required,
    },
    given_accessories_uz: {
      required,
    },
    given_accessories_ru: {
      required,
    },
    description_ru: {
      required,
    },
  }
);
const currentLanguage = ref("uz");
// const userList = computed(() => store.state.ParticipantsModule.participantList);
const userList = ref([]);
const onSubmit = () => {
  exposeRef.value.submit();
  Form.$v.value.$touch();
  if (!Form.$v.value.$invalid) {
    successfully.value = true;
    Form.values.akt_date = parseDate(Form.values.akt_date);
    Form.values.sum = Number(Form.values.sum.replaceAll(" ", ""));
    ApiService.post("api/v2/main/FinSupportCreate", Form.values)
      .then(() => {
        Form.values.akt_date = null;
        Form.values.participant = null;
        Form.values.akt_number = null;
        Form.values.sum = null;
        Form.values.given_accessories_uz = "";
        Form.values.given_accessories_ru = "";
        Form.values.description_uz = "";
        Form.values.description_ru = "";
        Form.$v.value.$reset();
        router.push("/dashboard/financial");
        toast.success(t("successfully_added"), {
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
  }
};
function parseDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

const search = ref<string | undefined>("");
const paginationData = computed(() => {
  return {
    limit: 10,
    offset: 0,
    search: search.value,
  };
});

const storeHelper = useStore();

const currentUserRole = computed(
  () => storeHelper.state.AuthModule?.user?.type
);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});

// -------------
function fetchUserList(searchText?: string) {
  search.value = searchText;
  ApiService.query("api/v2/participants/participantList/", {
    params: {
      status: "active",
      ...paginationData.value,
      my_participants: isResponsiblePerson.value ? "true" : undefined,
    },
  }).then(({ data }) => {
    userList.value.count = data?.count;
    userList.value.results = data.results;
    ApiService.get(
      `api/v2/participants/participantDetail/${Form.values?.participant}/`
    ).then((res) => {
      userList.value.results.push(res.data);
    });
  });
}
onBeforeMount(() => {
  fetchUserList();
});

const fetchMore = () => {
  if (userList.value?.count > paginationData.value.offset) {
    paginationData.value.offset += 20;
    ApiService.query("api/v2/participants/participantList", {
      params: {
        ...paginationData.value,
        my_participants: isResponsiblePerson.value ? "true" : undefined,
      },
    }).then((res: any) => {
      userList.value.results = [...userList.value.results, ...res.data.results];
    });
  }
};

window.addEventListener("beforeunload", (event: any) => {
  if (!successfully.value) {
    event.returnValue = "Write something";
  }
});

window.removeEventListener("beforeunload", (event: any) => {
  if (!successfully.value) {
    event.returnValue = "Write something";
  }
});

onBeforeRouteLeave(() => {
  if (!successfully.value) {
    let ask = confirm(t("changes_not_saved"));

    if (ask) {
      return;
    } else {
      return false;
    }
  }
});
</script>

<style>
.btn-style {
  margin-left: 20px;
}

.btn-text {
  margin-left: 4px;
}
</style>
