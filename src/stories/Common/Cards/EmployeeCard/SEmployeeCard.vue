<template>
  <div
    class="d-flex align-items-center employee"
    :class="`employee_${cardType}`"
  >
    <!--begin::Avatar-->
    <div v-if="!withoutImage" class="employee__img">
      <img :src="item.avatar" :alt="item.name" />
    </div>
    <!--end::Avatar-->

    <!--begin::Text-->
    <div class="d-flex flex-column">
      <router-link :to="item.slug" class="employee__name">
        {{ item.name }}
      </router-link>
      <div
        v-if="cardType === 'transaction' || cardType === 'commentCol'"
        class="employee__desc"
      >
        <span v-if="cardType === 'transaction'" class="employee__date">
          {{ moment(item.date).format("DD.MM.YYYY") }}
        </span>
        <div v-if="cardType === 'commentCol'" class="employee__rating">
          <inline-svg
            v-for="i in 5"
            :key="i"
            src="/assets/svg/common/rating-star.svg"
            :class="{ active: i <= item.rating }"
            class="star"
          />
        </div>
        <div class="dot" :class="{ dot_green: cardType === 'commentCol' }" />
        <span class="employee__resident">{{ item.resident }}</span>
      </div>
      <div v-if="cardType === 'commentRow'" class="employee__desc">
        <span class="employee__resident">{{ item.resident }}</span>
        <span class="employee__date">
          {{ moment(item.date).format("DD.MM.YYYY, hh:mm") }}
        </span>
      </div>
      <div v-if="!cardType" class="employee__desc">
        <inline-svg
          class="gender-icon"
          v-if="!cardType"
          :src="`/assets/svg/common/${item.gender}.svg`"
        />
        <span v-if="!cardType">{{ $t(item.gender) }}</span>
      </div>
    </div>
    <!--end::Text-->
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

interface Props {
  item: {
    avatar: string;
    name: string;
    slug: string;
    description?: string;
    gender?: "male" | "female";
    resident?: string;
    date?: string;
    rating?: number;
  };
  withoutImage?: boolean;
  cardType?: "commentRow" | "commentCol" | "transaction";
}
defineProps<Props>();
</script>

<style lang="scss">
.employee {
  &__img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &_transaction .employee__img,
  &_commentRow .employee__img {
    width: 44px;
    height: 44px;
  }
  &__name {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    color: #353d35;
    margin-bottom: 2px;
    transition: color 300ms;
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
    display: flex;
    align-items: center;
    .gender-icon {
      margin-right: 2px;
    }
    .dot {
      width: 4px;
      height: 4px;
      background: rgba(18, 18, 18, 0.66);
      border-radius: 50%;
      margin: 0 8px;
      &_green {
        background: #7dba28;
      }
    }
  }
  &_commentRow &__desc {
    flex-direction: column;
    align-items: start;
    .employee__resident {
      line-height: 125%;
      color: #7d867d;
      margin-bottom: 2px;
    }
    .employee__date {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #353d35;
    }
  }
  &__date {
    font-family: "SF Pro Text";
    font-weight: 500;
    line-height: 130%;
  }
  &__resident {
    color: #353d35;
  }
  &__rating {
    display: flex;
    align-items: center;
    .star:not(:last-child) {
      margin-right: 2px;
    }
    .star.active path {
      fill: #fabd23;
    }
  }
}
</style>
