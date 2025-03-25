<template>
  <!--  <KtLoading loaderType="spinner-message" v-if="load" />-->

  <div class="card mb-7 partner-card">
    <div
      class="single-card-header d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center gap-7">
        <p class="fs-6 text-secondary-dark leading-130">
          {{ $t("percentage_of_filling") }}:
          <span class="text-dark fw-bold">{{ percent }}%</span>
        </p>
        <div
          v-if="useRoleManagement('edit')"
          class="d-flex gap-2 align-items-center"
        >
          <p class="fs-6 text-secondary-dark leading-130">
            {{ $t("last_updated_info") }}:
            <span class="text-dark fw-bold">{{ formatDate(lastUpdate) }}</span>
          </p>
          <SButton variant="secondary" class="p-3" @click="$emit('last')">
            <inline-svg src="/assets/ona/svg/history.svg" />
          </SButton>
        </div>
      </div>

      <SButton :variant="'secondary'" @click="$emit('download')">
        <div class="d-flex align-items-center gap-2">
          <inline-svg src="/assets/ona/svg/download.svg" />
          {{ $t("download_application") }}
        </div>
      </SButton>
    </div>
    <div class="card-body pt-9 pb-0 px-0 overflow-hidden">
      <div>
        <!--begin::Details-->
        <div class="d-flex flex-wrap flex-sm-nowrap mb-3 ps-9">
          <!--begin: Pic-->
          <PreloaderSkeleton
            width="122px"
            v-bind="{ loading }"
            height="122px"
            preloader-class="me-7 mb-4"
          >
            <div v-if="!hideImage" class="me-7 mb-4">
              <div
                class="symbol symbol-lg-122px symbol-fixed position-relative partner-card__img"
              >
                <img
                  v-if="image"
                  :src="image"
                  alt="image"
                  class="w-100 h-100"
                />
                <img
                  v-else
                  src="/assets/avatars/blank.png"
                  style="background: #efefef"
                  class="w-100 h-100"
                  alt=""
                />
              </div>
            </div>
          </PreloaderSkeleton>
          <!--end::Pic-->

          <!--begin::Info-->
          <div class="flex-grow-1 partner-card__info">
            <!--begin::Title-->
            <div
              class="d-flex justify-content-between align-items-start flex-wrap mb-2"
            >
              <!--begin::User-->
              <div class="d-flex flex-column">
                <!--begin::Name-->
                <div class="d-flex align-items-center">
                  <PreloaderSkeleton
                    width="300px"
                    v-bind="{ loading }"
                    height="26px"
                    preloader-class="me-7 mb-4"
                  >
                    <h2 class="partner-card__title">{{ title }}</h2>
                  </PreloaderSkeleton>
                </div>
                <!--end::Name-->

                <!--begin::Info-->
                <div class="d-flex flex-wrap gap-3 fw-semobold fs-6 mb-2 pe-2">
                  <slot name="badges" />
                </div>
                <!--end::Info-->
              </div>
              <!--end::User-->

              <!--begin::Actions-->
              <div class="d-flex gap-3">
                <slot name="actions" />
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Title-->

            <!--begin::Stats-->
            <div v-if="hasDetailsSlot" class="d-flex flex-wrap flex-stack">
              <!--begin::Wrapper-->
              <div class="d-flex flex-column flex-grow-1 pe-8">
                <!--begin::Stats-->
                <ul class="single-card__details d-flex flex-wrap p-0">
                  <!--begin::Stat-->
                  <Transition name="fade" mode="out-in">
                    <div
                      :key="loading"
                      class="single-card__details d-flex flex-wrap p-0"
                    >
                      <template v-if="loading">
                        <div
                          class="border py-2 px-3 rounded-md border-dashed border-[#E4E6EF]"
                        >
                          <PreloaderSkeleton
                            width="100px"
                            height="18px"
                            :loading="loading"
                          />
                          <PreloaderSkeleton
                            width="60px"
                            height="16px"
                            :loading="loading"
                            preloader-class="mt-1"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <slot name="details" />
                      </template>
                    </div>
                  </Transition>
                  <!--end::Stat-->
                </ul>
                <!--end::Stats-->
              </div>
              <!--end::Wrapper-->
            </div>
            <!--end::Stats-->
          </div>
          <!--end::Info-->
        </div>
        <!--end::Details-->

        <!--begin::Navs-->

        <div class="w-100 h-1 i-bg-gray ms-9"></div>

        <div v-if="!hideTab">
          <el-tabs
            v-model="activeTab"
            class="single-header-card-tab"
            @tab-change="$emit('tab-change', $event)"
          >
            <el-tab-pane
              v-for="(tab, tabIndex) of tabs"
              :key="tabIndex"
              :label="$t(tab.title)"
              :name="tab.id"
            />
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { ref, useSlots, watch } from "vue";

import KtLoading from "@/components/kt-datatable/table-partials/Loading.vue";
import useRoleManagement from "@/composables/useRoleManagement";
import { formatDate } from "@/helpers";
import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

// ******* PROPS *******
interface Props {
  load: boolean;
  title?: string;
  image?: string;
  percent?: number;
  tabs?: { title: string; id: number }[];
  hideTab?: boolean;
  hideImage?: boolean;
  loading?: boolean;
  active?: number;
  lastUpdate?: Date;
}

const props = withDefaults(defineProps<Props>(), {});

// ******* PLUGINS *******
const slots = useSlots();

const activeTab = ref(1);

watch(
  () => props.active,
  () => {
    activeTab.value = props.active;
  },
  {
    immediate: true,
  }
);

const hasDetailsSlot = computed(() => !!slots["details"]);
</script>

<style lang="scss">
.partner-card {
  border-radius: 12px !important;

  &__info {
    display: grid;
  }

  &__title {
    font-size: 22px;
    color: #3f4254;
  }

  &__img img {
    border: solid 2px #e4e6ef;
    border-radius: 6px !important;
    object-fit: cover;
  }

  &__tab {
    .nav-item {
      .nav-link {
        color: #7d867d !important;
        transition: 0.2s all !important;
        cursor: pointer;

        &:hover {
          color: #7dba28 !important;
          border-bottom-color: transparent !important;
        }

        &.active {
          color: #7dba28 !important;
          border-bottom-color: #7dba28 !important;
        }
      }
    }
  }
}

.single-card {
  &-header {
    padding: 11px 12px 11px 20px;
    border-bottom: 1px solid #eff2f5;
  }

  &__details li {
    border: 1px dashed #e4e6ef;
    padding: 8px 12px;
    list-style: none;
    border-radius: 6px;
  }

  &__details li:not(:last-child) {
    margin-right: 16px;
  }

  .detail-title {
    font-weight: 500;
    font-size: 13px;
    line-height: 130%;
    color: #b5b5c3;
  }

  .detail-content {
    font-weight: 700;
    font-size: 14px;
    line-height: 130%;
    color: #353d35;
  }

  .detail-content.purple {
    color: #700680;
  }

  .detail-content.green {
    color: #7dba28;
  }
}

.single-card {
  .el-tabs__item {
    background: linear-gradient(
      180deg,
      rgba(48, 161, 219, 0) 0%,
      rgba(48, 161, 219, 0) 100%
    );
    padding: 0 12px !important;
    transition: all 300ms linear !important;
    color: #a2abbe;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
  }

  .el-tabs__active-bar {
    opacity: 0;
  }

  .is-active {
    border-bottom: 2px solid #30a1db;
    background: linear-gradient(
      180deg,
      rgba(48, 161, 219, 0) 0%,
      rgba(48, 161, 219, 0.15) 100%
    ) !important;
    color: #30a1db;
  }
}
</style>

<style>
.single-header-card-tab .el-tabs__header {
  margin: 0 !important;
}

.symbol-lg-122px {
  width: 122px !important;
  height: 122px !important;
}

.h-1 {
  height: 1px;
  margin-bottom: 16px;
  margin-top: 24px;
}

.pr-0 {
  padding-right: 0 !important;
}
</style>
