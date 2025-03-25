<template>
  <SUserMainCard
    v-if="
      user.marriage_certificate?.length ||
      user.marriage_certificate?.length ||
      user.husband_death_certificate?.length ||
      user.divorce_certificate?.length ||
      user.family_members_death_certificate?.length
    "
    :title="$t('docs')"
  >
    <template #body>
      <div
        class="d-flex flex-column gap-7"
        v-if="
          (user.marriage_certificate && user.marriage_certificate.length > 0) ||
          (user.husband_death_certificate &&
            user.husband_death_certificate.length > 0)
        "
      >
        <div
          class="info-card"
          v-if="
            user.marriage_certificate && user.marriage_certificate.length > 0
          "
        >
          <p class="info-card__title">{{ $t("marriage_doc") }}</p>
          <SUserDoc
            v-for="(marriage, marriageId) in user.marriage_certificate"
            :key="marriageId"
            :file="marriage"
          />
        </div>
        <div
          class="info-card"
          v-if="
            user.husband_death_certificate &&
            user.husband_death_certificate.length > 0
          "
        >
          <p class="info-card__title">{{ $t("died_husband_doc") }}</p>
          <SUserDoc
            v-for="(husband, husbandId) in user.husband_death_certificate"
            :key="husbandId"
            :file="husband"
          />
        </div>
      </div>
      <div
        class="d-flex flex-column gap-7"
        v-if="
          (user.divorce_certificate && user.divorce_certificate.length > 0) ||
          (user.family_members_death_certificate &&
            user.family_members_death_certificate.length > 0)
        "
      >
        <div
          class="info-card"
          v-if="user.divorce_certificate && user.divorce_certificate.length > 0"
        >
          <p class="info-card__title">{{ $t("divorce_doc") }}</p>
          <SUserDoc
            v-for="(divorce, divorceId) in user.divorce_certificate"
            :key="divorceId"
            :file="divorce"
          />
        </div>
        <div
          class="info-card"
          v-if="
            user.family_members_death_certificate &&
            user.family_members_death_certificate.length > 0
          "
        >
          <p class="info-card__title">{{ $t("dies_family_doc") }}</p>
          <SUserDoc
            v-for="(family, familyId) in user.family_members_death_certificate"
            :key="familyId"
            :file="family"
          />
        </div>
      </div>
    </template>
  </SUserMainCard>

  <SUserMainCard v-else :title="$t('docs')">
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
</template>

<script setup lang="ts">
import SUserDoc from "@/pages/PUser/Single/components/Cards/UserDoc/SUserDoc.vue";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";
import { IPerson } from "@/pages/PUser/types/participant";

interface Props {
  user: IPerson;
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
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

.col-span-2 {
  grid-column: span 2;
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
