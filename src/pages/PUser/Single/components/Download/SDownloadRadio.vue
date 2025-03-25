<template>
  <div class="download-radio i-bg-gray-100" :class="{ active: active }">
    <div class="d-flex align-items-center justify-content-between">
      <inline-svg :src="info?.icon" />

      <transition name="fade">
        <inline-svg v-if="active" src="/assets/ona/svg/done.svg" />
      </transition>
    </div>

    <p class="download-radio__title">{{ info?.title }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  active?: boolean;

  info: {
    title: string;
    icon: string;
  };
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.download-radio {
  background: #f5f7f7;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 16px;
  cursor: pointer;
  transition: all 200ms ease-in;

  &__title {
    margin-top: 12px;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #1c1f20;
  }

  &:hover {
    border-color: #00a3ff;
  }
}

.active {
  background: #ffffff !important;
  border-color: #30a1db;
}
</style>
