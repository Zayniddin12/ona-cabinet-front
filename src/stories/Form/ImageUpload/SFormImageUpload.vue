<template>
  <div
    class="small-image-uploader"
    :class="{ 'small-image-uploader-error': error }"
  >
    <input
      :id="`file-${randomNumber}`"
      type="file"
      name="file"
      class="small-image-uploader__input"
      @change="handleFile"
    />

    <div
      class="h-100 w-100"
      v-if="!imageName"
      :id="`holder-${randomNumber}`"
      @click="getFile"
    >
      <div class="small-image-uploader__add w-100 h-100">
        <inline-svg src="/assets/ona/svg/docs-linear.svg" />
        <i18n-t
          tag="p"
          class="small-image-uploader__add__title"
          keypath="choose_file"
        >
          <template #choose>
            <span class="text-blue fw-bolder">{{ $t("choose") }}</span>
          </template>
        </i18n-t>
      </div>
    </div>
    <div class="small-image-inner" v-else>
      <p class="small-image-uploader__add__title fw-bolder">{{ imageName }}</p>
      <div class="remove-button" @click="removeImage">
        <inline-svg src="/assets/ona/svg/trash.svg" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  item?: any;
  small?: boolean;
  error?: boolean;
  desc?: string;
  image?: string;
  errorLabel?: string;
}
const randomNumber = ref(0);
const emit = defineEmits(["upload", "remove"]);
const { t } = useI18n();
const props = withDefaults(defineProps<Props>(), {
  item: "",
  small: false,
  error: false,
  desc: "",
  errorLabel: "",
});
const image = reactive({
  url: props?.image,
  file: null,
});
let imageName = ref("");
const handleFile = (event: any) => {
  image.file = event.target.files[0];
  imageName.value = image?.file?.name;
  const reader = new FileReader();
  if (event.target.files[0]) {
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e) => {
      image.url = e.target?.result;
    };
    send();
  }
};
const getFile = () => {
  const input = document.getElementById(`file-${randomNumber.value}`);
  input?.click();
};
const removeImage = () => {
  return ElMessageBox.confirm(
    t("you_sure_wanna_delete_this_file"),
    t("delete_file"),
    {
      type: "warning",
      confirmButtonText: t("delete"),
      cancelButtonText: t("cancel"),
    }
  ).then(
    () => {
      image.file = null;
      image.url = null;
      imageName.value = "";
      emit("remove");
    },
    () => false
  );
};
const send = () => {
  emit("upload", image?.file);
};
onMounted(() => {
  randomNumber.value = Math.floor(Math.random() * 101);
  if (props.item) {
    const reader = new FileReader();
    if (props.item) {
      imageName.value = props?.item?.name;
    }
  }
});
</script>

<style lang="scss" scoped>
.small-image-uploader {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px dashed #a2abbe5c;
  height: 42px;
  padding: 0 10px;
  border-radius: 8px;

  &__input {
    width: 0;
    height: 0;
    position: absolute;
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__inner {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    gap: 16px;
  }
  &__image {
    object-fit: cover;
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
  &__add {
    display: flex;
    align-items: center;
    gap: 8px;
    &__title {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #1c1f20;
    }
  }
}

.small-image-uploader-remove {
  background: #1b1b2854;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms;
}

.small-image-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.small-image-uploader-error {
  border-color: #fa3232;
}

.remove-button {
  width: 32px;
  height: 32px;
  background: #ecf5fc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms;
  &:hover {
    background: #cddae5;
  }
}
</style>
