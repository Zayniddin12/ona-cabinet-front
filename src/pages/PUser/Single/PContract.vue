<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import SFileCard from "@/components/cards/SFileCard.vue";
import ApiService from "@/core/services/ApiService";
import { formatDateWithMonth } from "@/helpers";
import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";
import SSingleHeaderCard from "@/pages/PRPerson/Components/SSingleHeaderCard.vue";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";

const route = useRoute();
const loading = ref(false);
const users = ref([]);
const fetchContract = async () => {
  loading.value = true;
  await ApiService.get(
    `/api/v2/main/ContractList?participant=${route.params.id}`
  )
    .then(({ data }) => {
      users.value = data?.results;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  fetchContract();
});
</script>

<template>
  <div>
    <div v-if="!loading" class="d-grid gap-6">
      <div v-for="(user, idx) in users" :key="idx">
        <SSingleHeaderCard
          :title="user?.participant?.full_name"
          v-bind="{ loading }"
        >
          <template #badges>
            <PreloaderSkeleton
              width="90px"
              v-bind="{ loading }"
              height="20px"
              preloader-class="mb-1"
            >
              <div class="d-flex align-items-center gap-1 mt-1">
                <inline-svg src="/assets/ona/svg/user-solid.svg" />
                <p class="text-secondary-dark fs-7 fw-bold">
                  ID: {{ user?.participant_id }}
                </p>
              </div>
            </PreloaderSkeleton>
          </template>
          <template #details>
            <!--            <li>-->
            <!--              <div>-->
            <!--                <PreloaderSkeleton-->
            <!--                  width="80px"-->
            <!--                  v-bind="{ loading }"-->
            <!--                  height="20px"-->
            <!--                  preloader-class="mb-1"-->
            <!--                >-->
            <!--                  <p class="partner-single-details__title">-->
            <!--                    {{ user?.id }}-->
            <!--                  </p>-->
            <!--                </PreloaderSkeleton>-->
            <!--                <PreloaderSkeleton-->
            <!--                  width="80px"-->
            <!--                  v-bind="{ loading }"-->
            <!--                  height="20px"-->
            <!--                >-->
            <!--                  <p class="partner-single-details__subtitle">-->
            <!--                    {{ $t("contract_id") }}-->
            <!--                  </p>-->
            <!--                </PreloaderSkeleton>-->
            <!--              </div>-->
            <!--            </li>-->
            <!--            <li>-->
            <!--              <div>-->
            <!--                <PreloaderSkeleton-->
            <!--                  width="80px"-->
            <!--                  v-bind="{ loading }"-->
            <!--                  height="20px"-->
            <!--                  preloader-class="mb-1"-->
            <!--                >-->
            <!--                  <p class="partner-single-details__title">-->
            <!--                    {{ user?.code }}-->
            <!--                  </p>-->
            <!--                </PreloaderSkeleton>-->
            <!--                <PreloaderSkeleton-->
            <!--                  width="80px"-->
            <!--                  v-bind="{ loading }"-->
            <!--                  height="20px"-->
            <!--                >-->
            <!--                  <p class="partner-single-details__subtitle">-->
            <!--                    {{ $t("code") }}-->
            <!--                  </p>-->
            <!--                </PreloaderSkeleton>-->
            <!--              </div>-->
            <!--            </li>-->
            <li>
              <div>
                <PreloaderSkeleton
                  width="90px"
                  v-bind="{ loading }"
                  height="20px"
                  preloader-class="mb-1"
                >
                  <p class="partner-single-details__title transition-200">
                    {{ $t(`statusArr[${user?.status - 1}]`) }}
                  </p>
                </PreloaderSkeleton>
                <PreloaderSkeleton
                  width="90px"
                  v-bind="{ loading }"
                  height="20px"
                >
                  <p class="partner-single-details__subtitle">
                    {{ $t("status") }}
                  </p>
                </PreloaderSkeleton>
              </div>
            </li>
            <li>
              <div>
                <PreloaderSkeleton
                  width="120px"
                  v-bind="{ loading }"
                  height="20px"
                  preloader-class="mb-1"
                >
                  <p class="partner-single-details__title transition-200">
                    {{ formatDateWithMonth(user?.start_date) }}
                  </p>
                </PreloaderSkeleton>
                <PreloaderSkeleton
                  width="120px"
                  v-bind="{ loading }"
                  height="20px"
                >
                  <p class="partner-single-details__subtitle">
                    {{ $t("started_date") }}
                  </p>
                </PreloaderSkeleton>
              </div>
            </li>
            <li>
              <div>
                <PreloaderSkeleton
                  width="120px"
                  v-bind="{ loading }"
                  height="20px"
                  preloader-class="mb-1"
                >
                  <p class="partner-single-details__title transition-200">
                    {{ formatDateWithMonth(user?.end_date) }}
                  </p>
                </PreloaderSkeleton>
                <PreloaderSkeleton
                  width="120px"
                  v-bind="{ loading }"
                  height="20px"
                >
                  <p class="partner-single-details__subtitle">
                    {{ $t("ended_date") }}
                  </p>
                </PreloaderSkeleton>
              </div>
            </li>
          </template>
        </SSingleHeaderCard>

        <div v-if="user?.files?.length" class="file-card">
          <p class="file__title">{{ $t("files") }}</p>

          <div class="mt-5 row gap-3">
            <SFileCard
              style="padding-bottom: 12px"
              v-for="(file, ind) of user?.files"
              :key="ind"
              :file="file"
              class="col-md-3"
              v-bind="{ loading }"
            />
          </div>
        </div>
      </div>
    </div>

    <SUserMainCard
      v-if="!loading && !users.length"
      wrapper-class="d-flex justify-content-center h-100"
    >
      <template #body>
        <div
          class="odd dataTables_empty col-span-2 w-100 d-flex justify-content-center align-items-center flex-column"
        >
          <img src="/assets/ona/image/no-data.svg" alt="" class="mb-7" />
          <p class="dataTables_empty-title">
            {{ $t("result_not_exists") }}
          </p>
          <p class="dataTables_empty-text">
            {{ $t("no_contract") }}
          </p>
        </div>
      </template>
    </SUserMainCard>
  </div>
</template>

<style scoped lang="scss">
.file-card {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e5eaee;
  border-radius: 12px;

  .file__title {
    font-weight: 500;
    font-size: 22px;
    line-height: 140%;
    color: #3f4254;
  }
}

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
