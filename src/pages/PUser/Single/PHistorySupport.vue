<template>
  <div>
    <div v-if="history?.length" class="d-flex flex-column gap-5">
      <SUserMainCard v-for="(item, index) in history" :key="index">
        <template #body>
          <!--          right side-->
          <div class="d-flex flex-column gap-6">
            <div v-if="item?.support_type_list?.length" class="info-card">
              <p class="info-card__title">{{ $t("support_type") }}</p>
              <p class="info-card__subtitle">
                {{
                  item?.support_type_list?.map((item) => item?.title).join(", ")
                }}
              </p>
            </div>
            <div v-if="item?.number" class="info-card">
              <p class="info-card__title">{{ $t("order_number") }}</p>
              <p class="info-card__subtitle">{{ item?.number }}</p>
            </div>
            <div v-if="item?.support_date" class="info-card">
              <p class="info-card__title">{{ $t("payment_day") }}</p>
              <p class="info-card__subtitle">
                {{ formatDate(item?.support_date) }}
              </p>
            </div>
            <div class="info-card">
              <p class="info-card__title">{{ $t("allocated_amount") }}</p>
              <p class="info-card__subtitle">
                {{ formatMoneyDecimal(item?.all_price, 0) || 0 }} UZS
              </p>
            </div>
          </div>

          <!--          left side-->
          <div class="d-flex flex-column gap-6">
            <div v-if="item?.file_petition?.length" class="info-card">
              <p class="info-card__title">{{ $t("command_file") }}</p>
              <SUserDoc
                v-for="(file, index) in item?.file_petition"
                :key="index"
                :file="file"
              />
            </div>

            <div v-if="item?.photo_report?.length" class="info-card">
              <p class="info-card__title">{{ $t("photo_report") }}</p>
              <SUserDoc
                v-for="(file, index) in item?.photo_report"
                :key="index"
                :file="file"
              />
            </div>

            <div v-if="item?.photo_cost?.length" class="info-card">
              <p class="info-card__title">{{ $t("photo_cost") }}</p>
              <SUserDoc
                v-for="(file, index) in item?.photo_cost"
                :key="index"
                :file="file"
              />
            </div>

            <div v-if="item?.about_help?.length" class="info-card">
              <p class="info-card__title">{{ $t("about_help") }}</p>
              <SUserDoc
                v-for="(file, index) in item?.about_help"
                :key="index"
                :file="file"
              />
            </div>
          </div>
        </template>
      </SUserMainCard>
    </div>

    <SUserMainCard v-else wrapper-class="d-flex justify-content-center">
      <template #body>
        <div
          class="odd dataTables_empty col-span-2 w-100 d-flex justify-content-center align-items-center flex-column"
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
import { ref, watch } from "vue";

import { formatMoneyDecimal } from "@/helpers";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SUserDoc from "@/pages/PUser/Single/components/Cards/UserDoc/SUserDoc.vue";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";
import { IParticipants } from "@/pages/PUser/types/participant";

const history = ref<IParticipants[]>();
const { participant } = useParticipant();

watch(
  () => participant.value,
  (newValue) => {
    history.value = newValue?.support_history;
  },
  {
    immediate: true,
  }
);

const formatDate = (time: string) => {
  const day = new Date(time);
  const date = day.getDate() > 9 ? day.getDate() : "0" + day.getDate();
  let month =
    day.getMonth() + 1 < 9 ? "0" + (day.getMonth() + 1) : day.getMonth() + 1;

  return `${date}.${month}.${day.getFullYear()}`;
};
</script>

<style lang="scss" scoped>
.dataTables_empty {
  max-width: 400px;
  text-align: center;
}
.dataTables_empty-title {
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.dataTables_empty-text {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  margin-top: 12px;
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
