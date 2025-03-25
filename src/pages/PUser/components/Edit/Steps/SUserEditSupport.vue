<template>
  <div>
    <SUserFormWrapper
      :key="values.length"
      :title="$t('history_of_support')"
      :body-class="[{ 'pt-0': !values.length }, 'outer-body']"
    >
      <div
        v-for="(support, index) in values"
        :key="index"
        class="relatives col-span-2"
        :class="[
          { 'relative-second': index !== 0 },
          { 'border-bottom pb-5': index === values.length - 1 },
        ]"
      >
        <div
          v-if="values.length > 1"
          class="relative-block d-flex align-items-center justify-content-between col-span-2"
        >
          <p class="relative-block__title">
            {{ $t("history_of_support") }} {{ index + 1 }}
          </p>
          <inline-svg
            src="/assets/ona/svg/trash-gray.svg"
            class="hover-trash cursor-pointer"
            @click="removeForm(+index, +support?.id)"
          />
        </div>
        <SFormGroup :label="$t('support_type')" required>
          <el-select
            v-if="support?.support_type_list?.length"
            multiple
            v-model="support.support_type_list"
            :placeholder="$t('select_support_type')"
          >
            <el-option
              v-for="item in support_types"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-else
            v-model="support.support_type_list"
            multiple
            :placeholder="$t('select_support_type')"
          >
            <el-option
              v-for="item in support_types"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </SFormGroup>

        <SFormGroup :label="$t('amount_of_money')">
          <SInput
            v-model="support.all_price"
            :placeholder="$t('enter_amount')"
            v-maska="moneyMask()"
          />
        </SFormGroup>

        <SFormGroup :label="$t('order_number')">
          <SInput
            v-model="support.number"
            :placeholder="$t('enter_order_number')"
          />
        </SFormGroup>

        <SFormGroup :label="$t('payment_day')">
          <el-date-picker
            class="date-picker w-100"
            v-model="support.support_date"
            :placeholder="$t('enter_payment_day')"
            type="date"
            format="DD.MM.YYYY"
          />
        </SFormGroup>
        <SFormGroup :label="$t('command_file')">
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-model="support.file_petition"
              custom-class="have-file"
              @change="createFiles('file_petition', $event, +index)"
              @before="removeFiles('file_petition', $event, +index)"
            />
          </div>
        </SFormGroup>

        <SFormGroup :label="$t('photo_report')">
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-model="support.photo_report"
              custom-class="have-file"
              @change="createFiles('photo_report', $event, +index)"
              @before="removeFiles('photo_report', $event, +index)"
            />
          </div>
        </SFormGroup>

        <SFormGroup :label="$t('photo_cost')">
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-model="support.photo_cost"
              custom-class="have-file"
              @change="createFiles('photo_cost', $event, +index)"
              @before="removeFiles('photo_cost', $event, +index)"
            />
          </div>
        </SFormGroup>

        <SFormGroup :label="$t('about_help')">
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-model="support.about_help"
              custom-class="have-file"
              @change="createFiles('about_help', $event, +index)"
              @before="removeFiles('about_help', $event, +index)"
            />
          </div>
        </SFormGroup>
      </div>
      <div>
        <SButton class="w-44" :text="$t('add_help')" @click="addForm">
          <template #pre-icon
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M7 3.0625V10.9375"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.0625 7H10.9375"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
          ></template>
        </SButton>
      </div>
    </SUserFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, unref } from "vue";

import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { moneyMask } from "@/helpers";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import FileUploader from "@/stories/Form/FileUploader/FileUploader.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";

interface Props {
  form?: TForm<any>;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["add-new-form", "delete-form"]);
const { form } = unref(props);
const values = reactive(form?.values);
const support_types = ref([]);

const disabledDate = (time: Date) => {
  const date = new Date();
  const previousDate = date.setDate(date.getDate() - 1);
  return time.getTime() < previousDate;
};

const addForm = () => {
  emit("add-new-form", support_types.value[0]);
};

function createFiles(file_name: string, file: any, index: number) {
  const data = new FormData();

  data.append("url", file.raw);

  ApiService.post("/api/v1/files/", data).then((res: any) => {
    values[index][`${file_name}_id`].push(res?.data?.id);
  });
}

function removeFiles(file_name: string, file: any, index: number) {
  let i = values[index][`${file_name}_id`].findIndex(
    (el: any) => el?.uid === file.uid
  );
  values[index][`${file_name}_id`].splice(i, 1);
}

const removeForm = (index: number, support_id: number) => {
  values.splice(index, 1);
  emit("delete-form", support_id);
};

onMounted(() => {
  ApiService.get(`/api/v2/support-type-list/`).then((res) => {
    support_types.value = res.data.results;
  });
});
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
.el-select.select-error .el-input .el-input__wrapper {
  border: 1px solid red !important;
}
</style>
