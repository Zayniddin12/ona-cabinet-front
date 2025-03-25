<template>
  <el-upload
    class="file-uploader"
    :class="[
      fileList?.length && 'have-file',
      customClass,
      error ? 'error' : '',
    ]"
    drag
    :auto-upload="false"
    action="#"
    multiple
    accept="image/*, .pdf"
    v-model:file-list="fileList"
    limit="30"
    @on-change="$emit('change', $event)"
    @on-remove="$emit('remove')"
    :before-remove="beforeRemove"
  >
    <div class="file-uploader__wrapper w-100 h-100">
      <inline-svg src="/assets/ona/svg/docs-linear.svg" />

      <div>
        <p class="file-uploader__title">{{ $t("choose_file_title") }}</p>

        <i18n-t tag="p" class="file-uploader__text" keypath="choose_file">
          <template #choose>
            <span class="text-blue fw-bolder">{{ $t("choose") }}</span>
          </template>
        </i18n-t>
      </div>

      <span
        class="h-100 d-flex align-items-center justify-content-center"
        style="margin-left: auto"
        :class="suffixClass"
      >
        <slot name="suffix" />
      </span>
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { ElMessageBox, UploadFile } from "element-plus";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  modelValue?: any;
  customClass?: string;
  suffixClass?: string;
  error?: boolean;
}

const { t } = useI18n();

const props = defineProps<Props>();

const fileList = ref<UploadFile[]>([]);

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "before", value: any): void;
}>();

watch(
  () => fileList.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  }
);

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      fileList.value = props.modelValue;
    }
  },
  {
    immediate: true,
  }
);

const beforeRemove = (file: any) => {
  return ElMessageBox.confirm(
    t("you_sure_wanna_delete_this_file"),
    t("delete_file"),
    {
      type: "warning",
      confirmButtonText: t("delete"),
      cancelButtonText: t("cancel"),
    }
  ).then(
    () => emit("before", file),
    () => false
  );
};
</script>

<style lang="scss">
.file-uploader {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;

  &.error .el-upload-dragger {
    border: 2px dashed red !important;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  &.have-file {
    .el-upload-dragger {
      padding: 10px !important;
    }

    .file-uploader__wrapper {
      flex-direction: row;

      svg {
        width: 20px;
        height: 20px;
        margin-bottom: 0;
      }

      .file-uploader__title {
        display: none;
      }
    }
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #1c1f20;
  }

  &__text {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #a2abbe;
  }

  .el-upload-dragger {
    padding: 20px !important;
  }

  .el-upload-list {
    margin-top: 0;
  }

  .el-upload-list__item {
    background: #f3f6f9;
    border-radius: 6px;

    .el-icon {
      svg {
        width: 20px;
        height: 20px;
        margin-bottom: 0;
      }
    }
  }

  .el-upload-list__item-info {
    padding: 11px 10px;
    max-width: 200px;
  }

  .el-icon--close {
    right: 20px;

    &::before {
      content: "";
      width: 20px;
      height: 20px;
      display: block;
      position: absolute;
      background-image: url("/assets/ona/svg/trash-gray.svg");
      background-repeat: no-repeat;
    }

    svg {
      display: none;
    }
  }

  .el-icon--document {
    margin-right: 10px;

    svg {
      display: none;
    }

    &::before {
      content: "";
      width: 20px;
      height: 20px;
      display: block;
      position: absolute;
      background-image: url("/assets/ona/svg/docs-stroke.svg");
      background-repeat: no-repeat;
    }
  }

  .el-upload-list__item-file-name {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;

    color: #1c1f20;
  }
}
</style>
