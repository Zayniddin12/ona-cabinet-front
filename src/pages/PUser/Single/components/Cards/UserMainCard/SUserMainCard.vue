<template>
  <div class="user-main-card">
    <div v-if="title" class="user-main-card-header">
      <p class="user-main-card-header__title">{{ title }}</p>
      <slot name="actions" />
    </div>
    <div class="user-main-card-body" :class="wrapperClass">
      <slot name="body" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  wrapperClass?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
});
</script>

<style lang="scss" scoped>
.user-main-card {
  background: #fff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  padding-left: 24px;
  &-header {
    padding: 24px 24px 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__title {
      font-weight: 500;
      font-size: 18px;
      line-height: 21px;
      color: #1c1f20;
    }
  }
  &-body {
    padding-top: 20px;
    padding-bottom: 24px;
    border-top: 1px solid #eff2f5;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
</style>
