<template>
  <div class="user-doc">
    <div>
      <PreloaderSkeleton
        width="100%"
        v-bind="{ loading }"
        height="20px"
        preloader-class="mb-1"
      >
        <div>
          <div v-if="file?.name?.includes('pdf')">
            <img src="/assets/svg/files/pdf.svg" alt="" />
          </div>
          <div v-else class="family-image-slide-img">
            <img
              @click="showModal = true"
              :src="file?.file || file.url"
              :alt="file?.name"
              class="w-100 h-100 object-contain"
            />
          </div>
          <a
            :href="file?.file || file?.url"
            target="_blank"
            rel="noopener"
            download
            class="user-doc__title transition-200 line-clamp-1"
            >{{ file?.name }}</a
          >
        </div>
      </PreloaderSkeleton>
    </div>
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

const showModal = ref(false);

// Convert Bytes to "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"
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

// Convert KB to "MB", "GB", "TB", "PB", "EB", "ZB", "YB"

// function formatKB(kb: number, decimals = 2) {
//   if (kb === 0) {
//     return "0 KB";
//   }
//   const base = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
//   const i = Math.floor(Math.log(kb) / Math.log(base));
//   return parseFloat((kb / Math.pow(base, i)).toFixed(dm)) + " " + sizes[i];
// }
</script>

<style lang="scss" scoped>
.user-doc {
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 12px;

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
    margin-bottom: 4px;

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
  width: 300px;
  height: 300px;
}
</style>
