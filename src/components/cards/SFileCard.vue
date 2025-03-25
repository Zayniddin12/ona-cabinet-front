<template>
  <div>
    <PreloaderSkeleton
      width="100%"
      v-bind="{ loading }"
      height="20px"
      preloader-class="mb-1"
    >
      <div class="user-doc">
        <div class="user-doc-container">
          <div class="family-image-slide-img">
            <img
              @click="showModal = true"
              src="/assets/icons/static/file.svg"
              :alt="file?.name"
              class="w-100 h-100 object-contain"
            />
          </div>
          <div class="user-doc-info">
            <div>
              <a
                :href="file?.file || file?.url"
                target="_blank"
                rel="noopener"
                download
                class="user-doc__title transition-200 line-clamp-7"
                >{{ file?.name }}</a
              >
            </div>
            <div>{{ calcBytes(file.file_size) }}</div>
          </div>
        </div>
      </div>
    </PreloaderSkeleton>

    <SFamilyLightbox
      v-bind="{ show: showModal }"
      :images="[file]"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";
import SFamilyLightbox from "@/pages/PUser/Single/components/Family/SFamilyLightbox.vue";

interface Props {
  file: {
    id: number;
    name: string;
    type: string;
    file: string;
    file_size: number;
  };
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  file: () => {
    return {
      id: 1,
      file: "string",
      name: "string",
      type: "string",
      file_size: 1201100,
    };
  },
});
function calcBytes(bytes: number, decimals = 2) {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const showModal = ref(false);
</script>

<style scoped lang="scss">
.user-doc {
  display: flex;
  align-items: center;

  &-container {
    background-color: #f5f7f7;
    display: flex;
    padding: 12px;
    width: 317px;
    border-radius: 11px;
    align-items: center;
    gap: 16px;
  }
  &-info {
    display: flex;
    flex-direction: column;
  }

  &-icon {
    width: 42px;
    height: 42px;
    background: #30a1db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    line-height: 125%;
    color: #1c1f20;

    &:hover {
      color: #30a1db;
    }
  }

  &__subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: #1c1f20;
  }
}

.family-image-slide-img {
  display: flex;
  align-items: center;
  width: 42px;
  padding: 7px;
  border-radius: 6px;
  background-color: #30a1db;
}
</style>
