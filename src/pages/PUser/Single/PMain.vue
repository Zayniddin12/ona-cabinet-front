<template>
  <div>
    <SUserMainCard
      v-if="
        participant.constant_region?.title ||
        participant.constant_district?.title ||
        participant.constant_street?.title ||
        participant.constant_house_number ||
        participant?.constant_address_document?.length
      "
      :title="$t('address_living')"
    >
      <template #body>
        <div class="d-flex flex-column gap-7">
          <div v-if="participant.constant_region" class="info-card">
            <p class="info-card__title">{{ $t("region") }}</p>
            <p class="info-card__subtitle">
              {{ participant.constant_region?.title }}
            </p>
          </div>
          <div v-if="participant.constant_district" class="info-card">
            <p class="info-card__title">{{ $t("city_district") }}</p>
            <p class="info-card__subtitle">
              {{ participant.constant_district?.title }}
            </p>
          </div>
          <div v-if="participant.constant_street" class="info-card">
            <p class="info-card__title">{{ $t("mfy") }}</p>
            <p class="info-card__subtitle">
              {{ participant.constant_street?.title }}
            </p>
          </div>
          <div v-if="participant.constant_house_number" class="info-card">
            <p class="info-card__title">{{ $t("full_address") }}</p>
            <div class="d-flex align-items-center gap-2">
              <p class="info-card__subtitle">
                {{ participant?.constant_house_number }}
              </p>
              <inline-svg src="/assets/ona/svg/location.svg" />
            </div>
          </div>
          <div v-for="(item, index) in list" :key="index" class="info-card">
            <p class="info-card__title">{{ item?.type?.title }}</p>
            <p class="info-card__subtitle">{{ item?.title }}</p>
          </div>
        </div>
        <div
          class="info-card"
          v-if="participant.constant_address_document?.length"
        >
          <p class="info-card__title">{{ $t("doc_from_living_address") }}</p>
          <SUserDoc
            :file="item"
            :key="index"
            v-for="(item, index) in participant.constant_address_document"
          />
        </div>
      </template>
    </SUserMainCard>
    <SUserMainCard v-else :title="$t('address_living')">
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
        participant.living_region?.title ||
        participant.living_district?.title ||
        participant.living_street?.title ||
        participant.living_house_number ||
        participant?.living_address_document?.length
      "
      :title="$t('temporary_address')"
      class="mt-7"
    >
      <template #body>
        <div class="d-flex flex-column gap-7">
          <div v-if="participant.living_region?.title" class="info-card">
            <p class="info-card__title">{{ $t("region") }}</p>
            <p class="info-card__subtitle">
              {{ participant.living_region?.title }}
            </p>
          </div>
          <div v-if="participant.living_district" class="info-card">
            <p class="info-card__title">{{ $t("city_district") }}</p>
            <p class="info-card__subtitle">
              {{ participant.living_district?.title }}
            </p>
          </div>
          <div v-if="participant.living_street" class="info-card">
            <p class="info-card__title">{{ $t("mfy") }}</p>
            <p class="info-card__subtitle">
              {{ participant.living_street?.title }}
            </p>
          </div>
          <div v-if="participant.living_house_number" class="info-card">
            <p class="info-card__title">{{ $t("full_address") }}</p>
            <div class="d-flex align-items-center gap-2">
              <p class="info-card__subtitle">
                {{ participant.living_house_number }}
              </p>
              <inline-svg src="/assets/ona/svg/location.svg" />
            </div>
          </div>
        </div>
        <div
          class="info-card"
          v-if="participant?.living_address_document?.length"
        >
          <!--   Todo: Files         -->
          <p class="info-card__title">{{ $t("doc_from_living_address") }}</p>
          <SUserDoc
            :file="item"
            :key="index"
            v-for="(item, index) in participant.living_address_document"
          />
        </div>
      </template>
    </SUserMainCard>
    <SUserMainCard
      v-if="
        participant?.additional_info || participant?.phone_number_info?.length
      "
      :title="$t('additional_info')"
      class="mt-7 mb-8"
    >
      <template #body>
        <div
          v-if="participant?.additional_info"
          class="d-flex flex-column gap-7"
        >
          <div class="info-card">
            <p class="info-card__title">{{ $t("additional_info") }}</p>
            <p class="info-card__subtitle">
              {{ participant?.additional_info }}
            </p>
          </div>
        </div>
        <div v-if="participant?.phone_number_info?.length" class="info-card">
          <p class="info-card__title">{{ $t("contact_info") }}</p>
          <div class="icon-card-phone d-flex align-items-center gap-5">
            <a
              v-for="(item, index) in participant?.phone_number_info"
              :key="index"
              :href="`tel:+998${item?.replaceAll(' ', '')}`"
              class="d-flex gap-2 cursor-pointer"
            >
              <inline-svg src="/assets/ona/svg/phone.svg" />
              <p class="icon-card-phone-title transition-200">
                {{ formatPhoneNumber(`+998${item?.replaceAll(" ", "")}`) }}
              </p>
            </a>
          </div>
        </div>
      </template>
    </SUserMainCard>

    <SUserMainCard
      v-if="
        participant?.referrall ||
        participant?.application_file?.length ||
        participant?.application_date ||
        participant?.date_of_management_act
      "
      :title="$t('other_info')"
      class="mt-7"
    >
      <template #body>
        <div class="info-card" v-if="participant?.application_file?.length">
          <!--   Todo: Files         -->
          <p class="info-card__title">{{ $t("application_file") }}</p>
          <SUserDoc
            :file="item"
            :key="index"
            v-for="(item, index) in participant.application_file"
          />
        </div>
        <div v-if="participant?.application_date" class="info-card">
          <p class="info-card__title">{{ $t("date_application") }}</p>
          <p class="info-card__subtitle">
            {{ formatDate(participant?.application_date) }}
          </p>
        </div>

        <div v-if="participant?.date_of_management_act" class="info-card">
          <p class="info-card__title">{{ $t("management_deed_date") }}</p>
          <p class="info-card__subtitle">
            {{ formatDate(participant?.date_of_management_act) }}
          </p>
        </div>

        <div v-if="participant?.referrall" class="info-card">
          <p class="info-card__title">{{ $t("referral") }}</p>
          <p class="info-card__subtitle">
            {{ participant?.referrall }}
          </p>
        </div>
      </template>
    </SUserMainCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { formatDate, formatPhoneNumber } from "@/helpers";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SUserDoc from "@/pages/PUser/Single/components/Cards/UserDoc/SUserDoc.vue";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";

const { participant } = useParticipant();

const list = computed(() => {
  let innerList: any = [];

  participant.value?.conditions?.forEach((el: any) => {
    if (el?.type?.place === "MAIN_PERSONAL_INFO") {
      innerList.push(el);
    }
  });
  return innerList;
});
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

.icon-card-phone {
  a {
    color: #1c1f20;

    &:hover {
      .icon-card-phone-title {
        color: #30a1db;
      }
    }
  }
}
</style>

<style lang="scss">
.icon-card-phone {
  a {
    &:hover {
      svg {
        path {
          fill: #00a3ff;
        }
      }
    }
  }
}

.icon-card-phone {
  a {
    svg {
      path {
        transition: all 200ms ease-in;
      }
    }
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
