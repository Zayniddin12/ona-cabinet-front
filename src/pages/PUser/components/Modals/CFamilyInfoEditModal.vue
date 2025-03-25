<template>
  <ElDialog
    v-bind="{ width }"
    v-model="filterShow"
    :title="$t('about_family')"
    class="filter-modal"
  >
    <div>
      <SUserFormWrapper>
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
          <FileUploader
            @change="createFiles($event, 'family_image', 'family_photo')"
            @before="removeFiles($event, 'family_image', 'family_photo')"
            v-model="values.family_image"
            custom-class="have-file"
          />
        </SFormGroup>
        <SFormGroup :label="$t('lifestyle_condition_image')">
          <FileUploader
            @change="
              createFiles(
                $event,
                'life_condition_image',
                'living_condition_files'
              )
            "
            @before="
              removeFiles(
                $event,
                'life_condition_image',
                'living_condition_files'
              )
            "
            v-model="values.life_condition_image"
            custom-class="have-file"
          />
        </SFormGroup>
      </SUserFormWrapper>
      <div class="d-flex align-items-center justify-content-end gap-4 mt-6">
        <SButton
          type="submit"
          @click="submit"
          class="w-25"
          :class="{ 'w-100': full }"
          :text="$t('edit')"
          :loading="loading"
        />
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { mainData } from "@/pages/PUser/components/Add/data/forms";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import { IFamilyInfo } from "@/pages/PUser/types/participant";
import SButton from "@/stories/Common/Button/SButton.vue";
import FileUploader from "@/stories/Form/FileUploader/FileUploader.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  familyInfo?: IFamilyInfo;
  width?: string;
  bodyClass?: string;
  full?: boolean;
  wrapperStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "80%",
});

// eslint-disable-next-line no-undef
const { form } = unref(props);
const { values, $v } = form;
const toast = useToast();
const { t } = useI18n();

const filterShow = ref(false);
const route = useRoute();
const router = useRouter();
// ******* EMITS *******
const emit = defineEmits(["close"]);

watch(
  () => props.show,
  () => {
    filterShow.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => props.familyInfo,
  (val) => {
    values.year = val?.year;
    values.family = val?.family_info;
    values.lifestyle = val?.lifestyle;
    values.family_image = val?.family_photo;
    values.life_condition_image = val?.living_condition_files;
    mainData.values["family_photo"] = val?.family_photo?.map((i) => i.id);
    mainData.values["living_condition_files"] =
      val?.living_condition_files?.map((i) => i.id);
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => filterShow.value,
  () => {
    if (!filterShow.value) {
      emit("close");
    }
  }
);

const loading = ref(false);

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
  let index = values[innerValue].findIndex(
    (el: any) => el?.id === file.id || el?.uid === file.uid
  );
  mainData.values[mainValue].splice(index, 1);
}

function showResponseErrors(err: any) {
  if (err || err?.length) {
    toast.error(t(err[0].error), {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function submit() {
  loading.value = true;
  ApiService.put(
    "api/v2/participants/participantFamilyInfoUpdate/" +
      props.familyInfo?.id +
      "/",
    {
      year: values.year,
      family_info: values.family,
      lifestyle: values.life_condition,
      ...mainData.values,
    }
  )
    .then(() => {
      router.push(`/dashboard/participants/${route.params.id}/family`);
      $v.value.$reset();
      setTimeout(() => {
        window.location.reload();
      }, 900);
    })
    .catch((err) => {
      showResponseErrors(err?.response?.data?.errors);
    })
    .finally(() => (loading.value = false));
  emit("close");
}
</script>

<style lang="scss">
.filter-modal {
  .el-dialog__body {
    padding: 14px 24px 24px !important;
  }

  &__item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #191e36;
      opacity: 0.7;
      margin-bottom: 12px;
    }
  }
}

.condition-select-loader {
  background: transparent !important;
}
</style>
