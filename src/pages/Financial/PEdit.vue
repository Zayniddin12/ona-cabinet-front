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
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import ApiService from "@/core/services/ApiService";
import FCreateMain from "@/pages/Financial/components/FCreateMain.vue";
import FHeadSections from "@/pages/Financial/components/FHeadSections.vue";
import store from "@/store";
import { Actions } from "@/store/enums/StoreEnums";
import SButton from "@/stories/Common/Button/SButton.vue";

const search = ref<string | undefined>("");
const editList = ref([]);

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
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
      route: "dashboard/financial",
      link: false,
    },
    {
      name: "edit",
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
    given_accessories: null,
    description: null,
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
  }
);
const onSubmit = () => {
  Form.$v.value.$touch();
  if (!Form.$v.value.$invalid) {
    successfully.value = true;
    Form.values.akt_date = parseDate(Form.values.akt_date);
    Form.values.sum = Number(String(Form.values.sum)?.replaceAll(" ", ""));
    ApiService.put(`api/v2/main/FinSupportUpdate/${route.query?.id}`, {
      ...Form.values,
      participant:
        typeof Form.values.participant === "number"
          ? Form.values.participant
          : Form.values.participant.id,
    })
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
        toast.success(t("successfully_updated"), {
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
  } else {
    toast.error(t("error_send"), {
      icon: {
        iconClass: "error-icon",
        iconTag: "div",
      },
    });
  }
};

function parseDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

// const userList = computed(() => store.state.ParticipantsModule.participantList);
const userList = ref([]);

onMounted(() => {
  ApiService.get(`api/v2/main/FinSupportDetail/${route.query?.id}`).then(
    (res) => {
      editList.value = res.data;
      Form.values.akt_number = res.data.akt_number;
      Form.values.participant = res.data.participant.full_name;
      Form.values.sum = res.data.sum;
      Form.values.akt_date = res.data.akt_date;
      Form.values.given_accessories_uz = res.data.given_accessories_uz;
      Form.values.given_accessories_ru = res.data.given_accessories_ru;
      Form.values.description_uz = res.data.description_uz;
      Form.values.description_ru = res.data.description_ru;
    }
  );
});

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
    userList.value.results = data.results;
    ApiService.get(
      `api/v2/participants/participantDetail/${Form.values?.participant}/`
    ).then((res) => {
      userList.value.results.push(res.data);
    });
    userList.value.count = data?.count;
  });
}

onBeforeMount(() => {
  fetchUserList();
});

const fetchMore = () => {
  if (userList.value?.count > paginationData.value.offset) {
    paginationData.value.offset += 20;
    ApiService.query("api/v2/participants/participantList", {
      params: { ...paginationData.value },
    }).then((res: any) => {
      userList.value.results = [...userList.value.results, ...res.data.results];
    });
  }
};

onBeforeMount(() => {
  store.dispatch(Actions.FETCH_PARTICIPANT_LIST, {
    status: "active",
    ...paginationData.value,
  });
});

// watch(
//   () => page.value,
//   (val) => {
//     paginationData.value.offset = (val - 1) * paginationData.value.limit;
//     store.dispatch(Actions.FETCH_PARTICIPANT_LIST, {
//       status: "active",
//       ...paginationData.value,
//       merge: true,
//     });
//   }
// );

window.addEventListener("beforeunload", (event: any) => {
  event.returnValue = "Write something";
});

window.removeEventListener("beforeunload", (event: any) => {
  event.returnValue = "Write something";
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
