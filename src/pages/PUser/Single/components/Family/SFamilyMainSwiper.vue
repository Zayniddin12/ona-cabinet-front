<template>
  <div class="family-main">
    <Swiper
      v-bind="settings"
      class="family-main-slider"
      @swiper="onInit"
      @activeIndexChange="sliderChange"
    >
      <SwiperSlide
        v-for="(item, index) in images"
        :key="index"
        class="family-main-slider-slide w-100 h-100"
      >
        <div class="w-100 h-100">
          <a
            v-if="item?.name?.substring(item?.name?.length - 4) === '.pdf'"
            :href="item?.file"
            target="_blank"
            rel="noopener"
          >
            <img src="/assets/ona/image/pdf.png" alt="" />
          </a>
          <img v-else :src="item?.file" alt="slide" />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import "swiper/css";
import "swiper/css/effect-fade";

import { Keyboard, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref, watch } from "vue";

interface Props {
  images: {
    file: string;
    name: string;
  }[];
  active?: number;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["change"]);
const imageSlider = ref();

const settings = {
  grabCursor: true,
  watchSlidesProgress: true,
  spaceBetween: 24,
  navigation: {
    nextEl: ".family-next",
    prevEl: ".family-prev",
  },
  keyboard: { enabled: true },
  modules: [Navigation, Keyboard],
};

function sliderChange(e: any) {
  emit("change", e?.activeIndex);
}

function onInit(swiper: any) {
  imageSlider.value = swiper;
}

watch(
  () => props.active,
  () => {
    setTimeout(() => {
      imageSlider.value.slideTo(props.active);
    }, 100);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.family-main {
  max-width: 740px;
  width: 100%;
  max-height: 492px;
  height: 100%;

  &-slider {
    width: 100%;
    max-width: 740px;
    height: 100%;

    &-slide {
      background: #060707;
      border-radius: 12px;
      max-width: 740px;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        max-height: 492px;
        object-fit: contain;
      }
    }
  }
}
</style>
