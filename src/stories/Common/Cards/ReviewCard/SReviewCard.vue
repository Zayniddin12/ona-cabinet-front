<template>
  <div class="review-card">
    <s-employee-card :item="item.user" card-type="commentCol" />
    <p class="review-card__text">{{ item.content }}</p>
  </div>
</template>

<script setup lang="ts">
import SEmployeeCard from "@/stories/Common/Cards/EmployeeCard/SEmployeeCard.vue";

interface Props {
  item: {
    user: {
      avatar: string;
      name: string;
      slug: string;
      resident: string;
      rating: number;
    };
    content: string;
  };
}
defineProps<Props>();
</script>

<style lang="scss">
.review-card {
  &:last-child {
    border: none;
    padding-bottom: 0;
  }
  &:first-child {
    padding-top: 0;
  }
  padding: 20px 0;
  border-bottom: 1px solid #efefef;
  &__text {
    margin-top: 12px;
    margin-bottom: 0;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #353d35;
  }
}
</style>
