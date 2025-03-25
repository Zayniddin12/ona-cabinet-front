<template>
  <div>
    <Teleport v-if="mounted" to="#header-toolbar">
      <SUserToolbar
        title="user_edit"
        :form="mainData"
        @add="onSubmit"
        :loading="saveButtonLoading"
      />
    </Teleport>

    <SUserSteps
      class="mb-7"
      v-bind="{ steps, step }"
      title="edit"
      @next="step = $event"
    />
    <Transition name="step-change" mode="out-in">
      <div :key="step">
        <SUserEditStepOne
          :key="participant"
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
          @fetch-more="fetchMore"
        />

        <SUserEditStepTwo
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

        <SUserEditStepThree
          v-if="step === 3"
          :form="formStepThree"
          v-bind="{ illnessType, medicalTypes }"
        />

        <SUserEditSupport
          v-if="step === 4"
          :form="formSupport"
          @add-new-form="addNewForm"
          @delete-form="deleteFormSupport"
        />

        <SUserEditStepFour
          v-if="step === 5"
          :form="formStepFour"
          v-bind="{
            conditions,
          }"
        />
        <SUserEditStepFive
          v-if="step === 6"
          :form="formStepFive"
          v-bind="{
            incomeTypeV1,
            banksList: banksList.results,
            bankConditions,
            financeConditions,
          }"
          @fetch-bank="fetchBank"
          @search="(type) => getBankSearch(type)"
        />
        <SUserAddStepSeven
          v-if="step === 7"
          :form="formStepSeven"
          :fullName="formStepOne.values"
        />
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
import { onMounted, reactive, ref, triggerRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import { useMounted } from "@/composables/useMounted";
import ApiService from "@/core/services/ApiService";
import { debounce } from "@/helpers";
import {
  formStepSeven,
  formSupportEdit,
} from "@/pages/PUser/components/Add/data/forms";
import SAddFooter from "@/pages/PUser/components/Add/SAddFooter.vue";
import SUserAddStepSeven from "@/pages/PUser/components/Add/Steps/SUserAddStepSeven.vue";
import SUserSteps from "@/pages/PUser/components/Add/SUserSteps.vue";
import SUserToolbar from "@/pages/PUser/components/Add/SUserToolbar.vue";
import {
  formStepFive,
  formStepFour,
  formStepOne,
  formStepThree,
  formStepTwo,
  mainData,
} from "@/pages/PUser/components/Edit/data/forms";
import SUserEditStepFive from "@/pages/PUser/components/Edit/Steps/SUserEditStepFive.vue";
import SUserEditStepFour from "@/pages/PUser/components/Edit/Steps/SUserEditStepFour.vue";
import SUserEditStepOne from "@/pages/PUser/components/Edit/Steps/SUserEditStepOne.vue";
import SUserEditStepThree from "@/pages/PUser/components/Edit/Steps/SUserEditStepThree.vue";
import SUserEditStepTwo from "@/pages/PUser/components/Edit/Steps/SUserEditStepTwo.vue";
import SUserEditSupport from "@/pages/PUser/components/Edit/Steps/SUserEditSupport.vue";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import { Actions } from "@/store/enums/StoreEnums";

const { mounted } = useMounted();
const trigger = ref(false);
const store = useStore();
const route = useRoute();
const step = ref(1);
const { t } = useI18n();
const activeStep = ref();
const toast = useToast();
const buttonLoading = ref(false);
const saveButtonLoading = ref(false);
const programs = ref();
const relativeTypes = ref();
const regions = ref();
const responsiblePersons = ref([]);
const medicalTypes = ref([]);
const mainConditions = ref([]);
const passportConditions = ref([]);
const addressConditions = ref([]);
const formSupport = reactive({ ...formSupportEdit });
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
const familyMembers = ref();
const banksList = ref();
const incomeTypeV1 = ref();
const router = useRouter();
const { participant } = useParticipant();
const conditions: any = ref([]);
const bankConditions = ref([]);
const financeConditions = ref([]);
const familyConditions = ref([]);
const bankParams = ref({
  limit: 20,
  offset: 0,
  search: "",
});

const getBankSearch = (aa: string) => {
  bankParams.value.limit = 20;
  bankParams.value.offset = 0;
  bankParams.value.search = encodeURI(aa);
  ApiService.query("api/v1/banks/search", {
    params: { ...bankParams.value },
  }).then((res: any) => {
    banksList.value = res?.data;
  });
};

const innerConditions = ref([]);

store.dispatch(Actions.FETCH_PARTICIPANT_SINGLE, route.params.id);

const hasNext = ref(false);
const params = reactive({
  limit: 20,
  offset: 0,
});

function addNewForm(form: any) {
  formSupport.values.push({
    support_type_list: form || {},
    all_price: "",
    number: "",
    support_date: "",
    file_petition: [],
    file_petition_id: [],
    photo_report: [],
    photo_report_id: [],
    photo_cost: [],
    photo_cost_id: [],
    about_help: [],
    about_help_id: [],
    id: 0,
  });
}

function deleteFormSupport() {
  mainData.values.support_history = [];
  formSupport.values.forEach((el: any) =>
    mainData.values.support_history.push(el?.id)
  );
}

function fetchModeratorList(searchText?: string) {
  ApiService.query("api/v2/main/ResponsiblePersonList?active=true", {
    params: {
      ...params,
      search: searchText,
    },
  }).then(({ data }) => {
    responsiblePersons.value = searchText
      ? data?.results
      : [...responsiblePersons.value, ...(data?.results ?? [])];
    hasNext.value = !!data.next;
  });
}

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

  //   Banks type
  ApiService.query("api/v1/banks/search", {}).then((res: any) => {
    banksList.value = res?.data;
  });
  //   Regions
  ApiService.query("api/v1/regions/search", {}).then((res: any) => {
    regions.value = res?.data?.results;
  });

  //   Banks type
  ApiService.query("api/v1/banks/search", {
    params: { ...bankParams.value },
  }).then((res: any) => {
    banksList.value = res?.data;
  });

  //   ResponsiblePersons
  fetchModeratorList();

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

onMounted(() => {
  getAll();
});

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
  {
    title: t("menus.contract"),
    id: 7,
  },
]);

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

watch(
  () => participant.value,
  (newValue: any) => {
    if (newValue.support_history.length) {
      formSupport.values = newValue.support_history;
      for (let i in formSupport.values) {
        formSupport.values[i].file_petition_id = [];
        formSupport.values[i].photo_report_id = [];
        formSupport.values[i].photo_cost_id = [];
        formSupport.values[i].about_help_id = [];

        if (formSupport.values[i]?.support_type_list?.length) {
          formSupport.values[i].support_type_list = formSupport.values[
            i
          ]?.support_type_list?.map((el: any) => el?.id);
        }

        if (formSupport.values[i].file_petition?.length) {
          formSupport.values[i].file_petition.forEach((el: any) =>
            formSupport.values[i].file_petition_id.push(el?.id)
          );
        }

        if (formSupport.values[i].photo_report?.length) {
          formSupport.values[i].photo_report.forEach((el: any) =>
            formSupport.values[i].photo_report_id.push(el?.id)
          );
        }

        if (formSupport.values[i].photo_cost?.length) {
          formSupport.values[i].photo_cost.forEach((el: any) =>
            formSupport.values[i].photo_cost_id.push(el?.id)
          );
        }

        if (formSupport.values[i].about_help?.length) {
          formSupport.values[i].about_help.forEach((el: any) =>
            formSupport.values[i].about_help_id.push(el?.id)
          );
        }
      }
    }

    formStepOne.values.image = newValue.profile_photo;
    formStepOne.values.surname = newValue.last_name;
    formStepOne.values.name = newValue.first_name;
    formStepOne.values.middle_name = newValue.middle_name;
    formStepOne.values.birthdate = newValue.birth_date;
    formStepOne.values.id = newValue.ID;
    formStepOne.values.phone_number = newValue.phone
      ? `+998${newValue.phone}`
      : "";
    formStepOne.values.program = arrayIds(newValue.programs);
    formStepOne.values.series = newValue.passport_serial;
    formStepOne.values.series_number = newValue.passport_number;
    formStepOne.values.jshshir = newValue.pinfl;
    formStepOne.values.copy_passport = newValue.passport_scan;
    formStepOne.values.region = newValue.constant_region?.id;
    formStepOne.values.address = newValue.constant_house_number;
    formStepOne.values.residence = newValue.constant_address_document;
    formStepOne.values.temporary_region = newValue.living_region?.id;
    formStepOne.values.temporary_address = newValue.living_house_number;
    formStepOne.values.temporary_residence = newValue.living_address_document
      ? newValue.living_address_document[0]
      : "";
    formStepOne.values.additional_info = newValue.additional_info;
    if (newValue.phone_number_info?.length) {
      formStepOne.values.inputs = [];
      newValue.phone_number_info.forEach((el: any) => {
        formStepOne.values.inputs.push({
          value: `+998${el}`,
        });
      });
    }
    formStepOne.values.responsible_person = newValue.responsible_person?.id;
    formStepOne.values.date_application = newValue.application_date;
    formStepOne.values.application_file = newValue.application_file;

    formStepOne.values.management_deed_date = newValue.date_of_management_act;
    formStepOne.values.referrall = newValue.referrall;

    // Step two
    formStepTwo.values.year = newValue.year;
    formStepTwo.values.family = newValue.family_info;
    formStepTwo.values.life_condition = newValue.lifestyle;
    formStepTwo.values.family_image = newValue.family_photo;
    formStepTwo.values.life_condition_image = newValue.living_condition_files;
    formStepTwo.values.marriage_doc = newValue.marriage_certificate;
    formStepTwo.values.divorce_doc = newValue.divorce_certificate;
    formStepTwo.values.died_husband_doc = newValue.husband_death_certificate;
    formStepTwo.values.died_family_doc =
      newValue.family_members_death_certificate;

    if (newValue.family_members?.length) {
      formStepTwo.values.relatives = [];
      newValue.family_members.forEach((el: any) => {
        let data = {
          id: el?.id,
          relative: el?.relative?.name,
          image: el?.profile_photo,
          docs: el?.relative_document,
          type: el?.relative?.id,
          fio: el?.full_name,
          birthdate: el?.birth_date ?? "",
          contact: el?.contact,
          income_type: el?.income_type?.id,
          illness: el?.illness,
          salary: el?.monthly_income,
          condition: {},
          additional_info: el?.additional_info,
          relative_docs: el?.relative_document,
          relative_document: [],
          disabled: el?.conditions?.length ? el?.conditions[0].id : "",
        };
        el.relative_document?.forEach((el: any) => {
          data?.relative_document.push(el?.id);
        });

        familyMembers.value?.forEach((family: any, index: number) => {
          el.conditions.forEach((condition: any) => {
            if (family?.id === condition?.type?.id) {
              data.condition[`condition_${index}`] = condition?.id;
            }
          });
        });
        formStepTwo.values.relatives.push(data);
        triggerRef(formStepTwo.values.relatives);
      });
    }

    formStepThree.values.illness = newValue.illness;
    formStepThree.values.diagnosis = newValue.diagnosis;
    formStepThree.values.additional_info_illness = newValue.medical_info;
    formStepThree.values.disabled = newValue.disability;
    formStepThree.values.illness_doc = newValue.illness_certificate;
    formStepThree.values.medical_data = newValue.medical_data;
    setTimeout(() => {
      sortConditions(newValue);
      sortMainConditions(newValue);
      sortPassportConditions(newValue);
      sortAddressConditions(newValue);
      sortBankConditions(newValue);
      sortFamilyConditions(newValue);
      sortFinanceConditions(newValue);
      sortMedicalConditions(newValue);
    }, 400);
    let hasBank = false;
    banksList.value?.results.forEach((el: any) => {
      if (newValue.bank?.id === el?.id) {
        hasBank = true;
      }
    });
    if (!hasBank) {
      banksList.value?.results.push(newValue.bank);
    }
    formStepFive.values.bank = newValue.bank?.id;
    formStepFive.values.stir = newValue.STIR;
    formStepFive.values.account_number = newValue.bank_account_number;
    formStepFive.values.card_number = newValue.bank_card_number;
    formStepFive.values.income_type = newValue.income_type.id;
    formStepFive.values.salary = newValue.monthly_income;
    formStepFive.values.income_type_doc = newValue.income_type_document;
    formStepFive.values.job_description = newValue.what_can_do;
    formStepFive.values.job = newValue.profession;
    formStepFive.values.mfo = newValue.bank_mfo;

    formStepSeven.values.participant = newValue?.full_name;

    equalMain(newValue);
  }
);

function arrayIds(arr: any) {
  const inArr: any = [];
  if (arr?.length) {
    arr.forEach((el: any) => {
      inArr.push(el?.id);
    });
  }
  return inArr;
}

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
  } else if (step.value === 7) {
    onSubmit();
  }
}

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

const hasEmptyField = ref(false);

async function stepSupport() {
  if (mainData.values.support_history) {
    mainData.values.support_history = [...mainData.values.support_history];
  } else {
    mainData.values.support_history = [];
  }

  const data: any = [];
  formSupport.values.forEach((support: any) => {
    hasEmptyField.value = !support.support_type_list?.length;
    data.push({
      support_type_list: support.support_type_list,
      support_date: support.support_date
        ? dayjs(support.support_date).format("YYYY-MM-DD")
        : null,
      number: support.number,
      all_price: +String(support.all_price).replace(/\s/g, ""),
      file_petition: support.file_petition_id,
      photo_report: support.photo_report_id,
      photo_cost: support.photo_cost_id,
      about_help: support.about_help_id,
      id: support.id,
    });
  });

  for (let el in data) {
    if (data[el].id) {
      await ApiService.put(
        `api/v2/support-history/update/${data[el].id}/`,
        data[el]
      )
        .then((res) => {
          mainData.values.support_history.push(res?.data?.id);
          step.value = 5;
        })
        .catch((err: any) => {
          step.value = 4;
          showResponseErrors(err?.response?.data?.errors);
        });
    } else {
      await ApiService.post(`api/v2/support-history/create/`, data[el])
        .then((res) => {
          mainData.values.support_history.push(res?.data?.id);
          formSupport.values[el].id = res?.data?.id;
          step.value = 5;
        })
        .catch((err: any) => {
          step.value = 4;
          showResponseErrors(err?.response?.data?.errors);
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
function stepSix() {
  formStepFive.$v.value.$touch();
  if (!formStepFive.$v.value.$invalid) {
    step.value = 7;
  } else {
    showError();
  }
}

async function onSubmit() {
  await stepSupport();
  formStepOne.$v.value.$touch();
  formStepFive.$v.value.$touch();
  formStepFive.$v.value.$touch();
  if (!formStepOne.$v.value.$invalid && !formStepFive.$v.value.$invalid) {
    if (!hasEmptyField.value) {
      saveButtonLoading.value = true;
      editUser(true);
    } else {
      alert("fo");
    }
  } else {
    showError();
    if (formStepOne.$v.value.$invalid) {
      step.value = 1;
    }
    if (formStepFive.$v.value.$invalid) {
      step.value = 6;
    }
  }
}

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
  } else {
    toast.error(t("something_went_wrong"), {
      icon: {
        iconClass: "error-icon",
        iconTag: "div",
      },
    });
  }
}

function equalMain(newValue: any) {
  mainData.values.active = newValue?.active;
  mainData.values.family_members_death_certificate = arrayIds(
    newValue.family_members_death_certificate
  );
  mainData.values.husband_death_certificate = arrayIds(
    newValue.husband_death_certificate
  );
  mainData.values.divorce_doc = arrayIds(newValue.divorce_doc);
  mainData.values.marriage_certificate = arrayIds(
    newValue.marriage_certificate
  );
  mainData.values.living_condition_files = arrayIds(
    newValue.living_condition_files
  );
  mainData.values.family_photo = arrayIds(newValue.family_photo);

  mainData.values.year = newValue?.year;
  mainData.values.family_info = newValue.family_info;
  mainData.values.lifestyle = newValue.lifestyle;
  mainData.values.family_members = arrayIds(newValue.family_members);
  mainData.values.illness = newValue.illness;
  mainData.values.diagnosis = newValue.diagnosis;
  mainData.values.additional_info_illness = newValue.additional_info_illness;
  mainData.values.disability = arrayIds(newValue.disability);
  mainData.values.illness_certificate = arrayIds(newValue.illness_certificate);
  mainData.values.medical_data = arrayIds(newValue.medical_data);
  innerConditions.value = arrayIds(newValue.conditions);
  mainData.values.constant_address_document = arrayIds(
    newValue.constant_address_document
  );
  mainData.values.divorce_certificate = arrayIds(newValue.divorce_certificate);
  mainData.values.application_file = arrayIds(newValue.application_file);
  mainData.values.bank = newValue.bank?.id;
  mainData.values.STIR = newValue.STIR;
  mainData.values.bank_account_number = newValue.bank_account_number;
  mainData.values.bank_card_number = newValue?.bank_card_number?.replaceAll(
    " ",
    ""
  );

  mainData.values.income_type = newValue.income_type?.id;
  mainData.values.salary = newValue.monthly_income?.id;
  mainData.values.income_type_document = arrayIds(
    newValue.income_type_document
  );
  mainData.values.job_description = newValue.what_can_do;
  mainData.values.profession = newValue.profession;
  mainData.values.bank_mfo = newValue.bank_mfo;
  trigger.value = true;
}

watch(
  () => mainData.values,
  () => {
    if (mainData.values && mainData.values.first_name) {
      debounce(
        "edit",
        () => {
          if (
            Number(mainData.values.ID) !== participant.value.ID &&
            mainData.values.ID
          ) {
            ApiService.post(`api/v2/participants/IDCheck/`, {
              ID: Number(mainData.values.ID),
            }).then((res: any) => {
              if (!res?.data?.status) {
                toast.error(t("id_already_existed"), {
                  icon: {
                    iconClass: "error-icon",
                    iconTag: "div",
                  },
                });
              }
            });
          }

          if (trigger.value) {
            editUser(false);
          }
        },
        300
      );
    }
  },
  {
    deep: true,
  }
);

function CheckConditions() {
  innerConditions.value = [];

  for (let key in formStepFour.values.conditions) {
    if (typeof formStepFour.values.conditions[key] !== "number") {
      innerConditions.value.push(...formStepFour.values.conditions[key]);
    } else {
      innerConditions.value.push(formStepFour.values.conditions[key]);
    }
  }

  for (let key in formStepThree.values.medical) {
    if (typeof formStepThree.values.medical[key] !== "number") {
      innerConditions.value.push(...formStepThree.values.medical[key]);
    } else {
      innerConditions.value.push(formStepThree.values.medical[key]);
    }
  }

  for (let key in formStepOne.values.conditions) {
    if (typeof formStepOne.values.conditions[key] !== "number") {
      innerConditions.value.push(...formStepOne.values.conditions[key]);
    } else {
      innerConditions.value.push(formStepOne.values.conditions[key]);
    }
  }

  for (let key in formStepTwo.values.conditions) {
    if (typeof formStepTwo.values.conditions[key] !== "number") {
      innerConditions.value.push(...formStepTwo.values.conditions[key]);
    } else {
      innerConditions.value.push(formStepTwo.values.conditions[key]);
    }
  }

  for (let key in formStepOne.values.passport_conditions) {
    if (typeof formStepOne.values.passport_conditions[key] !== "number") {
      innerConditions.value.push(
        ...formStepOne.values.passport_conditions[key]
      );
    } else {
      innerConditions.value.push(formStepOne.values.passport_conditions[key]);
    }
  }

  for (let key in formStepOne.values.address_conditions) {
    if (typeof formStepOne.values.address_conditions[key] !== "number") {
      innerConditions.value.push(...formStepOne.values.address_conditions[key]);
    } else {
      innerConditions.value.push(formStepOne.values.address_conditions[key]);
    }
  }

  for (let key in formStepFive.values.finance) {
    if (typeof formStepFive.values.finance[key] !== "number") {
      innerConditions.value.push(...formStepFive.values.finance[key]);
    } else {
      innerConditions.value.push(formStepFive.values.finance[key]);
    }
  }

  for (let key in formStepFive.values.conditions) {
    if (typeof formStepFive.values.conditions[key] !== "number") {
      innerConditions.value.push(...formStepFive.values.conditions[key]);
    } else {
      innerConditions.value.push(formStepFive.values.conditions[key]);
    }
  }
}

function editUser(isToast: boolean) {
  formStepOne.$v.value.$touch();

  if (!formStepOne.$v.value.$invalid) {
    saveButtonLoading.value = true;
    const participant =
      typeof formStepSeven.values.participant === "number"
        ? formStepSeven.values.participant
        : formStepSeven.values.participant?.id;
    CheckConditions();
    ApiService.put(
      `api/v2/participants/participantUpdate/${route.params.id}/`,
      {
        conditions: innerConditions.value,
        ...mainData.values,
        participant,
      }
    )
      .then(() => {
        if (isToast) {
          toast.success(t("successfully_edited"), {
            icon: {
              iconClass: "done-icon",
              iconTag: "div",
            },
          });
          formStepOne.$v.value.$reset();
          setTimeout(() => {
            router.push(`/dashboard/participants/${route.params.id}/main`);
          }, 300);
        }
      })
      .catch((err: any) => {
        showResponseErrors(err?.response?.data?.errors);
      })
      .finally(() => {
        saveButtonLoading.value = false;
      });
  } else {
    showError();
  }
}

function sortConditions(newValue: any) {
  conditions.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (!formStepFour.values.conditions[`condition_${index}`]?.length) {
            formStepFour.values.conditions[`condition_${index}`] = [];
          }
          formStepFour.values.conditions[`condition_${index}`].push(
            condition?.id
          );
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepFour.values.conditions[`condition_${index}`] = condition?.id;
        }
      }
    });
  });
}

function sortMainConditions(newValue: any) {
  mainConditions.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (!formStepOne.values.conditions[`condition_${index}`]?.length) {
            formStepOne.values.conditions[`condition_${index}`] = [];
          }
          formStepOne.values.conditions[`condition_${index}`].push(
            condition?.id
          );
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepOne.values.conditions[`condition_${index}`] = condition?.id;
        }
      }
    });
  });
}

function sortPassportConditions(newValue: any) {
  passportConditions.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (
            !formStepOne.values.passport_conditions[`condition_${index}`]
              ?.length
          ) {
            formStepOne.values.passport_conditions[`condition_${index}`] = [];
          }
          formStepOne.values.passport_conditions[`condition_${index}`].push(
            condition?.id
          );
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepOne.values.passport_conditions[`condition_${index}`] =
            condition?.id;
        }
      }
    });
  });
}

function sortAddressConditions(newValue: any) {
  addressConditions.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (
            !formStepOne.values.address_conditions[`condition_${index}`]?.length
          ) {
            formStepOne.values.address_conditions[`condition_${index}`] = [];
          }
          formStepOne.values.address_conditions[`condition_${index}`].push(
            condition?.id
          );
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepOne.values.address_conditions[`condition_${index}`] =
            condition?.id;
        }
      }
    });
  });
}

function sortMedicalConditions(newValue: any) {
  medicalTypes.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (!formStepThree.values.medical[`condition_${index}`]?.length) {
            formStepThree.values.medical[`condition_${index}`] = [];
          }
          formStepThree.values.medical[`condition_${index}`].push(
            condition?.id
          );
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepThree.values.medical[`condition_${index}`] = condition?.id;
        }
      }
    });
  });
}

function sortFinanceConditions(newValue: any) {
  financeConditions.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (!formStepFive.values.finance[`condition_${index}`]?.length) {
            formStepFive.values.finance[`condition_${index}`] = [];
          }
          formStepFive.values.finance[`condition_${index}`].push(condition?.id);
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepFive.values.finance[`condition_${index}`] = condition?.id;
        }
      }
    });
  });
}

function sortBankConditions(newValue: any) {
  bankConditions.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (!formStepFive.values.conditions[`condition_${index}`]?.length) {
            formStepFive.values.conditions[`condition_${index}`] = [];
          }
          formStepFive.values.conditions[`condition_${index}`].push(
            condition?.id
          );
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepFive.values.conditions[`condition_${index}`] = condition?.id;
        }
      }
    });
  });
}

function sortFamilyConditions(newValue: any) {
  familyConditions.value.forEach((el: any, index: number) => {
    newValue.conditions.forEach((condition: any) => {
      if (condition?.type?.selection_type === 2) {
        if (el?.id === condition?.type?.id) {
          if (!formStepTwo.values.conditions[`condition_${index}`]?.length) {
            formStepTwo.values.conditions[`condition_${index}`] = [];
          }
          formStepTwo.values.conditions[`condition_${index}`].push(
            condition?.id
          );
        }
      }
      if (condition?.type?.selection_type === 1) {
        if (el?.id === condition?.type?.id) {
          formStepTwo.values.conditions[`condition_${index}`] = condition?.id;
        }
      }
    });
  });
}

function fetchMore(searchText?: string) {
  if (hasNext.value || searchText) {
    params.offset = searchText ? 0 : params.offset + 20;
    fetchModeratorList(searchText);
  }
}

onBeforeRouteLeave(() => {
  formStepFour.values.conditions = {};
});
</script>

<style scoped>
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
