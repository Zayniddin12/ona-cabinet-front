<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper :title="$t('info_bank')">
      <SFormGroup :label="$t('bank')" required>
        <SRemoteSearch
          v-model="values.bank"
          id="name"
          label-key="bank_name"
          value-key="id"
          :placeholder="$t('choose_bank')"
          :options="banksList"
          :default-value="values.bank?.id"
          observe
          @on-search="(hh) => getSearch(hh)"
          @fetch-data="$emit('fetch-bank')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('bank_stir')" required>
        <SInput
          v-model="values.stir"
          :placeholder="$t('enter_bank_stir')"
          type="number"
          maxlength="11"
          v-maska="'###########'"
        />
      </SFormGroup>
      <SFormGroup :label="$t('bank_mfo')" required>
        <SInput v-model="values.mfo" placeholder="00000" v-maska="'#####'" />
      </SFormGroup>
      <SFormGroup :label="$t('account_number')" required>
        <SInput
          v-model="values.account_number"
          :placeholder="$t('enter_account_number')"
          v-maska="'####################'"
        />
      </SFormGroup>
      <SFormGroup :label="$t('card_number')" required>
        <SInput
          v-model="values.card_number"
          placeholder="0000 0000 0000 0000"
          v-maska="'#### #### #### ####'"
        />
      </SFormGroup>
      <SFormGroup
        v-for="(condition, index) in bankConditions"
        :key="index"
        :label="condition?.title"
        required
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
    <SUserFormWrapper :title="$t('finance_and_work')">
      <SFormGroup :label="$t('income_type')">
        <el-select
          v-model="values.income_type"
          :placeholder="$t('choose_condition')"
        >
          <el-option
            v-for="item in incomeTypeV1"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <SFormGroup :label="$t('month_income')">
        <SInput
          v-model="values.salary"
          :placeholder="$t('enter_salary')"
          v-maska="moneyMask()"
        />
      </SFormGroup>
      <SFormGroup :label="$t('job')">
        <SInput v-model="values.job" :placeholder="$t('enter_job')" />
      </SFormGroup>

      <SFormGroup :label="$t('income_doc')">
        <FileUploader
          v-model="values.income_type_doc"
          @change="
            createFiles($event, 'income_type_doc', 'income_type_document')
          "
          @before="
            removeFiles($event, 'income_type_doc', 'income_type_document')
          "
          custom-class="have-file"
        />
      </SFormGroup>

      <SFormGroup class="col-span-2" :label="$t('job_title')">
        <STextArea
          v-model="values.job_description"
          :placeholder="$t('enter_info')"
        />
      </SFormGroup>
      <!--      <SFormGroup-->
      <!--        v-for="(condition, index) in financeConditions"-->
      <!--        :key="index"-->
      <!--        :label="condition?.title"-->
      <!--      >-->
      <!--        <el-select-->
      <!--          v-model="values.finance[`condition_${index}`]"-->
      <!--          :placeholder="condition?.placeholder"-->
      <!--          :multiple="condition.selection_type === 2"-->
      <!--          :disabled="!condition?.options?.length"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="item in condition?.options"-->
      <!--            :key="item.id"-->
      <!--            :label="item.title"-->
      <!--            :value="item.id"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </SFormGroup>-->
    </SUserFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { ref, unref, watch } from "vue";

import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { moneyMask } from "@/helpers";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import { mainData } from "@/pages/PUser/components/Edit/data/forms";
import FileUploader from "@/stories/Form/FileUploader/FileUploader.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  incomeTypeV1?: Array<any>;
  banksList?: Array<any>;
  bankConditions: Array<any>;
  financeConditions: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{
  (e: "search", value: string): void;
  (e: "fetch-bank"): void;
}>();

const getSearch = (a: string) => {
  emit("search", a);
};

const { form } = unref(props);
const { values } = form;
const allItemsTarget = ref(null);
const allItemsIsVisible = ref(false);
const allItemsObserver = ref();

watch(
  () => values,
  () => {
    mainData.values.bank = values.bank;
    mainData.values.STIR = values.stir;
    mainData.values.bank_card_number = values.card_number?.replaceAll(" ", "");
    mainData.values.bank_account_number = values.account_number;
    mainData.values.income_type = values.income_type;
    mainData.values.profession = values.job;
    mainData.values.monthly_income = Number(
      values.salary ? String(values.salary).replaceAll(" ", "") : 0
    );
    mainData.values.what_can_do = values.job_description;
    mainData.values.bank_mfo = values.mfo;
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

allItemsObserver.value = useIntersectionObserver(
  allItemsTarget,
  ([{ isIntersecting }]) => {
    allItemsIsVisible.value = isIntersecting;
  }
);

watch(
  () => allItemsIsVisible.value,
  (newValue) => {
    if (newValue) {
      emit("fetch-bank");
    }
  }
);
</script>

<style scoped>
.col-span-2 {
  grid-column: span 2;
}

.mr-2 {
  margin-right: 10px;
}
</style>
