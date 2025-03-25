<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper>
      <SFormGroup class="col-span-2" :label="$t('user_image')">
        <ImageUpload
          accept="image/*"
          @upload="createFile('image', $event, 'profile_photo')"
          @remove="removeImage()"
          :item="values.image"
          edit
        />
      </SFormGroup>
      <SFormGroup :label="$t('surname')" required>
        <SInput
          v-model="values.surname"
          :error="form.$v.value.surname.$error"
          :placeholder="$t('enter_surname')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('name')" required>
        <SInput
          v-model="values.name"
          :error="form.$v.value.name.$error"
          :placeholder="$t('enter_fullname')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('middle_name')" required>
        <SInput
          v-model="values.middle_name"
          :placeholder="$t('enter_middle_name')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('birthdate')" required>
        <el-date-picker
          class="date-picker w-100"
          v-model="values.birthdate"
          :placeholder="$t('kk_mm_yyyy')"
          type="date"
          :class="{ error: form.$v.value.birthdate.$error }"
          format="DD.MM.YYYY"
        />
      </SFormGroup>
      <SFormGroup :label="$t('user_id')">
        <SInput
          v-model="values.id"
          :placeholder="$t('enter_user_id')"
          v-maska="'##########'"
          :error="idError"
        />
      </SFormGroup>
      <SFormGroup :label="$t('phone_number')">
        <SInput
          v-model="values.phone_number"
          :placeholder="$t('+998 00 000-00-00')"
          :error="form.$v.value.phone_number.$error"
          v-maska="'+998 ## ### ## ##'"
        />
      </SFormGroup>
      <SFormGroup :label="$t('program')" required>
        <el-select
          :key="values.program"
          multiple
          v-model="values.program"
          :placeholder="$t('choose_program')"
          :class="{ error: form.$v.value.program.$error }"
        >
          <el-option
            v-for="item in programs"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>

      <SFormGroup
        v-for="(condition, index) in mainConditions"
        :key="index"
        :label="condition?.title"
      >
        <el-select
          v-model="values.conditions[`condition_${index}`]"
          :placeholder="condition?.placeholder"
          :multiple="condition.selection_type === 2"
          :disabled="!condition?.options?.length"
        >
          <el-option
            v-for="item in condition?.options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
    </SUserFormWrapper>
    <SUserFormWrapper :title="$t('passport_id_title')">
      <SFormGroup :label="$t('passport_id')" required>
        <div class="d-flex align-items-center gap-3">
          <SInput
            v-model="values.series"
            placeholder="AA"
            class="id-input"
            input-class="id-input-inner"
            :error="form.$v.value.series.$error"
            v-maska="'AA'"
          />
          <SInput
            v-model="values.series_number"
            placeholder="0000000"
            :error="form.$v.value.series_number.$error"
            v-maska="'#######'"
          />
        </div>
      </SFormGroup>
      <SFormGroup :label="$t('jshshir')" required>
        <SInput
          v-model="values.jshshir"
          :placeholder="$t('jshshir_enter')"
          v-maska="'##############'"
          :error="form.$v.value.jshshir.$error"
        />
      </SFormGroup>
      <SFormGroup :label="$t('copy_of_pasport')" required>
        <!--        <SFormImageUpload-->
        <!--          @upload="createFile('copy_passport', $event)"-->
        <!--          @remove="values.copy_passport = null"-->
        <!--          :item="values.copy_passport"-->
        <!--        />-->
        <FileUploader
          v-model="values.copy_passport"
          custom-class="have-file"
          required
          @change="createFiles($event, 'copy_passport', 'passport_scan')"
          @before="removeFiles($event, 'copy_passport', 'passport_scan')"
        />
      </SFormGroup>
      <SFormGroup
        v-for="(condition, index) in passportConditions"
        :key="index"
        :label="condition?.title"
      >
        <el-select
          v-model="values.passport_conditions[`condition_${index}`]"
          :placeholder="condition?.placeholder"
          :multiple="condition.selection_type === 2"
          :disabled="!condition?.options?.length"
        >
          <el-option
            v-for="item in condition?.options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
    </SUserFormWrapper>
    <SUserFormWrapper :title="$t('address_living')">
      <SFormGroup :label="$t('region')">
        <el-select v-model="values.region" :placeholder="$t('choose_region')">
          <el-option
            v-for="item in regions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <SFormGroup :label="$t('city')">
        <el-select
          v-model="values.city"
          :placeholder="$t('choose_city')"
          :disabled="!mainCities"
        >
          <el-option
            v-for="item in mainCities"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <SFormGroup :label="$t('mfy')">
        <el-select
          v-model="values.mfy"
          :key="values.mfy"
          :placeholder="$t('choose_mfy')"
          :disabled="!mainStreets?.length"
        >
          <el-option
            v-for="item in mainStreets"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <SFormGroup :label="$t('full_address')">
        <SInput
          v-model="values.address"
          :placeholder="$t('enter_full_address')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('doc_from_living_address')">
        <FileUploader
          v-model="values.residence"
          @change="
            createFiles($event, 'residence', 'constant_address_document')
          "
          @before="
            removeFiles($event, 'residence', 'constant_address_document')
          "
          custom-class="have-file"
        />
      </SFormGroup>
      <SFormGroup
        v-for="(condition, index) in addressConditions"
        :key="index"
        :label="condition?.title"
      >
        <el-select
          v-model="values.address_conditions[`condition_${index}`]"
          :placeholder="condition?.placeholder"
          :multiple="condition.selection_type === 2"
          :disabled="!condition?.options?.length"
        >
          <el-option
            v-for="item in condition?.options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
    </SUserFormWrapper>
    <SUserFormWrapper :title="$t('temporary_address')">
      <SFormGroup :label="$t('region')">
        <el-select
          v-model="values.temporary_region"
          :placeholder="$t('choose_region')"
        >
          <el-option
            v-for="item in regions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <SFormGroup :label="$t('city')">
        <el-select
          v-model="values.temporary_city"
          :placeholder="$t('choose_city')"
          :disabled="!temporaryCities"
        >
          <el-option
            v-for="item in temporaryCities"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <SFormGroup :label="$t('mfy')">
        <el-select
          :key="values.temporary_mfy"
          v-model="values.temporary_mfy"
          :placeholder="$t('choose_mfy')"
          :disabled="!temporaryStreets?.length"
        >
          <el-option
            v-for="item in temporaryStreets"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <SFormGroup :label="$t('full_address')">
        <SInput
          v-model="values.temporary_address"
          :placeholder="$t('enter_full_address')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('doc_from_living_address')">
        <SFormImageUpload
          @upload="
            createFile('temporary_residence', $event, 'living_address_document')
          "
          @remove="removeImages"
          :item="values.temporary_residence"
        />
      </SFormGroup>
    </SUserFormWrapper>

    <SUserFormWrapper :title="$t('additional_info')">
      <SFormGroup :label="$t('phone_number')">
        <template #labelOpposite>
          <div
            v-if="values.inputs?.length < 3"
            @click="addNumber"
            class="d-flex align-items-center gap-21"
          >
            <img src="/assets/ona/svg/plus-solid.svg" alt="plus" />
            <p class="fs-5 lh-16 text-blue fw-bold cursor-pointer">
              {{ $t("add_new") }}
            </p>
          </div>
        </template>
        <div class="d-flex flex-column gap-22">
          <SInput
            v-for="(phone, index) in values.inputs"
            :key="index"
            v-model="phone.value"
            placeholder="+998 00 000-00-00"
            v-maska="'+998 ## ### ## ##'"
          >
            <template #suffix>
              <div
                v-if="index !== 0"
                class="delete-input"
                @click="removeInput(index)"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.0837 5H2.91699"
                    stroke="#A2ABBE"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M15.6946 7.08325L15.3113 12.8325C15.1638 15.0449 15.09 16.1511 14.3692 16.8255C13.6483 17.4999 12.5397 17.4999 10.3223 17.4999H9.67787C7.46054 17.4999 6.35187 17.4999 5.63103 16.8255C4.91019 16.1511 4.83644 15.0449 4.68895 12.8325L4.30566 7.08325"
                    stroke="#A2ABBE"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M7.91699 9.16675L8.33366 13.3334"
                    stroke="#A2ABBE"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M12.0837 9.16675L11.667 13.3334"
                    stroke="#A2ABBE"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M5.41699 5C5.46356 5 5.48684 5 5.50795 4.99947C6.19415 4.98208 6.79951 4.54576 7.03301 3.90027C7.04019 3.88041 7.04755 3.85832 7.06228 3.81415L7.14318 3.57143C7.21225 3.36423 7.24678 3.26063 7.29259 3.17267C7.47533 2.82173 7.81344 2.57803 8.20417 2.51564C8.3021 2.5 8.4113 2.5 8.62971 2.5H11.3709C11.5893 2.5 11.6986 2.5 11.7965 2.51564C12.1872 2.57803 12.5253 2.82173 12.7081 3.17267C12.7539 3.26063 12.7884 3.36423 12.8575 3.57143L12.9384 3.81415C12.9531 3.85826 12.9605 3.88042 12.9676 3.90027C13.2011 4.54576 13.8065 4.98208 14.4927 4.99947C14.5138 5 14.5371 5 14.5837 5"
                    stroke="#A2ABBE"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
            </template>
          </SInput>
        </div>
      </SFormGroup>
      <SFormGroup :label="$t('additional_info')">
        <STextArea
          v-model="values.additional_info"
          :placeholder="$t('enter_additional_info')"
        />
      </SFormGroup>
    </SUserFormWrapper>
    <SUserFormWrapper :title="$t('other_info')">
      <SFormGroup :label="$t('responsible_person')" required>
        <SRemoteSearch
          v-model="values.responsible_person"
          id="name"
          label-key="first_name"
          inner-user
          value-key="id"
          :error="form.$v.value.responsible_person.$error"
          :placeholder="$t('choose_responsible_person')"
          :options="responsiblePersons"
          :default-value="values.responsible_person"
          observe
          :disabled="isResponsiblePerson"
          @on-search="$emit('fetch-more', $event)"
          @fetch-data="$emit('fetch-more')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('date_application')">
        <el-date-picker
          class="date-picker w-100"
          v-model="values.date_application"
          :placeholder="$t('kk_mm_yyyy')"
          type="date"
          format="DD.MM.YYYY"
        />
      </SFormGroup>
      <SFormGroup :label="$t('application_file')">
        <FileUploader
          v-model="values.application_file"
          @change="createFiles($event, 'application_file', 'application_file')"
          @before="removeFiles($event, 'application_file', 'application_file')"
          custom-class="have-file"
        />
      </SFormGroup>
      <SFormGroup :label="$t('management_deed_date')">
        <el-date-picker
          class="date-picker w-100"
          v-model="values.management_deed_date"
          :placeholder="$t('kk_mm_yyyy')"
          type="date"
          format="DD.MM.YYYY"
        />
      </SFormGroup>
      <SFormGroup :label="$t('referral')">
        <SInput
          v-model="values.referrall"
          :placeholder="$t('enter_referral')"
        />
      </SFormGroup>
    </SUserFormWrapper>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, ref, triggerRef, unref, watch } from "vue";
import { useStore } from "vuex";

import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import {
  formStepOne,
  mainData,
} from "@/pages/PUser/components/Edit/data/forms";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import FileUploader from "@/stories/Form/FileUploader/FileUploader.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import ImageUpload from "@/stories/Form/ImageUpload/ImageUpload.vue";
import SFormImageUpload from "@/stories/Form/ImageUpload/SFormImageUpload.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

const { participant } = useParticipant();

interface Props {
  show?: boolean;
  programs: Array<any>;
  regions: Array<any>;
  form?: TForm<any>;
  responsiblePersons: Array<any>;
  mainConditions: Array<any>;
  passportConditions: Array<any>;
  addressConditions: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {});

const { form } = unref(props);
const { values } = form;
const mainCities = ref();
const temporaryCities = ref();
const mainStreets = ref();
const temporaryStreets = ref();

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});

function addNumber() {
  values.inputs.push({ value: "" });
}

function removeInput(index: number) {
  values.inputs.splice(index, 1);
}

function getMainCities() {
  ApiService.query("api/v1/districts/search", {
    params: {
      region: values.region,
    },
  }).then((res) => {
    mainCities.value = res?.data?.results;
    if (values.region === participant.value.constant_region.id) {
      values.city = participant.value.constant_district?.id;
    }
  });
}

function getMainStreets() {
  ApiService.query("api/v1/streets/search", {
    params: {
      district: values.city,
      limit: 200,
    },
  }).then((res) => {
    mainStreets.value = res?.data?.results;
    if (values.region === participant.value.constant_region.id) {
      values.mfy = participant.value.constant_street?.id;
    }
  });
}

watch(
  () => values.region,
  () => {
    values.city = "";
    mainStreets.value = [];
    triggerRef(mainStreets);
    if (values.region) {
      getMainCities();
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => values.city,
  () => {
    values.mfy = "";
    getMainStreets();
  }
);

// Temporary

function getTemporaryMainCities() {
  ApiService.query("api/v1/districts/search", {
    params: {
      region: values.temporary_region,
    },
  }).then((res) => {
    temporaryCities.value = res?.data?.results;
    if (values.temporary_region === participant.value.living_region?.id) {
      values.temporary_city = participant.value.living_district?.id;
    }
  });
}

function getTemporaryMainStreets() {
  ApiService.query("api/v1/streets/search", {
    params: {
      district: values.temporary_city,
      limit: 200,
    },
  }).then((res) => {
    temporaryStreets.value = res?.data?.results;
    if (values.temporary_city === participant.value?.living_district?.id) {
      values.temporary_mfy = participant.value.living_street?.id;
    }
  });
}

watch(
  () => values.temporary_region,
  () => {
    values.temporary_city = "";
    temporaryCities.value = [];
    triggerRef(mainStreets);
    getTemporaryMainCities();
  },
  {
    immediate: true,
  }
);

watch(
  () => values.temporary_city,
  () => {
    values.temporary_mfy = "";
    getTemporaryMainStreets();
  }
);

function removeImage() {
  values.image = null;
  mainData.values.profile_photo = null;
}

function removeImages() {
  values.removeImages = [];
  mainData.values.living_address_document = [];
}

function createFile(inner_value: string, file: any, main_value: string) {
  const data = new FormData();
  data.append("url", file);
  values[inner_value] = file;
  ApiService.post("/api/v1/files/", data).then((res: any) => {
    if (main_value === "profile_photo") {
      mainData.values[main_value] = mainData.values[main_value] = res?.data?.id;
    } else {
      mainData.values[main_value] = [];
      mainData.values[main_value].push(res?.data?.id);
    }
  });
}

watch(
  () => values,
  () => {
    mainData.values.first_name = formStepOne.values.name;
    mainData.values.last_name = formStepOne.values.surname;
    mainData.values.middle_name = formStepOne.values.middle_name ?? undefined;
    mainData.values.birth_date =
      dayjs(formStepOne.values.birthdate).format("YYYY-MM-DD") ?? undefined;
    mainData.values.ID =
      Number(formStepOne.values.id) !== 0
        ? Number(formStepOne.values.id)
        : undefined;
    mainData.values.phone =
      formStepOne.values.phone_number?.replaceAll(" ", "").slice(4) ??
      undefined;
    mainData.values.passport_serial = formStepOne.values.series ?? undefined;
    mainData.values.passport_number =
      formStepOne.values.series_number ?? undefined;
    mainData.values.constant_region = formStepOne.values.region ?? undefined;
    mainData.values.constant_district = formStepOne.values.city ?? undefined;
    mainData.values.constant_street = formStepOne.values.mfy ?? undefined;
    mainData.values.constant_house_number =
      formStepOne.values.address ?? undefined;
    mainData.values.living_region =
      formStepOne.values.temporary_region ?? undefined;
    mainData.values.living_district =
      formStepOne.values.temporary_city ?? undefined;
    mainData.values.living_street =
      formStepOne.values.temporary_mfy ?? undefined;
    // mainData.values.living_address_document =
    //   formStepOne.values.temporary_residence ?? undefined;
    if (formStepOne.values.temporary_residence?.length) {
      mainData.values.living_address_document.push(
        formStepOne.values.temporary_residence
      );
    }
    mainData.values.living_house_number =
      formStepOne.values.temporary_address ?? undefined;
    mainData.values.additional_info =
      formStepOne.values.additional_info ?? undefined;
    mainData.values.responsible_person = values.responsible_person ?? undefined;
    if (values.date_application) {
      mainData.values.application_date =
        dayjs(values.date_application).format("YYYY-MM-DD") ?? undefined;
    }
    if (values.management_deed_date) {
      mainData.values.date_of_management_act =
        dayjs(values.management_deed_date).format("YYYY-MM-DD") ?? undefined;
    }
    mainData.values.referrall = values.referrall ?? undefined;
    mainData.values.pinfl = values.jshshir;
    mainData.values.programs = values.program;

    if (values.inputs && values.inputs.length) {
      mainData.values.phone_number_info = [];
      values.inputs.forEach((el: any) => {
        if (el.value) {
          mainData.values.phone_number_info.push(
            el.value?.replaceAll(" ", "").slice(4)
          );
        }
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

function createFiles(file: any, innerValue: string, mainValue: string) {
  const data = new FormData();
  data.append("url", file.raw);
  if (!mainData.values[mainValue]) {
    mainData.values[mainValue] = [];
  }
  ApiService.post("/api/v1/files/", data).then((res: any) => {
    mainData.values[mainValue].push(res?.data?.id);
  });
}

function removeFiles(file: any, innerValue: string, mainValue: string) {
  let index = values[innerValue].findIndex((el: any) => el?.uid === file.uid);
  mainData.values[mainValue].splice(index, 1);
}

watch(
  () => participant.value,
  (newValue) => {
    if (newValue.passport_scan?.length) {
      mainData.values.passport_scan = [];
      newValue.passport_scan.forEach((el: any) => {
        mainData.values.passport_scan.push(el?.id);
      });
    }
  },
  {
    immediate: true,
  }
);

const idError = ref(false);
</script>

<style scoped>
.col-span-2 {
  grid-column: span 2;
}

.mr-2 {
  margin-right: 10px;
}
</style>

<style lang="scss">
.id-input {
  width: 51px !important;
}

.id-input-inner {
  padding: 13px 16px 13px 13px !important;
}

.delete-input {
  margin-right: 10px;
  cursor: pointer;
}

.delete-input:hover {
  svg {
    path {
      stroke: #fa3232;
    }
  }
}
</style>
