<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper :title="$t('about_family')">
      <SFormGroup class="col-span-2 mb-3" :label="$t('year')">
        <SInput
          v-maska="'####'"
          v-model="values.year"
          :placeholder="$t('enter_year')"
        />
      </SFormGroup>
      <SFormGroup class="col-span-2" :label="$t('short_about_family')">
        <STextArea v-model="values.family" :placeholder="$t('enter_info')" />
      </SFormGroup>
      <SFormGroup class="col-span-2" :label="$t('lifestyle_condition')">
        <SInput
          v-model="values.life_condition"
          :placeholder="$t('enter_info')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('family_image')">
        <FileUploader v-model="values.family_image" custom-class="have-file" />
      </SFormGroup>
      <SFormGroup :label="$t('lifestyle_condition_image')">
        <FileUploader
          v-model="values.life_condition_image"
          custom-class="have-file"
        />
      </SFormGroup>
      <SFormGroup
        v-for="(condition, index) in familyConditions"
        :key="index"
        :label="condition?.title"
      >
        <el-select
          v-model="values.finance[`condition_${index}`]"
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
    <!--  Docs  -->

    <SUserFormWrapper :title="$t('docs')">
      <SFormGroup :label="$t('marriage_doc')">
        <FileUploader v-model="values.marriage_doc" custom-class="have-file" />
      </SFormGroup>
      <SFormGroup :label="$t('divorce_doc')">
        <FileUploader v-model="values.divorce_doc" custom-class="have-file" />
      </SFormGroup>
      <SFormGroup :label="$t('died_husband_doc')">
        <FileUploader
          v-model="values.died_husband_doc"
          custom-class="have-file"
        />
      </SFormGroup>
      <SFormGroup :label="$t('dies_family_doc')">
        <FileUploader
          v-model="values.died_family_doc"
          custom-class="have-file"
        />
      </SFormGroup>
    </SUserFormWrapper>

    <!--  Relatives  -->
    <SUserFormWrapper
      :title="$t('relatives')"
      :body-class="[{ 'pt-0': !values.relatives?.length }, 'outer-body']"
    >
      <div
        v-for="(relative, index) in values.relatives"
        :key="index"
        class="relatives col-span-2"
        :class="{ 'relative-second': index !== 0 }"
      >
        <div
          class="relative-block d-flex align-items-center justify-content-between col-span-2"
        >
          <p class="relative-block__title">
            {{ index === 0 ? $t(relative?.relative) : relative?.relative }}
          </p>
          <inline-svg
            src="/assets/ona/svg/trash-gray.svg"
            class="hover-trash cursor-pointer"
            @click="deleteRelative(index)"
          />
        </div>

        <div class="col-span-2">
          <SFormGroup :label="$t('relative_image')">
            <ImageUpload
              @upload="createFile($event, index, 'family_photo')"
              @remove="clearFile(index, 'family_photo')"
              :item="relative.image"
            />
          </SFormGroup>
        </div>

        <SFormGroup :label="$t('docs')">
          <FileUploader
            v-model="relative.relative_docs"
            custom-class="have-file"
            @change="changeFile(index)"
            @remove="changeFile(index)"
          />
        </SFormGroup>
        <div />
        <SFormGroup :label="$t('relative_type')">
          <el-select
            v-model="relative.type"
            :placeholder="$t('choose_relative_type')"
          >
            <el-option
              v-for="item in relativeTypes"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </SFormGroup>
        <SFormGroup :label="$t('fio')">
          <SInput v-model="relative.fio" :placeholder="$t('enter_full_name')" />
        </SFormGroup>

        <SFormGroup :label="$t('birthdate')">
          <el-date-picker
            class="date-picker w-100"
            v-model="relative.birthdate"
            :placeholder="$t('kk_mm_yyyy')"
            type="date"
            format="DD.MM.YYYY"
          />
        </SFormGroup>
        <SFormGroup :label="$t('contact_info_family')">
          <SInput
            v-model="relative.contact"
            :placeholder="$t('enter_contact_info_family')"
          />
        </SFormGroup>
        <SFormGroup :label="$t('income_type')">
          <el-select
            v-model="relative.income_type"
            :placeholder="$t('choose_income_type')"
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
            v-model="relative.salary"
            placeholder="3 000 000"
            v-maska="moneyMask()"
            :disabled="relative.income_type == '2'"
            :input-class="{ 'cursor-not-allowed': relative.income_type == '2' }"
          />
        </SFormGroup>
        <SFormGroup :label="$t('illness')">
          <el-select
            v-model="relative.illness"
            :placeholder="$t('choose_illness_type')"
          >
            <el-option
              v-for="item in illnessType"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </SFormGroup>
        <SFormGroup
          v-for="(condition, index) in familyMembers"
          :key="index"
          :label="condition?.title"
        >
          <el-select
            v-model="relative.condition[`condition_${index}`]"
            :placeholder="condition?.placeholder"
          >
            <el-option
              v-for="item in condition?.options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </SFormGroup>
        <SFormGroup :label="$t('additional_info')">
          <STextArea
            v-model="relative.additional_info"
            :placeholder="$t('enter_additional_info')"
          />
        </SFormGroup>
      </div>

      <div class="add-form-button col-span-2">
        <SButton :text="$t('add_relative_new')" class="gap-1" @click="addNew">
          <template #pre-icon>
            <img src="/assets/svg/buttons/plus.svg" alt="plus"
          /></template>
        </SButton>
      </div>
    </SUserFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { unref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { moneyMask } from "@/helpers";
import { mainData } from "@/pages/PUser/components/Add/data/forms";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import FileUploader from "@/stories/Form/FileUploader/FileUploader.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import ImageUpload from "@/stories/Form/ImageUpload/ImageUpload.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  relativeTypes?: Array<any>;
  illnessType?: Array<any>;
  incomeTypeV1?: Array<any>;
  familyMembers?: Array<any>;
  familyConditions?: Array<any>;
}

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {});

const { form } = unref(props);
const { values } = form;

watch(
  () => values.year,
  (val) => {
    mainData.values.year = +val;
  }
);

watch(
  () => values.family_image,
  () => {
    mainData.values.family_photo = [];
    const files = new FormData();
    values.family_image.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.family_photo.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values.life_condition_image,
  () => {
    mainData.values.living_condition_files = [];
    const files = new FormData();
    values.life_condition_image.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.living_condition_files.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values.marriage_doc,
  () => {
    mainData.values.marriage_certificate = [];
    const files = new FormData();
    values.marriage_doc.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.marriage_certificate.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values.divorce_doc,
  () => {
    mainData.values.divorce_certificate = [];
    const files = new FormData();
    values.divorce_doc.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.divorce_certificate.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values.died_husband_doc,
  () => {
    mainData.values.husband_death_certificate = [];
    const files = new FormData();
    values.died_husband_doc.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.husband_death_certificate.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

watch(
  () => values.died_family_doc,
  () => {
    mainData.values.family_members_death_certificate = [];
    const files = new FormData();
    values.died_family_doc.forEach((el: any, index: number) => {
      files.append(`files[${index}]file`, el.raw);
    });
    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        mainData.values.family_members_death_certificate.push(el.id);
      });
    });
  },
  {
    deep: true,
  }
);

function addNew() {
  const data = {
    relative: `${t("relative")} ${values.relatives.length + 1}`,
    image: "",
    docs: "",
    type: "",
    fio: "",
    birthdate: "",
    contact: "",
    income_type: "",
    salary: "",
    condition: {},
    illness: "",
    disabled: "",
    additional_info: "",
  };
  values.relatives.push(data);
}

watch(
  () => values,
  () => {
    mainData.values.family_info = values.family ?? undefined;
    mainData.values.lifestyle = values.life_condition ?? undefined;
  },
  {
    deep: true,
  }
);

// Create File

function createFile(file: any, index: number, inner_id_value: string) {
  const data = new FormData();
  data.append("url", file);
  values.relatives[index].image = file;
  ApiService.post("/api/v1/files/", data).then((res: any) => {
    values.relatives[index][inner_id_value] = res?.data?.id;
  });
}

function clearFile(index: number, inner_id_value: string) {
  values.relatives[index].image = null;
  values.relatives[index][inner_id_value] = undefined;
}

function changeFile(index: number) {
  values.relatives[index].relative_document = [];
  const files = new FormData();
  setTimeout(() => {
    values.relatives[index].relative_docs.forEach((el: any, idx: number) => {
      files.append(`files[${idx}]file`, el.raw);
    });

    ApiService.post("/api/v2/main/BaseFileUpload", files).then((res: any) => {
      res?.data?.files.forEach((el: any) => {
        values.relatives[index].relative_document.push(el.id);
      });
    });
  }, 300);
}

function deleteRelative(index: number) {
  values.relatives.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.col-span-2 {
  grid-column: span 2;
}

.mr-2 {
  margin-right: 10px;
}

.relatives {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding-right: 24px;
}

.add-form-button {
  padding-top: 20px;
  border-top: 1px solid #eff2f5;
}

.relative-second {
  padding-top: 20px;
  border-top: 1px solid #eff2f5;
}

.relative-block {
  padding: 16px;
  background: #f3f6f9;
  border-radius: 8px;

  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #1c1f20;
  }
}
</style>

<style lang="scss">
.outer-body {
  padding-right: 0 !important;
}

.hover-trash {
  &:hover {
    path {
      stroke: #fa3232;
    }
  }
}
</style>
