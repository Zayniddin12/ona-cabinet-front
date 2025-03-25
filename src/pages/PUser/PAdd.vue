<template>
  <div>
    <Teleport v-if="mounted" to="#header-toolbar">
      <SUserToolbar :form="mainData" @add="onSubmit" :loading="buttonLoading" />
    </Teleport>
    <SUserSteps class="mb-7" v-bind="{ steps, step }" @next="step = $event" />

    <Transition name="step-change" mode="out-in">
      <div :key="step">
        <SUserAddStepOne
          v-if="step === 1"
          :form="formStepOne"
          v-bind="{
            programs,
            regions,
            responsiblePersons,
            mainConditions,
            passportConditions,
            addressConditions,
          }"
          @on-search="fetchModeratorList"
        />
        <SUserAddStepTwo
          v-if="step === 2"
          :form="formStepTwo"
          v-bind="{
            relativeTypes,
            illnessType,
            incomeTypeV1,
            familyMembers,
            familyConditions,
          }"
        />
        <SUserAddStepThree
          v-if="step === 3"
          :form="formStepThree"
          v-bind="{ illnessType, medicalTypes }"
        />

        <SUserAddNewStepSupport
          v-if="step === 4"
          :form="formStepSupport"
          :is-have-empty-field="isHaveEmptyField"
        />
        <SUserAddStepFour
          v-if="step === 5"
          :form="formStepFour"
          @remote-search="remoteSearch"
          v-bind="{
            employmentType,
            conditions,
          }"
        />

        <!--        <SUserAddStepFour-->
        <!--          v-if="step === 5"-->
        <!--          :form="formStepFourr"-->
        <!--          @remote-search="remoteSearch"-->
        <!--          :conditionss="conditionss"-->
        <!--          v-bind="{-->
        <!--            employmentType,-->
        <!--            conditions,-->
        <!--          }"-->

        <SUserFormStepFive
          v-if="step === 6"
          :form="formStepFive"
          v-bind="{
            incomeTypeV1,
            banksList: banksList.results,
            bankConditions,
            financeConditions,
          }"
          @fetch-more="(e) => (selectVal = e)"
          @fetch-bank="fetchBank"
        />
        <!--        <SUserAddStepSeven v-if="step === 7" :form="formStepSeven" />-->
        <!--        <h2>seven</h2>-->
      </div>
    </Transition>
    <SAddFooter
      v-bind="{ step }"
      class="my-7"
      @submit="handleNext"
      @back="step--"
      :loading="buttonLoading"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import { useMounted } from "@/composables/useMounted";
import ApiService from "@/core/services/ApiService";
import {
  formStepFive,
  formStepFour,
  formStepOne,
  formStepSeven,
  formStepSupport,
  formStepThree,
  formStepTwo,
  mainData,
} from "@/pages/PUser/components/Add/data/forms";
import SAddFooter from "@/pages/PUser/components/Add/SAddFooter.vue";
import SUserAddNewStepSupport from "@/pages/PUser/components/Add/Steps/SUserAddNewStepSupport.vue";
import SUserAddStepFour from "@/pages/PUser/components/Add/Steps/SUserAddStepFour.vue";
import SUserAddStepOne from "@/pages/PUser/components/Add/Steps/SUserAddStepOne.vue";
import SUserAddStepSeven from "@/pages/PUser/components/Add/Steps/SUserAddStepSeven.vue";
import SUserAddStepThree from "@/pages/PUser/components/Add/Steps/SUserAddStepThree.vue";
import SUserAddStepTwo from "@/pages/PUser/components/Add/Steps/SUserAddStepTwo.vue";
import SUserFormStepFive from "@/pages/PUser/components/Add/Steps/SUserFormStepFive.vue";
import SUserSteps from "@/pages/PUser/components/Add/SUserSteps.vue";
import SUserToolbar from "@/pages/PUser/components/Add/SUserToolbar.vue";

const router = useRouter();
const buttonLoading = ref(false);
const store = useStore();
// variables
const { t } = useI18n();
const programs = ref();
const trigger = ref(true);
const relativeTypes = ref();
const regions = ref();
const responsiblePersons = ref([]);
const illnessType = ref([
  {
    id: "available",
    title: t("available"),
  },
  {
    id: "not_available",
    title: t("not_available"),
  },
]);
const banksList = ref();
const incomeTypeV1 = ref();
const medicalTypes = ref([]);
const mainConditions = ref([]);
const familyMembers = ref();
const conditions: any = ref([]);
const passportConditions = ref([]);
const addressConditions = ref([]);
const bankConditions = ref([]);
const financeConditions = ref([]);
const familyConditions = ref([]);

const isResponsiblePerson = computed(
  () => store.state.AuthModule.user.is_responsible_person
);
const user = computed(() => store.state.AuthModule.user);

const selectVal = ref("");
const bankParams = computed(() => {
  return {
    search: selectVal.value,
    limit: 20,
    offset: 0,
  };
});

const fetchBankSearch = () => {
  ApiService.query("api/v1/banks/search", {
    params: { ...bankParams.value },
  }).then((res: any) => {
    banksList.value = res?.data;
  });
};

watch(
  () => bankParams.value,
  () => {
    fetchBankSearch();
  },
  {
    deep: true,
  }
);

// End

const { mounted } = useMounted();
const toast = useToast();
const step = ref(1);
const activeStep = ref();

const steps = ref([
  {
    title: t("main_details"),
    id: 1,
  },
  {
    title: t("info_family"),
    id: 2,
  },
  {
    title: t("medic_conclusions"),
    id: 3,
  },
  {
    title: t("history_of_support"),
    id: 4,
  },
  {
    title: t("conditions"),
    id: 5,
  },
  {
    title: t("financial_assistance"),
    id: 6,
  },
]);
const hasNext = ref(false);
const params = reactive({
  limit: 20,
  offset: 0,
});

function fetchModeratorList(searchText?: string) {
  ApiService.query("api/v2/main/ResponsiblePersonList?active=true", {
    params: {
      ...params,
      search: searchText,
    },
  }).then(({ data }) => {
    if (searchText) {
      responsiblePersons.value = data?.results;
      //   responsiblePersons.value = [
      //     ...responsiblePersons.value,
      //     ...(data?.results ?? []),
      //   ];
    } else {
      responsiblePersons.value = [...(data?.results ?? [])];
    }
    if (isResponsiblePerson.value) {
      formStepOne.values.responsible_person = user.value;
      responsiblePersons.value.push({
        user: {
          id: user.value.id,
          first_name: `${user.value.first_name} ${user?.value.last_name}`,
        },
      });
    }
    // responsiblePersons.value = searchText
    //   ? data?.results
    //   : [...responsiblePersons.value, ...(data?.results ?? [])];
    hasNext.value = !!data.next;
  });
}

// const fetchMore = () => {
//   console.log(responsiblePersons.value);
//   if (responsiblePersons.value?.count > responsiblePersons.value.offset) {
//     responsiblePersons.value.offset += 20;
//     ApiService.query("api/v2/main/ResponsiblePersonList?active=true", {
//       params: { ...responsiblePersons.value },
//     }).then((res: any) => {
//       responsiblePersons.value.results = [
//         ...responsiblePersons.value.results,
//         ...res.data.results,
//       ];
//     });
//   }
// };

// function fetchMoree(searchText?: string) {
//   // console.log("searchText11111: ", searchText);
//   // if (hasNext.value || searchText) {
//   //   fetchModeratorList(searchText);
//   // }
//   if (hasNext.value || !searchText?.length) {
//     params.offset = searchText ? 0 : params.offset + 20;
//     fetchModeratorList("");
//   }
// }
function getAll() {
  // Programs
  ApiService.query("api/v2/main/ProgramList?deleted=false", {}).then(
    (res: any) => {
      programs.value = res?.data?.results;
    }
  );
  //   Relative Types
  ApiService.query("api/v2/main/RelativeTypeList", {
    params: {
      limit: 50,
    },
  }).then((res: any) => {
    relativeTypes.value = res?.data?.results;
  });
  //   Regions
  ApiService.query("api/v1/regions/search", {}).then((res: any) => {
    regions.value = res?.data?.results;
  });
  //   responsiblePersons
  fetchModeratorList("");

  //   Family Type List
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=FAMILY_FAMILY_MEMBER",
    {}
  ).then((res: any) => {
    familyMembers.value = res?.data?.results;
  });

  //   MEDICAL_CONCLUSIONS List
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=MEDICAL_CONCLUSIONS",
    {}
  ).then((res: any) => {
    medicalTypes.value = res?.data?.results;
  });

  //   MAIN_PERSONAL_INFO List
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=MAIN_PERSONAL_INFO",
    {}
  ).then((res: any) => {
    mainConditions.value = res?.data?.results;
  });

  //   MAIN_PASSPORT_AND_ID_CARD_DATAS List
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=MAIN_PASSPORT_AND_ID_CARD_DATAS",
    {}
  ).then((res: any) => {
    passportConditions.value = res?.data?.results;
  });

  //   MAIN_ADDRESSES List
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=MAIN_ADDRESSES",
    {}
  ).then((res: any) => {
    addressConditions.value = res?.data?.results;
  });

  // FINANCIAL_BANK_INFO
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=FINANCIAL_BANK_INFO",
    {}
  ).then((res: any) => {
    bankConditions.value = res?.data?.results;
  });

  // FINANCIAL_FINANCE_AND_WORKING
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=FINANCIAL_FINANCE_AND_WORKING",
    {}
  ).then((res: any) => {
    financeConditions.value = res?.data?.results;
  });

  // MAIN_ADDITIONAL_INFOS
  ApiService.query(
    "api/v2/main/ConditionTypeList?place=MAIN_ADDITIONAL_INFOS",
    {}
  ).then((res: any) => {
    familyConditions.value = res?.data?.results;
  });

  //   Banks type
  fetchBankSearch();

  //   Income Type V1
  ApiService.query("api/v1/income-types/search", {}).then((res: any) => {
    incomeTypeV1.value = res?.data?.results;
  });
  //   Conditions Type List
  ApiService.query("api/v2/main/ConditionTypeList?place=DEFAULT", {}).then(
    (res: any) => {
      conditions.value = res?.data?.results;
    }
  );
}
// FetchBank

const fetchBank = () => {
  if (banksList.value?.count > bankParams.value.offset) {
    bankParams.value.offset += 20;
    ApiService.query("api/v1/banks/search", {
      params: { ...bankParams.value },
    }).then((res: any) => {
      banksList.value.results = [
        ...banksList.value.results,
        ...res.data.results,
      ];
    });
  }
};

const remoteSearch = (e: any) => {
  const option = conditions.value?.find((el: any) => el?.id === e?.id);
};
onMounted(() => {
  getAll();
});

const successfully = ref(false);
const isHaveEmptyField = ref(false);

// Handle Submit

function handleNext() {
  if (step.value === 1) {
    stepOne();
  } else if (step.value === 2) {
    stepTwo();
  } else if (step.value === 3) {
    stepThree();
  } else if (step.value === 4) {
    stepSupport();
  } else if (step.value === 5) {
    stepFour();
  } else if (step.value === 6) {
    stepSix();
  }
}

// Step Functions

function stepOne() {
  formStepOne.$v.value.$touch();
  if (!formStepOne.$v.value.$invalid) {
    step.value = 2;
  } else {
    showError();
  }
}

function stepTwo() {
  formStepTwo.$v.value.$touch();
  if (!formStepTwo.$v.value.$invalid) {
    step.value = 3;
  } else {
    showError();
  }
}

function stepThree() {
  step.value = 4;
}
function stepSix() {
  formStepFive.$v.value.$touch();
  if (!formStepFive.$v.value.$invalid) {
    onSubmit();
    step.value = 7;
  } else {
    showError();
  }
}

async function stepSupport() {
  if (mainData.values.support_history) {
    mainData.values.support_history = [...mainData.values.support_history];
  } else {
    mainData.values.support_history = [];
  }

  const data: any = [];
  formStepSupport.values.forEach((support: any) => {
    isHaveEmptyField.value = !(
      support.support_type_list?.length || support.support_date
    );
    data.push({
      support_type_list: support.support_type_list,
      support_date: support.support_date
        ? dayjs(support.support_date).format("YYYY-MM-DD")
        : null,
      number: +String(support.number).replace(/\s/g, ""),
      all_price: +String(support.all_price).replace(/\s/g, ""),
      file_petition: support.file_petition_id,
      photo_report: support.photo_report_id,
      photo_cost: support.photo_cost_id,
      about_help: support.about_help_id,
    });
  });

  if (!isHaveEmptyField.value) {
    for (let el in data) {
      await ApiService.post(`api/v2/support-history/create/`, data[el])
        .then((res) => {
          mainData.values.support_history.push(res?.data?.id);
          step.value = 5;
        })
        .catch((err: any) => {
          showResponseErrors(err?.response?.data?.errors);
          step.value = 4;
        });
    }
  }
}

function stepFour() {
  formStepFour.$v.value.$touch();
  if (!formStepFour.$v.value.$invalid) {
    step.value = 6;
  } else {
    showError();
  }
}

async function onSubmit() {
  formStepOne.$v.value.$touch();
  formStepFive.$v.value.$touch();
  if (!formStepOne.$v.value.$invalid && !formStepFive.$v.value.$invalid) {
    buttonLoading.value = true;
    mainData.values.conditions = [];
    // ---------
    for (let key in formStepFour.values.conditions) {
      if (typeof formStepFour.values.conditions[key] !== "number") {
        mainData.values.conditions.push(...formStepFour.values.conditions[key]);
      } else {
        mainData.values.conditions.push(formStepFour.values.conditions[key]);
      }
    }
    // ----------
    for (let key in formStepThree.values.medical) {
      if (typeof formStepThree.values.medical[key] !== "number") {
        mainData.values.conditions.push(...formStepThree.values.medical[key]);
      } else {
        mainData.values.conditions.push(formStepThree.values.medical[key]);
      }
    }

    for (let key in formStepOne.values.conditions) {
      if (typeof formStepOne.values.conditions[key] !== "number") {
        mainData.values.conditions.push(...formStepOne.values.conditions[key]);
      } else {
        mainData.values.conditions.push(formStepOne.values.conditions[key]);
      }
    }

    for (let key in formStepOne.values.passport_conditions) {
      if (typeof formStepOne.values.passport_conditions[key] !== "number") {
        mainData.values.conditions.push(
          ...formStepOne.values.passport_conditions[key]
        );
      } else {
        mainData.values.conditions.push(
          formStepOne.values.passport_conditions[key]
        );
      }
    }

    for (let key in formStepOne.values.address_conditions) {
      if (typeof formStepOne.values.address_conditions[key] !== "number") {
        mainData.values.conditions.push(
          ...formStepOne.values.address_conditions[key]
        );
      } else {
        mainData.values.conditions.push(
          formStepOne.values.address_conditions[key]
        );
      }
    }

    for (let key in formStepTwo.values.conditions) {
      if (typeof formStepTwo.values.conditions[key] !== "number") {
        mainData.values.conditions.push(...formStepTwo.values.conditions[key]);
      } else {
        mainData.values.conditions.push(formStepTwo.values.conditions[key]);
      }
    }
    for (let key in formStepFive.values.conditions) {
      if (typeof formStepFive.values.conditions[key] !== "number") {
        mainData.values.conditions.push(...formStepFive.values.conditions[key]);
      } else {
        mainData.values.conditions.push(formStepFive.values.conditions[key]);
      }
    }
    // for (let key in formStepFive.values.finance) {
    //   if (typeof formStepFive.values.finance[key] !== "number") {
    //     mainData.values.conditions.push(...formStepFive.values.finance[key]);
    //   } else {
    //     mainData.values.conditions.push(formStepFive.values.finance[key]);
    //   }
    // }

    if (isResponsiblePerson.value) {
      mainData.values.responsible_person = user.value.id;
    }

    await createFamily();
    await ApiService.post(
      "api/v2/participants/participantCreate/",
      mainData.values
    )
      .then(() => {
        successfully.value = true;
        toast.success(t("successfully_created"), {
          icon: {
            iconClass: "done-icon",
            iconTag: "div",
          },
        });
        trigger.value = false;
        router.push("/dashboard/participants/active");
        formStepOne.$v.value.$reset();
        setTimeout(() => {
          router.go(0);
        }, 1900);
      })
      .catch((err: any) => {
        toast.error(
          t(err?.response?.data?.errors[0].error || "something_went_wrong"),
          {
            icon: {
              iconClass: "error-icon",
              iconTag: "div",
            },
          }
        );
      })
      .finally(() => (buttonLoading.value = false));
  } else {
    showError();
  }
}

async function createFamily() {
  mainData.values.family_members = [];
  if (formStepTwo.values?.relatives?.length) {
    for (let el of formStepTwo.values.relatives) {
      let data = {
        profile_photo: el?.family_photo,
        full_name: el.fio,
        birth_date: el.birthdate
          ? dayjs(el.birthdate).format("YYYY-MM-DD")
          : undefined,
        income_type: el?.income_type,
        monthly_income: Number(el?.salary?.replaceAll(" ", "")),
        illness: el?.illness,
        additional_info: el?.additional_info,
        relative: el?.type,
        contact: el?.contact,
        conditions: arrayId(el?.condition),
        relative_document: el?.relative_document,
      };

      await ApiService.post(
        "api/v2/participants/participantFamilyCreate/",
        data
      )
        .then((res: any) => {
          mainData.values.family_members.push(res?.data?.id);
        })
        .catch((err: any) => showResponseErrors(err?.response?.data?.errors));
    }
  }
  return true;
}

// Get Current Step
watch(
  () => step.value,
  () => {
    activeStep.value = steps.value.filter((el: any) => el.id === step.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  {
    immediate: true,
  }
);

function showError() {
  toast.error(t("fill_with_valuable_data"), {
    icon: {
      iconClass: "error-icon",
      iconTag: "div",
    },
  });
}

function showResponseErrors(err: any) {
  if (err) {
    toast.error(t(err?.at(0)?.message), {
      icon: {
        iconClass: "error-icon",
        iconTag: "div",
      },
    });
  }
}

window.addEventListener("beforeunload", (event: any) => {
  if (trigger.value) {
    event.returnValue = "Write something";
    formStepOne.$v.value.$reset();
  }
});

window.removeEventListener("beforeunload", (event: any) => {
  event.returnValue = "Write something";
});

onBeforeRouteLeave(async () => {
  if (!successfully.value) {
    let ask = confirm(t("changes_not_saved"));

    if (ask) {
      formStepOne.$v.value.$reset();
      window.location.reload();
    }
  }
});

function arrayId(conditionList: any) {
  if (conditionList) {
    let list = [];
    for (let key in conditionList) {
      if (conditionList[key]) {
        list.push(conditionList[key]);
      }
    }
    return list;
  } else {
    return undefined;
  }
}
</script>

<style scoped>
.bg-red {
  background-color: red;
}
.step-change-enter-active {
  animation: step-change 300ms ease-out;
}

.step-change-leave-active {
  animation: step-change 300ms ease-in reverse;
}

@keyframes step-change {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
