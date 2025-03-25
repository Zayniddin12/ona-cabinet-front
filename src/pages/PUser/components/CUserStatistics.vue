<template>
  <div class="user-stats">
    <div class="user-stats__head">
      <div class="user-stats-icon">
        <img v-if="data?.icon" :src="data?.icon" />
      </div>
      <p>{{ data?.value }}</p>
    </div>
    <h3 class="user-stats__title">{{ data?.title }}</h3>
  </div>
</template>
<script setup lang="ts">
import { IUserStatistics } from "@/pages/PUser/types";

interface Props {
  data: IUserStatistics;
}
const props = withDefaults(defineProps<Props>(), {});
</script>
<style lang="scss">
.user-stats {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #30a1db;
    margin-right: 8px;
    border-radius: 6px;
  }
  &__head {
    display: flex;
    align-items: center;
    margin-bottom: 18px;

    svg {
      display: inline-block;
      margin-right: 12px;
    }
    img {
      width: 24px;
      height: 24px;
    }

    p {
      font-weight: 700;
      font-size: 20px;
      line-height: 23px;
      color: #1c1f20;
    }
  }

  &__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: #a2abbe;
  }
}
</style>
