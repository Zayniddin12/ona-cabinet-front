<template>
  <RouterLink
    :to="`/dashboard/participants/recent-changes/${card?.id}`"
    class="text-dark-black"
  >
    <div class="last-change-card transition-200">
      <div class="last-change-card-body" :class="{ 'border-none': isLast }">
        <div>
          <p class="last-change-card__title">{{ card?.object_repr }}</p>
          <div class="date">
            <p class="date__title">
              {{ dayjs(card?.timestamp).format("DD.MM.YYYY") }}
            </p>
            <div v-if="index === 0" class="date-stop" />
            <p v-if="index === 0" class="date__title text-blue">
              {{ $t("last_change") }}
            </p>
          </div>
        </div>
        <inline-svg src="/assets/ona/svg/eye.svg" />
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

interface Props {
  card: {
    action: number;
    id: number;
    object_repr: string;
    participant: {
      full_name: string;
      id: number;
      point: number;
      responsible_person: string;
    };
    timestamp: Date;
  };
  index?: number;
  isLast?: boolean;
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.last-change-card {
  padding-left: 24px;
  &-body {
    padding: 12px 20px 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5eaee;
  }
  &:hover {
    background: #f3fafd;
  }
  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    display: flex;
    align-items: center;
    color: #1c1f20;
  }

  .date {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    &-stop {
      background: #a2abbe;
      width: 2.39px;
      height: 2.55px;
      border-radius: 9999px;
    }
    &__title {
      font-weight: 400;
      font-size: 12px;
      line-height: 100%;
      color: #a2abbe;
    }
  }
}
</style>
