<template>
  <router-link class="user-info" :to="`/dashboard/participants/${data?.id}`">
    <div class="user-info__header">
      <img
        v-if="data?.profile_photo?.file"
        :src="data?.profile_photo?.file"
        :alt="data?.userName"
        class="user-info__image"
      />
      <img
        v-else
        src="/assets/avatars/blank.png"
        :alt="data?.userName"
        class="user-info__image"
      />
      <div>
        <h3 class="line-clamp-1">{{ data?.full_name }}</h3>
        <p>ID: {{ data?.ID }}</p>
      </div>
    </div>
    <div class="user-info__body">
      <div class="user-info__body-item">
        <p>{{ $t("born_year") }}</p>
        <span> {{ parseDate(data?.birth_date) }} </span>
      </div>
      <div class="user-info__body-item">
        <p>{{ $t("region") }}</p>
        <span> {{ data?.living_region?.title }} </span>
      </div>
    </div>
  </router-link>
</template>
<script setup lang="ts">
import { parseDate } from "@/helpers";
import { IUser } from "@/pages/PUser/types";

interface Props {
  data: IUser;
}

defineProps<Props>();
</script>

<style lang="scss">
.user-info {
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 0 30px rgba(56, 71, 109, 0.09);
  border-radius: 12px;
  width: 260px;
  z-index: 10;

  &__image {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 10px;
    flex-shrink: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f1f4;
    margin-right: -16px;
    padding-right: 16px;

    h3 {
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
      color: #1c1f20;
      margin-bottom: 4px;

      width: 186px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; /* start showing ellipsis when 3rd line is reached */
      white-space: pre-wrap; /* let the text wrap preserving spaces */
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      font-weight: 400;
      font-size: 12px;
      line-height: 100%;
      color: #a2abbe;
    }
  }

  &__body {
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    &-item {
      p {
        font-weight: 500;
        font-size: 12px;
        line-height: 130%;
        color: #a2abbe;
        margin-bottom: 2px;
        text-align: start;
      }

      span {
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        color: #1c1f20;
      }
    }
  }
}
</style>
