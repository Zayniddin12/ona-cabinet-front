<template>
  <div class="form-wrapper">
    <div v-if="title" class="form-wrapper-header">
      <p class="form-wrapper-header__title">{{ title }}</p>
      <div style="padding-right: 24px">
        <slot name="actions" />
      </div>
    </div>
    <div class="form-wrapper-body" :class="bodyClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  bodyClass?: string;
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.form-wrapper {
  background: #fff;
  padding: 4px 0 4px 24px;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  &-header {
    padding: 20px 0;
    border-bottom: 1px solid #eff2f5;
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
    padding: 20px 24px 20px 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
</style>
