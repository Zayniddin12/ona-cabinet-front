<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper :title="$t('info_bank')">
      <SFormGroup :label="$t('bank')" required>
        <SRemoteSearch
          :error="form.$v.value.bank.$error"
          v-model="values.bank"
          id="name"
          label-key="bank_name"
          value-key="id"
          :placeholder="$t('choose_bank')"
          :options="blist"
          :default-value="values.bank"
          observe
          @on-search="$emit('fetch-more', $event)"
          @fetch-data="$emit('fetch-bank')"
        />
        <!--        <el-select-->
        <!--          v-model="values.bank"-->
        <!--          :placeholder="$t('choose_bank')"-->
        <!--          filterable-->
        <!--          remote-->
        <!--          reserve-keyword-->
        <!--          remote-show-suffix-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="item in banksList"-->
        <!--            :key="item.id"-->
        <!--            :label="item.bank_name"-->
        <!--            :value="item.id"-->
        <!--          />-->
        <!--          <div ref="allItemsTarget" class="p-2"></div>-->

        <!--          <template #empty>-->
        <!--            <p class="select-no-data">{{ $t("data_not_found") }}</p>-->
        <!--          </template>-->
        <!--        </el-select>-->
      </SFormGroup>
      <SFormGroup :label="$t('bank_stir')" required>
        <SInput
          :error="form.$v.value.stir.$error"
          v-model="values.stir"
          :placeholder="$t('enter_bank_stir')"
          maxlength="11"
        />
      </SFormGroup>
      <SFormGroup :label="$t('bank_mfo')" required>
        <SInput
          v-model="values.bank_mfo"
          placeholder="00000"
          v-maska="'#####'"
          :error="form.$v.value.bank_mfo.$error"
        />
      </SFormGroup>
      <SFormGroup :label="$t('account_number')" required>
        <SInput
          v-model="values.bank_account_number"
          :placeholder="$t('enter_account_number')"
          v-maska="'####################'"
          :error="form.$v.value.bank_account_number.$error"
        />
      </SFormGroup>
      <SFormGroup :label="$t('card_number')" required>
        <SInput
          v-model="values.bank_card_number"
          placeholder="0000 0000 0000 0000"
          v-maska="'#### #### #### ####'"
          :error="form.$v.value.bank_card_number.$error"
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
          :disabled="values.income_type == '2'"
          :input-class="{ 'cursor-not-allowed': values.income_type == '2' }"
        />
      </SFormGroup>
      <SFormGroup :label="$t('job')">
        <SInput v-model="values.job" :placeholder="$t('enter_job')" />
      </SFormGroup>

      <SFormGroup :label="$t('income_doc')">
        <FileUploader
          v-model="values.income_type_document"
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
      <!--          v-model="values.conditions[`condition_${index}`]"-->
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
import { computed, unref, watch } from "vue";

import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { moneyMask } from "@/helpers";
import { mainData } from "@/pages/PUser/components/Add/data/forms";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
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
  isHaveEmptyField?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["fetch-bank"]);

const { form } = unref(props);
const { values }: any = form;

const blist = computed(() => props.banksList);

watch(
  () => values.income_type_document,
  () => {
    mainData.values.income_type_document = [];
    const files = new FormData();
    values.income_type_document.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.income_type_document.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values,
  () => {
    mainData.values.bank = values.bank ?? undefined;
    mainData.values.STIR = values.stir ?? undefined;
    mainData.values.bank_card_number = values.bank_card_number?.replaceAll(
      " ",
      ""
    );
    mainData.values.bank_account_number = values.bank_account_number;
    mainData.values.income_type = values.income_type ?? undefined;
    mainData.values.monthly_income = values.salary > 0 ? values.salary : 0;
    mainData.values.what_can_do = values.job_description ?? undefined;
    mainData.values.bank_mfo = values.bank_mfo;
    mainData.values.profession = values.job;
  },
  {
    immediate: true,
    deep: true,
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
