<template>
  <!--begin::Mixed Widget 1-->
  <div class="card h-100 border border-secondary-dark bg-white">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <img src="/assets/frame.png" alt="" class="frame" />
      <div class="card-content">
        <h3 class="card-title fw-bold fs-2 text-white">
          {{
            statistics?.active_participants + statistics?.inactive_participants
          }}
        </h3>
        <p class="fs-6 text-white">
          {{ $t("total_users") }}
        </p>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body p-0">
      <!--begin::Stats-->
      <div class="mt-n14 px-4 position-relative">
        <!--begin::Row-->
        <div class="d-flex gap-4 m-0 cards">
          <div
            class="col i-bg-white border border-secondary-dark px-4 py-4 rounded-2"
          >
            <p class="fs-4 text-dark-black fw-bold">
              {{ statistics?.active_participants }}
            </p>
            <p class="text-secondary-dark fs-7">{{ $t("active_users") }}</p>
          </div>
          <div
            class="col i-bg-white border border-secondary-dark px-4 py-4 rounded-2"
          >
            <p class="fs-4 text-dark-black fw-bold">
              {{ statistics?.inactive_participants }}
            </p>
            <p class="text-secondary-dark fs-7">{{ $t("inactive_users") }}</p>
          </div>
        </div>

        <div class="d-flex row mt-7 px-1">
          <div
            v-for="(item, ind) of statistics?.statistics"
            :key="ind"
            class="col-6 px-3 mb-8"
          >
            <div
              class="col h-100 i-bg-white border border-secondary-dark px-4 py-4 rounded-2"
            >
              <div class="d-flex gap-5 mb-3 align-items-center">
                <div
                  class="w-40px h-40px rounded-8 d-flex align-items-center justify-content-center"
                  :class="{
                    'i-bg-blue': ind < 2,
                    'i-bg-purple': ind >= 2 && ind < 4,
                    'i-bg-red': ind >= 4,
                  }"
                >
                  <img
                    :src="item?.icon"
                    :alt="item?.title"
                    class="w-24px h-24px"
                  />
                  <!--                  <inline-svg src="/assets/ona/svg/diploma.svg" />-->
                </div>
                <p class="fs-18 fw-bold text-dark-black">{{ item?.value }}</p>
              </div>
              <p class="text-secondary-dark fs-7">{{ item?.title }}</p>
            </div>
          </div>
        </div>
        <!--end::Row-->
      </div>
      <!--end::Stats-->
      <!--end::Body-->
    </div>
    <!--end::Mixed Widget 1-->
  </div>
</template>

<script lang="ts" setup>
interface Props {
  widgetClasses?: string;
  widgetColor?: string;
  strokeColor?: string;
  statistics?: any;
}

withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="scss">
.border-secondary-dark {
  border-color: #e5eaee !important;
}

.card-header {
  position: relative;
  height: 165px;
  background-color: #2683b3;
  z-index: 10;
  overflow: hidden;
  border-radius: 12px;
}
.card {
  border-radius: 12px;
}
.cards {
  position: relative;
  z-index: 10;
}
.card-content {
  position: relative;
  z-index: 10;
}
.frame {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1;
}
.w-24px {
  width: 24px;
}

.h-24px {
  height: 24px;
}
</style>
