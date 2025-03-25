<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper :title="$t('medic_conclusions')">
      <SFormGroup :label="$t('illness')">
        <el-select
          v-model="values.illness"
          :placeholder="$t('choose_condition')"
        >
          <el-option
            v-for="item in illnessType"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <div v-if="values.illness == 'available'">
        <SFormGroup
          v-for="(condition, index) in medicalTypes"
          :key="index"
          :label="$t('stages_illness')"
        >
          <el-select
            v-model="values.medical[`condition_${index}`]"
            :placeholder="condition?.placeholder"
            :multiple="condition.selection_type === 2"
            :disabled="values.illness !== 'available'"
          >
            <el-option
              v-for="item in condition?.options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </SFormGroup>
      </div>

      <SFormGroup :label="$t('diagnosis')" class="col-span-2">
        <STextArea
          v-model="values.diagnosis"
          :placeholder="$t('enter_diagnosis')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('additional_info_illness')" class="col-span-2">
        <STextArea
          v-model="values.additional_info_illness"
          :placeholder="$t('enter_additional_info')"
        />
      </SFormGroup>

      <SFormGroup :label="$t('disabled')">
        <FileUploader
          v-model="values.disabled"
          @change="createFiles($event, 'disabled', 'disability')"
          @before="removeFiles($event, 'disabled', 'disability')"
          custom-class="have-file"
        />
      </SFormGroup>
      <SFormGroup :label="$t('illness_info')">
        <FileUploader
          v-model="values.illness_doc"
          @change="createFiles($event, 'illness_doc', 'illness_certificate')"
          @before="removeFiles($event, 'illness_doc', 'illness_certificate')"
          custom-class="have-file"
        />
      </SFormGroup>
      <SFormGroup :label="$t('medical_certificate')">
        <FileUploader
          v-model="values.medical_data"
          @change="createFiles($event, 'medical_data', 'medical_data')"
          @before="removeFiles($event, 'medical_data', 'medical_data')"
          custom-class="have-file"
        />
      </SFormGroup>
    </SUserFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { unref, watch } from "vue";

import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import { mainData } from "@/pages/PUser/components/Edit/data/forms";
import FileUploader from "@/stories/Form/FileUploader/FileUploader.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  illnessType?: Array<any>;
  medicalTypes?: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {});

// import {useI18n} from "vue-i18n";
//
// const {t}=useI18n()
const stagesIllness = [
  { title: "initial", id: 1 },
  { title: "average", id: 2 },
  { title: "chronic", id: 3 },
];

const { form } = unref(props);
const { values } = form;

// Files Change

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
  // values.copy_passport.splice(index, 1);
  mainData.values[mainValue].splice(index, 1);
}

watch(
  () => values,
  () => {
    mainData.values.illness = values.illness;
    mainData.values.diagnosis = values.diagnosis;
    mainData.values.medical_info = values.additional_info_illness;
  },
  {
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
