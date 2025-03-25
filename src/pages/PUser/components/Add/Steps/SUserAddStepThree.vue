<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper :title="$t('medic_conclusions')">
      <SFormGroup :label="$t('illness')">
        <el-select v-model="values.illness" :placeholder="$t('choose_illness')">
          <el-option
            v-for="item in illnessType"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
      <div v-if="values.illness === 'available'">
        <SFormGroup
          v-for="(condition, index) in medicalTypes"
          :key="index"
          :label="condition?.title"
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
      <SFormGroup
        v-if="values.illness !== 'not_available'"
        :label="$t('diagnosis')"
        class="col-span-2"
      >
        <STextArea
          v-model="values.diagnosis"
          :placeholder="$t('enter_diagnosis')"
        />
      </SFormGroup>
      <SFormGroup
        v-if="values.illness !== 'not_available'"
        :label="$t('additional_info_illness')"
        class="col-span-2"
      >
        <STextArea
          v-model="values.additional_info_illness"
          :placeholder="$t('enter_additional_info')"
        />
      </SFormGroup>

      <SFormGroup
        v-if="values.illness !== 'not_available'"
        :label="$t('disabled')"
      >
        <FileUploader v-model="values.disabled" custom-class="have-file" />
      </SFormGroup>
      <SFormGroup
        v-if="values.illness !== 'not_available'"
        :label="$t('illness_info')"
      >
        <FileUploader v-model="values.illness_doc" custom-class="have-file" />
      </SFormGroup>
      <SFormGroup
        v-if="values.illness !== 'not_available'"
        :label="$t('medical_certificate')"
      >
        <FileUploader
          v-model="values.medical_certificate"
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
import { mainData } from "@/pages/PUser/components/Add/data/forms";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
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

const { form } = unref(props);
const { values } = form;

watch(
  () => values.disabled,
  () => {
    mainData.values.disability = [];
    const files = new FormData();
    values.disabled.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.disability.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values.illness_doc,
  () => {
    mainData.values.illness_certificate = [];
    const files = new FormData();
    values.illness_doc.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.illness_certificate.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values.medical_data,
  () => {
    mainData.values.medical_certificate = [];
    const files = new FormData();
    values.medical_data.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.medical_certificate.push(el.id);
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
