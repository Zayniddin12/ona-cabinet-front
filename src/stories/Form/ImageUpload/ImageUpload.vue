<template>
  <div class="image-uploader" :class="{ 'image-uploader-error': error }">
    <input
      :id="`file-${randomNumber}`"
      type="file"
      name="file"
      class="image-uploader__input"
      v-bind="{ accept }"
      @change="handleFile"
    />

    <Transition name="fade" mode="out-in">
      <div :key="image?.url" class="h-100 w-100">
        <div
          class="h-100 w-100"
          v-if="!image.url"
          :id="`holder-${randomNumber}`"
          @click="getFile"
        >
          <div class="image-uploader__add w-100 h-100">
            <inline-svg src="/src/assets/images/svg/photo.svg" />
          </div>
        </div>
        <div class="position-relative image-inner" v-else @click="removeImage">
          <img
            :src="image.url"
            class="image-uploader__image"
            alt="image-uploader__image"
          />
          <div class="image-uploader-remove">
            <inline-svg src="/assets/ona/svg/trash.svg" />
          </div>
        </div>
      </div>
    </Transition>
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
  edit?: boolean;
  accept: string;
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
  imageName.value = image.file.name;
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
  if (props.item && !props.edit) {
    const reader = new FileReader();
    if (props.item) {
      reader.readAsDataURL(props.item);
      reader.onload = (e) => {
        image.url = e.target?.result;
      };
    }
  } else if (props.item && props.edit) {
    image.url = props.item?.file;
  }
});
</script>

<style lang="scss" scoped>
.image-uploader {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px dashed #30a1db;
  width: 147px;
  height: 138px;
  background: #30a1db1a;
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
    justify-content: center;
  }
}

.image-uploader-remove {
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

.image-inner {
  width: 100%;
  height: 100%;
}

.image-inner:hover .image-uploader-remove {
  opacity: 1;
}

.image-uploader-error {
  border-color: #fa3232;
}
</style>

<style lang="scss">
.image-uploader-error {
  svg {
    path {
      stroke: #fa3232 !important;
    }
    rect {
      stroke: #fa3232 !important;
    }
  }
}
.image-uploader__add {
  svg {
    path {
      stroke: #30a1db;
    }
    rect {
      stroke: #30a1db;
    }
  }
}
</style>
