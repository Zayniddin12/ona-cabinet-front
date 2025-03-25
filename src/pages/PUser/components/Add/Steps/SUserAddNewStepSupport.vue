<template>
  <div>
    <SUserFormWrapper
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
          v-if="index > 0"
          class="relative-block d-flex align-items-center justify-content-between col-span-2"
        >
          <p class="relative-block__title">
            {{ $t("history_of_support") }} {{ index + 1 }}
          </p>
          <inline-svg
            src="/assets/ona/svg/trash-gray.svg"
            class="hover-trash cursor-pointer"
            @click="removeForm(+index)"
          />
        </div>

        <SFormGroup :label="$t('support_type')" required>
          <el-select
            v-model="support.support_type_list"
            multiple
            :class="{ error: isHaveEmptyField && !support.support_type_list }"
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
            v-maska="moneyMask()"
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
          <template #labelOpposite>
            <div
              v-if="support.file_petition?.length < 3"
              @click="addInput(+index, 'file_petition')"
              class="d-flex align-items-center gap-21"
            >
              <img src="/assets/ona/svg/plus-solid.svg" alt="plus" />
              <p class="fs-5 lh-16 text-blue fw-bold cursor-pointer">
                {{ $t("add_new") }}
              </p>
            </div>
          </template>
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-for="(petition, k) in support.file_petition"
              :key="k"
              v-model="petition.value"
              custom-class="have-file"
              @change="createFiles('file_petition', $event, +index)"
              @before="removeFiles('photo_cost', $event, +index)"
            >
              <template #suffix>
                <div
                  v-if="k !== 0"
                  class="delete-input"
                  @click="removeInput(+index, 'file_petition', +k)"
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
            </FileUploader>
          </div>
        </SFormGroup>

        <SFormGroup :label="$t('photo_report')">
          <template #labelOpposite>
            <div
              v-if="support.photo_report?.length < 3"
              @click="addInput(+index, 'photo_report')"
              class="d-flex align-items-center gap-21"
            >
              <img src="/assets/ona/svg/plus-solid.svg" alt="plus" />
              <p class="fs-5 lh-16 text-blue fw-bold cursor-pointer">
                {{ $t("add_new") }}
              </p>
            </div>
          </template>
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-for="(report, k) in support.photo_report"
              :key="k"
              v-model="report.value"
              custom-class="have-file"
              @change="createFiles('photo_report', $event, +index)"
              @before="removeFiles('photo_cost', $event, +index)"
            >
              <template #suffix>
                <div
                  v-if="k !== 0"
                  class="delete-input"
                  @click="removeInput(+index, 'photo_report', +k)"
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
            </FileUploader>
          </div>
        </SFormGroup>

        <SFormGroup :label="$t('photo_cost')">
          <template #labelOpposite>
            <div
              v-if="support.photo_cost?.length < 3"
              @click="addInput(+index, 'photo_cost')"
              class="d-flex align-items-center gap-21"
            >
              <img src="/assets/ona/svg/plus-solid.svg" alt="plus" />
              <p class="fs-5 lh-16 text-blue fw-bold cursor-pointer">
                {{ $t("add_new") }}
              </p>
            </div>
          </template>
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-for="(cost, k) in support.photo_cost"
              :key="k"
              v-model="cost.value"
              custom-class="have-file"
              @change="createFiles('photo_cost', $event, +index)"
              @before="removeFiles('photo_cost', $event, +index)"
            >
              <template #suffix>
                <div
                  v-if="k !== 0"
                  class="delete-input"
                  @click="removeInput(+index, 'photo_cost', +k)"
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
            </FileUploader>
          </div>
        </SFormGroup>

        <SFormGroup :label="$t('about_help')">
          <template #labelOpposite>
            <div
              v-if="support.about_help?.length < 3"
              @click="addInput(+index, 'about_help')"
              class="d-flex align-items-center gap-21"
            >
              <img src="/assets/ona/svg/plus-solid.svg" alt="plus" />
              <p class="fs-5 lh-16 text-blue fw-bold cursor-pointer">
                {{ $t("add_new") }}
              </p>
            </div>
          </template>
          <div class="d-flex flex-column gap-22">
            <FileUploader
              v-for="(report, k) in support.about_help"
              :key="k"
              v-model="report.value"
              custom-class="have-file"
              @change="createFiles('about_help', $event, +index)"
              @before="removeFiles('photo_cost', $event, +index)"
            >
              <template #suffix>
                <div
                  v-if="k !== 0"
                  class="delete-input"
                  @click="removeInput(+index, 'about_help', +k)"
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
            </FileUploader>
          </div>
        </SFormGroup>
      </div>
      <div>
        <SButton class="w-44" :text="$t('add_help')" @click="addForm">
          <template #pre-icon>
            <svg
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
              />
            </svg>
          </template>
        </SButton>
      </div>
    </SUserFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref } from "vue";

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
  isHaveEmptyField?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const { form } = unref(props);
const { values } = form;

const support_types = ref([]);

const addInput = (itemIndex: number, property: string) => {
  values[itemIndex][property].push({ values: "" });
};

const removeInput = (itemIndex: number, property: string, index: number) => {
  values[itemIndex][property].splice(index, 1);
};

const addForm = () => {
  values.push({
    all_price: "",
    number: "",
    support_date: "",
    file_petition: [{}],
    file_petition_id: [],
    photo_report: [{}],
    photo_report_id: [],
    photo_cost: [{}],
    photo_cost_id: [],
    about_help: [{}],
    about_help_id: [],
  });
};

function createFiles(file_name: string, file: any, index: number) {
  const data = new FormData();

  data.append("url", file.raw);

  ApiService.post("/api/v1/files/", data).then((res: any) => {
    values[index][`${file_name}_id`].push(res?.data?.id);
  });
}

function removeFiles(file_name: string, file: any, index: number) {
  // console.log("file uid: ", file.uid, index);
  // let i = values[index][`${file_name}_id`].findIndex(
  //   (el: any) => el?.uid === file.uid
  // );
  // values[index][`${file_name}_id`].splice(i, 1);
}

const removeForm = (index: number) => {
  values.splice(index, 1);
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
