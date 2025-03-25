<template>
  <div class="family-accordion">
    <div class="family-accordion-header" @click="$emit('open')">
      <p class="family-accordion-header__title">{{ data?.relative?.name }}</p>
      <div class="family-accordion-header__button">
        <inline-svg
          src="/assets/ona/svg/arrow-stroke.svg"
          :class="{ 'family-rotate-90': active }"
          class="family-accordion-header-arrow transition-200"
        />
      </div>
    </div>

    <CollapseTransition :duration="300">
      <div v-if="active" class="family-accordion-body">
        <div class="family-accordion-body-inner d-flex flex-column gap-7">
          <div v-if="data?.profile_photo?.file" class="info-card">
            <p class="info-card__title">{{ $t("relative_image") }}</p>
            <img
              v-if="data?.profile_photo?.file"
              :src="data?.profile_photo?.file"
              :alt="data?.profile_photo?.name"
            />
          </div>
          <div
            v-if="data.relative_document && data.relative_document?.length"
            class="info-card"
          >
            <p class="info-card__title">{{ $t("docs") }}</p>
            <div class="d-flex gap-7">
              <SUserDoc
                v-for="(doc, docId) in data.relative_document"
                :key="docId"
                :file="doc"
              />
            </div>
          </div>

          <div class="family-grid">
            <div v-if="data?.relative?.name" class="info-card">
              <p class="info-card__title">{{ $t("relative_type") }}</p>
              <p class="info-card__subtitle">{{ data?.relative?.name }}</p>
            </div>
            <div v-if="data?.full_name" class="info-card">
              <p class="info-card__title">{{ $t("fio") }}</p>
              <p class="info-card__subtitle">{{ data?.full_name }}</p>
            </div>
            <div v-if="data?.birth_date" class="info-card">
              <p class="info-card__title">{{ $t("userTable.born") }}</p>
              <p class="info-card__subtitle">
                {{ dayjs(data?.birth_date).format("DD.MM.YYYY") }}
              </p>
            </div>
            <div class="info-card" v-if="data.phone">
              <p class="info-card__title">{{ $t("contact_info_family") }}</p>
              <p class="info-card__subtitle-without-preline">
                {{ formatPhoneNumber(data?.phone) }}
              </p>
            </div>
            <div v-if="data.income_type" class="info-card">
              <p class="info-card__title">{{ $t("income_type") }}</p>
              <p class="info-card__subtitle">
                {{ data?.income_type?.title }}
              </p>
            </div>
            <div class="info-card">
              <p class="info-card__title">{{ $t("month_income") }}</p>
              <p class="info-card__subtitle">
                {{ formatMoneyDecimal(data?.monthly_income) }}
              </p>
            </div>

            <div class="info-card" v-if="data?.illness">
              <p class="info-card__title">{{ $t("illness") }}</p>
              <p class="info-card__subtitle">
                {{ $t(data?.illness) }}
              </p>
            </div>
            <div
              v-for="(item, index) in data?.conditions"
              :key="index"
              class="info-card"
            >
              <p class="info-card__title">{{ item?.type?.title }}</p>
              <p class="info-card__subtitle">{{ item?.title }}</p>
            </div>
            <!--            <div class="info-card">-->
            <!--              <p class="info-card__title">{{ $t("family_disabled") }}</p>-->
            <!--              <p v-if="data?.disabled" class="family-disabled">-->
            <!--                {{ $t("no_disabled") }}-->
            <!--              </p>-->
            <!--              <p v-else class="family-enabled">-->
            <!--                {{ $t("no_disabled") }}-->
            <!--              </p>-->
            <!--            </div>-->
            <div class="info-card" v-if="data?.additional_info">
              <p class="info-card__title">{{ $t("additional_info") }}</p>
              <p class="info-card__subtitle">
                {{ data?.additional_info }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CollapseTransition>
  </div>
</template>

<script setup lang="ts">
import CollapseTransition from "@ivanv/vue-collapse-transition/src/CollapseTransition.vue";
import dayjs from "dayjs";

import { formatMoneyDecimal, formatPhoneNumber } from "@/helpers";
import SUserDoc from "@/pages/PUser/Single/components/Cards/UserDoc/SUserDoc.vue";

interface Props {
  data: {
    image: string;
    relative_type: string;
    full_name: string;
    birth_date: string;
    phone_number: string;
    income_type: string;
    monthly_income: number;
    illness: string;
    disabled: false;
    additional: string;
  };
  active?: boolean;
}

withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="scss">
.family-accordion {
  background: #fff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  &-header {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 24px;
    &__title {
      font-weight: 500;
      font-size: 18px;
      line-height: 21px;
      color: #1c1f20;
    }

    &__button {
      width: 32px;
      height: 32px;
      background: #f5f7f7;
      border-radius: 8px;
      display: flex;
      border: 1px solid #f5f7f7;
      align-items: center;
      justify-content: center;
      transition: all 200ms ease-in-out;

      &:active {
        transform: scale(0.9);
      }
      &:hover {
        background: transparent;
      }
    }
  }

  &-body {
    padding-right: 24px;
    padding-bottom: 24px;
    &-inner {
      padding-top: 20px;
      padding-left: 24px;
      border-top: 1px solid #eff2f5;
    }
  }
}

.family-rotate-90 {
  transform: rotate(90deg) !important;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #a2abbe;
  }
  &__subtitle {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #1c1f20;
    white-space: pre-line;

    &-without-preline {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: #1c1f20;
    }
  }

  img {
    width: 122px;
    height: 122px;
    object-fit: cover;
    border: 1px solid #d6d9dd;
    border-radius: 8px;
  }
}

.family-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.family-disabled {
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #fa3232;
}

.family-enabled {
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #2ed47a;
}
</style>

<style lang="scss">
.family-accordion-header-arrow {
  transform: rotate(-90deg);
  path {
    stroke: #1c274c;
  }
}
</style>
