<template>
  <div class="family-image">
    <div
      v-for="(item, index) in images?.length > 4 ? images.slice(0, 4) : images"
      :key="index"
      class="family-image-slide w-100 h-100"
      @click="$emit('open', index)"
    >
      <img :src="item?.file" class="img-blurred" alt="slide" />
      <div class="family-image-slide-absolute" />
      <div class="w-100 h-100 family-image-slide-img">
        <img
          :src="item?.file"
          :alt="item?.name"
          class="w-100 h-100 object-contain"
        />
      </div>
    </div>

    <div
      v-if="images && images?.length > 4"
      class="family-image-last transition-200"
      @click="$emit('open', 0)"
    >
      <img
        :src="images[4]?.file"
        alt="image"
        class="w-100 h-100 transition-200"
      />
      <div class="family-image-last-overlay transition-200">
        <p class="family-image-last-overlay__title transition-200">
          {{ images?.length - 4 }}+
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  images: {
    image: string;
  }[];
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.family-image {
  display: flex;
  align-items: center;
  gap: 12px;
  &-slide {
    width: 95px !important;
    height: 95px !important;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: all 150ms ease-out;
    border: 2px solid transparent;
    &-absolute {
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(28, 31, 32, 0.2);
      width: 100%;
      height: 100%;
      z-index: 10;
    }
    &-img {
      position: relative;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .img-blurred {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(6px);
    }
  }

  &-last {
    width: 95px;
    height: 95px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    &:hover {
      border-color: #30a1db;
    }
    img {
      object-fit: cover;
      filter: blur(6px);
    }

    &-overlay {
      background: rgba(28, 31, 32, 0.2);
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;

      &__title {
        font-weight: 500;
        font-size: 24px;
        line-height: 28px;
        text-align: center;
        color: #ffffff;
      }
    }
  }
}

.family-image-slide:hover {
  border-color: #30a1db;
}
</style>
