<template>
  <el-dialog lock-scroll class="family" v-model="showInner">
    <div class="family-body">
      <button class="close-button" @click="$emit('close')">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_318_19420)">
            <path
              d="M23.5425 8.45752L8.45752 23.5425M8.45752 8.45752L23.5425 23.5425"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_318_19420">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>

      <SFamilyMainSwiper
        v-bind="{ images }"
        :active="innerActive"
        @change="innerActive = $event"
      />

      <SFamilyThumbnail
        v-if="images?.length > 1"
        v-bind="{ images }"
        @change="innerActive = $event"
        :active="innerActive"
      />
    </div>
    <div v-if="images?.length > 1" class="family-swiper-button family-prev">
      <inline-svg src="/assets/ona/svg/arrow-stroke.svg" />
    </div>
    <div
      v-if="images?.length > 1"
      class="family-swiper-button family-next next"
    >
      <inline-svg src="/assets/ona/svg/arrow-stroke.svg" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import SFamilyMainSwiper from "@/pages/PUser/Single/components/Family/SFamilyMainSwiper.vue";
import SFamilyThumbnail from "@/pages/PUser/Single/components/Family/SFamilyThumbnail.vue";

interface Props {
  show?: boolean;
  active?: number;
  images?: {
    id: number;
    file: string;
    file_size: number;
    name: string;
  }[];
}

const props = withDefaults(defineProps<Props>(), {});

const innerActive = ref(0);

const emit = defineEmits(["close"]);

const showInner = ref(false);
watch(
  () => props.show,
  () => {
    showInner.value = props.show;
    innerActive.value = props.active;
  },
  {
    immediate: true,
  }
);

watch(
  () => showInner.value,
  () => {
    if (!showInner.value) {
      emit("close");
      innerActive.value = 0;
    }
  }
);
</script>

<style lang="scss" scoped>
.family-body {
  max-width: 740px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;

  .close-button {
    position: absolute;
    top: -32px;
    right: -32px;
    background: transparent !important;
    outline: none;
    border: none;

    &:hover {
      svg {
        path {
          stroke: #fa3232;
        }
      }
    }

    &:active {
      transform: scale(0.9);
    }
  }

  img {
    object-fit: cover;
  }
}

.family-swiper-button {
  background: #ffffff;
  border: 1px solid #eff2f5;
  box-shadow: 0 2px 8px rgba(56, 71, 109, 0.06);
  border-radius: 100px;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 34%;
  left: -40%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: transparent;
  }
}

.family-swiper-button.swiper-button-disabled {
  cursor: not-allowed;
  opacity: 80%;
  pointer-events: none;
}

.family-swiper-button.next {
  left: unset;
  right: -40%;
  transform: rotate(180deg);
}
</style>

<style lang="scss">
.family {
  background: transparent !important;
  position: relative;
  box-shadow: none;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    background: transparent !important;
  }
}
</style>
