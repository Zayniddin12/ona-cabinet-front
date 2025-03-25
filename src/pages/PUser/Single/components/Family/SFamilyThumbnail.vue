<template>
  <div class="slider-thumbnail">
    <div class="slider-thumbnail-blurred" />
    <Swiper v-bind="settings" @click="changeSlide" @swiper="onInit">
      <SwiperSlide
        v-for="(item, index) in images"
        :key="index"
        class="slider-thumbnail-slide w-100 h-100"
        :class="{ 'active-slider-family': active === index }"
      >
        <img
          v-if="item?.name?.substring(item?.name?.length - 4) === '.pdf'"
          src="/assets/ona/image/pdf.png"
          alt=""
          class="img-blurred"
        />
        <img v-else :src="item?.file" alt="slide" class="img-blurred" />
        <div class="w-100 h-100 slider-thumbnail-slide-img">
          <img
            v-if="item?.name?.substring(item?.name?.length - 4) === '.pdf'"
            src="/assets/ona/image/pdf.png"
            alt=""
          />
          <img v-else :src="item?.file" alt="slide" />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import "swiper/css";

import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";

interface Props {
  images: {
    file: string;
    name: string;
  }[];
  active?: number;
}

withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["change"]);
const settings = {
  slidesPerView: "auto",
  spaceBetween: 12,
};

const imageSlider = ref();

function onInit(swiper: any) {
  imageSlider.value = swiper;
}

function changeSlide(e: any) {
  emit("change", e?.clickedIndex);
}
</script>

<style scoped lang="scss">
.slider-thumbnail {
  margin-top: 64px;
  background: rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 12px;
  position: relative;
  user-select: none;
  &-blurred {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(6px);
    background: rgba(0, 0, 0, 0.16);
    top: 0;
    left: 0;
  }
  &-slide {
    width: 95px !important;
    height: 95px !important;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: all 300ms ease-in;

    &-img {
      position: relative;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-img img {
      width: 100%;
      object-fit: cover;
    }

    .img-blurred {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(6px);
    }
  }
}

.active-slider-family {
  border: 2px solid #30a1db;
}

pre {
  color: #fff !important;
}
</style>
