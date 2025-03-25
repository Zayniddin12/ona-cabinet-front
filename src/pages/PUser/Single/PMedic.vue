<template>
  <div>
    <SUserMainCard :title="$t('medic_conclusions')">
      <template #body>
        <div class="d-flex flex-column gap-7">
          <div v-if="participant?.illness" class="info-card">
            <p class="info-card__title">{{ $t("illness") }}</p>
            <p class="info-card__subtitle">
              {{ $t(participant?.illness) }}
            </p>
          </div>
          <div class="info-card" v-if="participant?.medical_info">
            <p class="info-card__title">{{ $t("additional_info") }}</p>
            <p class="info-card__subtitle">{{ participant?.medical_info }}</p>
          </div>
          <div v-if="participant?.diagnosis" class="info-card">
            <p class="info-card__title">{{ $t("diagnoz") }}</p>
            <p class="info-card__subtitle">
              {{ participant.diagnosis }}
            </p>
          </div>
          <div v-for="(item, index) in list" :key="index" class="info-card">
            <p class="info-card__title">{{ item?.type?.title }}</p>
            <p class="info-card__subtitle">{{ item?.title }}</p>
          </div>
        </div>
        <div class="d-flex flex-column gap-7">
          <div v-if="participant?.disability?.length" class="info-card">
            <p class="info-card__title">{{ $t("disables") }}</p>
            <SUserDoc
              :key="disabilityId"
              :file="disability"
              v-for="(disability, disabilityId) in participant.disability"
            />
          </div>
          <div class="info-card" v-if="participant.illness_certificate?.length">
            <p class="info-card__title">{{ $t("illness_info") }}</p>
            <SUserDoc
              :key="illnessId"
              :file="illness"
              v-for="(illness, illnessId) in participant.illness_certificate"
            />
          </div>
          <div class="info-card" v-if="participant?.medical_data?.length">
            <p class="info-card__title">{{ $t("medic_information") }}</p>
            <SUserDoc
              v-for="(medical, medicalId) in participant.medical_data"
              :key="medicalId"
              :file="medical"
            />
          </div>
        </div>

        <div
          v-if="
            !participant?.illness &&
            !participant?.medical_info &&
            !participant?.diagnosis &&
            !participant?.disability?.length &&
            !participant.illness_certificate?.length &&
            !participant?.medical_data?.length
          "
          class="odd dataTables_empty col-span-2 w-100"
        >
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SUserDoc from "@/pages/PUser/Single/components/Cards/UserDoc/SUserDoc.vue";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";

const { participant } = useParticipant();

const list = computed(() => {
  let innerList: any = [];

  participant.value?.conditions?.forEach((el: any) => {
    if (el?.type?.place === "MEDICAL_CONCLUSIONS") {
      innerList.push(el);
    }
  });
  return innerList;
});
</script>

<style lang="scss" scoped>
.col-span-2 {
  grid-column: span 2;
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
</style>
