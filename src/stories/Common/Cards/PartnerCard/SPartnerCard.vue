<template>
  <div class="d-flex align-items-center partner">
    <!--begin::Avatar-->
    <div class="symbol symbol-40px me-5 partner__img">
      <img :src="item.avatar" class="" alt="" />
    </div>
    <!--end::Avatar-->

    <!--begin::Text-->
    <div class="d-flex flex-column">
      <router-link
        :to="`/dashboard/partners/${item.slug}`"
        class="partner__name"
      >
        {{ item.name }}
      </router-link>
      <span class="partner__desc">{{ item.description }}</span>
    </div>
    <!--end::Text-->
  </div>
</template>

<script setup lang="ts">
interface Props {
  item: {
    avatar: string;
    name: string;
    description: string;
    slug: string;
  };
}
defineProps<Props>();
</script>

<style lang="scss">
.partner {
  &__img {
    border: 1px solid #eff2f5;
    border-radius: 8px;
    overflow: hidden;
  }
  &__name {
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
    color: #353d35;
    margin-bottom: 2px;
    transition: 0.3s color;
    &:hover {
      color: #7dba28;
    }
  }
  &__desc {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #7d867d;
  }
}
</style>
