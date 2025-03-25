<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper>
      <SFormGroup
        v-for="(condition, index) in conditions"
        :key="index"
        :label="condition?.title"
        :required="activeIndex(index)"
      >
        <el-select
          v-model="values.conditions[`condition_${index}`]"
          :placeholder="$t('choose_condition')"
          :disabled="!condition?.options?.length"
          :multiple="condition.selection_type === 2"
          filterable
          remote
          reserve-keyword
          remote-show-suffix
          :loading="loading"
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
    <!--    :remote-method="(e) => getEmploymentTypeOption(e, condition?.id)"-->
  </div>
</template>

<script setup lang="ts">
import { unref } from "vue";

import { TForm } from "@/composables/useForm";
import { useRemoteSearch } from "@/composables/useRemoteSearch";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";

const { remoteMethod, loading } = useRemoteSearch();
interface Props {
  show?: boolean;
  form?: TForm<any>;
  employmentType?: Array<any>;
  conditions?: Array<any>;
}
function activeIndex(idx: number) {
  if (idx == 0) {
    return true;
  } else if (idx == 2) {
    return true;
  } else if (idx == 3) {
    return true;
  }
}
interface TRemote {
  query: string;
  id: number;
}
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "remote-search", value: TRemote): void;
}>();

const { form } = unref(props);
const { values }: any = form;
const getEmploymentTypeOption = (e: string, id: number) => {
  remoteMethod(e);
  emit("remote-search", { query: e, id });
};
</script>

<style scoped>
.col-span-2 {
  grid-column: span 2;
}

.mr-2 {
  margin-right: 10px;
}
</style>

<!--<template>-->
<!--  <div class="d-flex flex-column gap-7">-->
<!--    <SUserFormWrapper>-->
<!--      <SFormGroup :label="conditionss.life_situation.title">-->
<!--        <el-select-->
<!--          v-model="values.life_situation"-->
<!--          :placeholder="$t('choose_condition')"-->
<!--          :disabled="!conditionss?.life_situation.options?.length"-->
<!--          filterable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          remote-show-suffix-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in conditionss?.life_situation.options"-->
<!--            :key="item.id"-->
<!--            :label="item.title"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </SFormGroup>-->
<!--      <SFormGroup :label="conditionss?.income_level.title" required>-->
<!--        <el-select-->
<!--          :class="{ error: form.$v.value.income_level.$error }"-->
<!--          v-model="values.income_level"-->
<!--          :placeholder="$t('choose_condition')"-->
<!--          :disabled="!conditionss?.income_level.options?.length"-->
<!--          filterable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          remote-show-suffix-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in conditionss?.income_level.options"-->
<!--            :key="item.id"-->
<!--            :label="item.title"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </SFormGroup>-->
<!--      <SFormGroup :label="conditionss.employment.title" required>-->
<!--        <el-select-->
<!--          :class="{ error: form.$v.value.employment.$error }"-->
<!--          v-model="values.employment"-->
<!--          :placeholder="$t('choose_condition')"-->
<!--          :disabled="!conditionss?.employment.options?.length"-->
<!--          filterable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          remote-show-suffix-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in conditionss?.employment.options"-->
<!--            :key="item.id"-->
<!--            :label="item.title"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </SFormGroup>-->
<!--      <SFormGroup :label="conditionss?.marital_status.title" required>-->
<!--        <el-select-->
<!--          :class="{ error: form.$v.value.marital_status.$error }"-->
<!--          v-model="values.marital_status"-->
<!--          :placeholder="$t('choose_condition')"-->
<!--          :disabled="!conditionss?.marital_status.options?.length"-->
<!--          filterable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          remote-show-suffix-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in conditionss?.marital_status.options"-->
<!--            :key="item.id"-->
<!--            :label="item.title"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </SFormGroup>-->
<!--      <SFormGroup :label="conditionss.disability.title">-->
<!--        <el-select-->
<!--          v-model="values.disability"-->
<!--          :placeholder="$t('choose_condition')"-->
<!--          :disabled="!conditionss?.disability.options?.length"-->
<!--          filterable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          remote-show-suffix-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in conditionss?.disability.options"-->
<!--            :key="item.id"-->
<!--            :label="item.title"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </SFormGroup>-->
<!--      <SFormGroup :label="conditionss.home.title">-->
<!--        <el-select-->
<!--          v-model="values.home"-->
<!--          :placeholder="$t('choose_condition')"-->
<!--          :disabled="!conditionss?.home.options?.length"-->
<!--          filterable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          remote-show-suffix-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in conditionss?.home.options"-->
<!--            :key="item.id"-->
<!--            :label="item.title"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </SFormGroup>-->
<!--      <SFormGroup :label="conditionss.training.title">-->
<!--        <el-select-->
<!--          v-model="values.training"-->
<!--          :placeholder="$t('choose_condition')"-->
<!--          :disabled="!conditionss?.training.options?.length"-->
<!--          filterable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          remote-show-suffix-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in conditionss?.training.options"-->
<!--            :key="item.id"-->
<!--            :label="item.title"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </SFormGroup>-->
<!--    </SUserFormWrapper>-->
<!--    &lt;!&ndash;    :remote-method="(e) => getEmploymentTypeOption(e, condition?.id)"&ndash;&gt;-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, unref, watch } from "vue";-->
<!--import { string } from "yup";-->

<!--import { TForm } from "@/composables/useForm";-->
<!--import { useRemoteSearch } from "@/composables/useRemoteSearch";-->
<!--import ApiService from "@/core/services/ApiService";-->
<!--import {-->
<!--  formStepFourr,-->
<!--  mainData,-->
<!--} from "@/pages/PUser/components/Add/data/forms";-->
<!--import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";-->
<!--import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";-->

<!--const { remoteMethod, loading } = useRemoteSearch();-->
<!--interface Conditions {-->
<!--  life_situation: object;-->
<!--  income_level: object;-->
<!--  employment: object;-->
<!--  marital_status: object;-->
<!--  disability: object;-->
<!--  home: object;-->
<!--  training: object;-->
<!--}-->
<!--interface Props {-->
<!--  show?: boolean;-->
<!--  form?: TForm<any>;-->
<!--  employmentType?: Array<any>;-->
<!--  conditions?: Array<any>;-->
<!--  conditionss?: Conditions;-->
<!--}-->
<!--function activeIndex(idx: number) {-->
<!--  if (idx == 1) {-->
<!--    return true;-->
<!--  } else if (idx == 2) {-->
<!--    return true;-->
<!--  } else if (idx == 3) {-->
<!--    return true;-->
<!--  }-->
<!--}-->

<!--interface TRemote {-->
<!--  query: string;-->
<!--  id: number;-->
<!--}-->
<!--const props = withDefaults(defineProps<Props>(), {});-->
<!--// const { life_situation } = props?.conditionss;-->
<!--const emit = defineEmits<{-->
<!--  (e: "remote-search", value: TRemote): void;-->
<!--}>();-->
<!--const { form } = unref(props);-->
<!--const { values }: any = form;-->
<!--const getEmploymentTypeOption = (e: string, id: number) => {-->
<!--  remoteMethod(e);-->
<!--  emit("remote-search", { query: e, id });-->
<!--};-->

<!--// &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->

<!--watch(-->
<!--  () => props.conditionss,-->
<!--  () => {-->
<!--    mainData.values.conditions.push(values.life_situation);-->
<!--    mainData.values.conditions.push(values.employment);-->
<!--    mainData.values.conditions.push(values.income_level);-->
<!--    mainData.values.conditions.push(values.marital_status);-->
<!--    mainData.values.conditions.push(values.disability);-->
<!--    mainData.values.conditions.push(values.home);-->
<!--    mainData.values.conditions.push(values.training);-->
<!--    // mainData.values-->
<!--  },-->
<!--  {-->
<!--    deep: true,-->
<!--  }-->
<!--);-->
<!--</script>-->

<!--<style scoped>-->
<!--.col-span-2 {-->
<!--  grid-column: span 2;-->
<!--}-->

<!--.mr-2 {-->
<!--  margin-right: 10px;-->
<!--}-->
<!--</style>-->
