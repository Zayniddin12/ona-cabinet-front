<template>
  <el-dialog
    :title="$t(titleComputed)"
    width="480px"
    v-model="filterShow"
    class="filter-modal"
    :before-close="handleClose"
  >
    <div class="filter-modal__body">
      <div :key="filterShow">
        <label for="name"> {{ $t("user") }}</label>
        <SRemoteSearch
          v-model="values.participant"
          :error="$v?.participant.$error"
          id="name"
          label-key="full_name"
          value-key="id"
          :placeholder="$t('choose_user')"
          :options="participantList"
          :default-value="inputVal?.participant"
          observe
          @on-search="$emit('on-search', $event)"
          @fetch-data="$emit('fetch-more')"
        />
      </div>
      <div>
        <label for="name"> {{ $t("status") }} </label>

        <el-select
          v-model="values.status"
          :class="$v?.status.$error && 'error-select'"
          id="name"
          :placeholder="$t('choose_status')"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="w-50">
          <label for="name"> {{ $t("started_date") }} </label>

          <DatePicker
            v-model="values.start_date"
            :error="$v?.start_date.$error"
            :maxDate="values.end_date"
          />
        </div>
        <div class="w-50">
          <label for="name"> {{ $t("ended_date") }} </label>

          <DatePicker
            v-model="values.end_date"
            :error="$v?.end_date.$error"
            :minDate="values.start_date"
          />
        </div>
      </div>
      <SFormGroup :label="$t('files')">
        <FileUploader
          v-model="values.files"
          :class="{ error: $v?.file_id.$error }"
          @change="createFiles"
          @before="removeFiles"
        />
      </SFormGroup>
    </div>
    <div class="d-flex align-items-center justify-content-end gap-4 mt-7">
      <SButton
        class="w-50"
        variant="secondary"
        :text="add ? $t('clear') : $t('back')"
        @click="handleBackClose"
      />
      <SButton class="w-50" :text="$t('save')" @click="submitForm" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { computed, ref, unref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import DatePicker from "@/components/Datepicker/DatePicker.vue";
import { TForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import SButton from "@/stories/Common/Button/SButton.vue";
import FileUploader from "@/stories/Form/FileUploader/FileUploader.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";

const route = useRoute();
interface Props {
  show?: boolean;
  edit?: boolean;
  add?: boolean;
  data?: object;

  form?: TForm<any>;
  participantList?: any;
  tableData: object;
  value: object;
}

const props = defineProps<Props>();

const emit = defineEmits(["close", "submit", "fetch-more", "on-search"]);

const { t } = useI18n();
const { form } = unref(props);
const { values, $v } = form;
const inputVal = computed(() => props.value);
const filterShow = ref(false);

const submitForm = () => {
  if (values.participant.length > 4) {
    values.participant = +route.params.id;
  }
  $v.value.$touch();
  if (!$v.value.$invalid) {
    emit("submit");
  }
};

function createFiles(file: any) {
  const data = new FormData();
  data.append("url", file.raw);
  if (!values.files) {
    values.files = [];
  }
  ApiService.post("/api/v1/files/", data).then((res: any) => {
    values.file_id.push(res?.data?.id);
  });
}

function removeFiles(file: any) {
  let index = values.files.findIndex((el: any) => el?.uid === file.uid);
  values.file_id.splice(index, 1);
}

const titleComputed = computed(() => {
  if (props.add) {
    return "contract_add";
  } else {
    return "contract_edit";
  }
});

const statusList = [
  {
    value: 1,
    label: t("statusArr[0]"),
  },
  {
    value: 2,
    label: t("statusArr[1]"),
  },
  {
    value: 3,
    label: t("statusArr[2]"),
  },
];

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
  () => filterShow.value,
  () => {
    if (!filterShow.value) {
      emit("close");
      // values.participant = "";
      values.status = null;
      values.files = [];
      values.file_id = [];
      values.start_date = "";
      values.end_date = "";
      $v.value.$reset();
    }
  }
);

function handleClose(done: () => void) {
  ElMessageBox.confirm(t("before_close_text"), {
    confirmButtonText: t("confirmation"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(() => {
      done();
    })
    .catch(() => {});
}

function handleBackClose() {
  ElMessageBox.confirm(t("before_close_text"), {
    confirmButtonText: t("confirmation"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(() => {
      filterShow.value = false;
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
.filter-modal {
  &__body {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  .el-dialog__body {
    padding: 24px !important;
  }

  &__item {
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
</style>
