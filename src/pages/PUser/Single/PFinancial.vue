<template>
  <div>
    <SUserMainCard
      v-if="
        participant?.bank?.bank_name ||
        participant?.STIR ||
        participant?.bank_mfo ||
        participant?.bank_account_number?.length ||
        participant?.bank_card_number?.length
      "
      :title="$t('info_bank')"
    >
      <template #body>
        <div v-if="participant?.bank?.bank_name" class="info-card">
          <p class="info-card__title">{{ $t("bank") }}</p>
          <p class="info-card__subtitle">
            {{ participant?.bank?.bank_address }}
            {{ participant?.bank?.bank_name }}
          </p>
        </div>

        <div v-if="participant?.STIR" class="info-card">
          <p class="info-card__title">{{ $t("bank_stiri") }}</p>
          <p class="info-card__subtitle">{{ participant?.STIR }}</p>
        </div>
        <div v-if="participant?.bank_mfo" class="info-card">
          <p class="info-card__title">{{ $t("bank_mfo") }}</p>
          <p class="info-card__subtitle">{{ participant?.bank_mfo }}</p>
        </div>
        <div v-if="participant?.bank_account_number?.length" class="info-card">
          <p class="info-card__title">{{ $t("account_number") }}</p>
          <p class="info-card__subtitle">
            {{ participant?.bank_account_number }}
          </p>
        </div>

        <div v-if="participant?.bank_card_number?.length" class="info-card">
          <p class="info-card__title">{{ $t("card_number") }}</p>
          <p class="info-card__subtitle">
            {{ formatCardNumber(participant?.bank_card_number) }}
          </p>
        </div>
        <div v-for="(item, index) in listBank" :key="index" class="info-card">
          <p class="info-card__title">{{ item?.type?.title }}</p>
          <p class="info-card__subtitle">{{ item?.title }}</p>
        </div>
      </template>
    </SUserMainCard>
    <SUserMainCard v-else :title="$t('info_bank')">
      <template #body>
        <div class="odd dataTables_empty col-span-2 w-100">
          <img src="/assets/ona/image/no-data.svg" alt="" class="mb-7" />
          <p class="dataTables_empty-title">
            {{ $t("result_not_exists") }}
          </p>
          <p class="dataTables_empty-text">
            {{ $t("data_not_found") }}
          </p>
        </div>
      </template>
    </SUserMainCard>
    <SUserMainCard
      v-if="
        participant.income_type?.title ||
        participant?.monthly_income ||
        participant.profession ||
        participant?.what_can_do ||
        listFinance?.length ||
        participant?.income_type_document?.length
      "
      :title="$t('finance_and_work')"
      class="mt-7"
    >
      <template #body>
        <div class="d-flex flex-column gap-7">
          <div class="info-card" v-if="participant.income_type?.title">
            <p class="info-card__title">{{ $t("income_type") }}</p>
            <p class="info-card__subtitle">
              {{ participant.income_type?.title }}
            </p>
          </div>
          <div class="info-card" v-if="participant?.monthly_income">
            <p class="info-card__title">{{ $t("month_income") }}</p>
            <p class="info-card__subtitle">
              {{ formatMoneyDecimal(participant?.monthly_income) }} UZS
            </p>
          </div>
          <div v-if="participant.profession" class="info-card">
            <p class="info-card__title">{{ $t("job") }}</p>
            <p class="info-card__subtitle">{{ participant?.profession }}</p>
          </div>
          <div v-if="participant?.what_can_do" class="info-card">
            <p class="info-card__title">{{ $t("type_job") }}</p>
            <p class="info-card__subtitle">{{ participant?.what_can_do }}</p>
          </div>
          <div
            v-for="(item, index) in listFinance"
            :key="index"
            class="info-card"
          >
            <p class="info-card__title">{{ item?.type?.title }}</p>
            <p class="info-card__subtitle">{{ item?.title }}</p>
          </div>
        </div>
        <div>
          <div
            v-if="participant?.income_type_document?.length"
            class="info-card"
          >
            <p class="info-card__title">{{ $t("income_doc") }}</p>
            <SUserDoc
              v-for="(item, index) in participant?.income_type_document"
              :key="index"
              :file="item"
            />
          </div>
        </div>
      </template>
    </SUserMainCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { formatCardNumber, formatMoneyDecimal } from "@/helpers";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SUserDoc from "@/pages/PUser/Single/components/Cards/UserDoc/SUserDoc.vue";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";

const { participant } = useParticipant();

const listBank = computed(() => {
  let innerList: any = [];

  participant.value?.conditions?.forEach((el: any) => {
    if (el?.type?.place === "FINANCIAL_BANK_INFO") {
      innerList.push(el);
    }
  });
  return innerList;
});

const listFinance = computed(() => {
  let innerList: any = [];

  participant.value?.conditions?.forEach((el: any) => {
    if (el?.type?.place === "FINANCIAL_FINANCE_AND_WORKING") {
      innerList.push(el);
    }
  });
  return innerList;
});
</script>

<style lang="scss">
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
  }
}

.dataTables_empty {
  height: 350px !important;
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  img {
    margin-bottom: 16px;
  }

  &-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 23px;
    text-align: center;
    color: #191e36;
    margin-bottom: 12px;
  }

  &-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #191e36;
    opacity: 0.7;
    max-width: 400px;
  }
}

.col-span-2 {
  grid-column: span 2;
}
</style>
