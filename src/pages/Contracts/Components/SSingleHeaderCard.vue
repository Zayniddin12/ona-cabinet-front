<template>
  <div class="card single-card mb-7 partner-card">
    <div class="card-body pt-9 pb-0 pr-0">
      <!--begin::Info-->
      <div class="flex-grow-1 partner-card__info">
        <!--begin::Title-->
        <div
          class="d-flex justify-content-between align-items-start flex-wrap mb-6"
        >
          <!--begin::User-->
          <div class="d-flex flex-column">
            <!--begin::Name-->
            <div class="d-flex align-items-center">
              <h2 class="partner-card__title">{{ title }}</h2>
            </div>
            <!--end::Name-->

            <!--begin::Info-->
            <div class="d-flex flex-wrap gap-3 fw-semobold fs-6 pe-2">
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
              <slot name="details"></slot>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { useSlots } from "vue";

// ******* PROPS *******
interface Props {
  title?: string;
  image?: string;
  tabs?: { title: string; id: number }[];
  hideTab?: boolean;
  hideImage?: boolean;
  active?: number;
}

withDefaults(defineProps<Props>(), {
  title: "Single Header Card Title",
  tabs: () => [
    {
      title: "First tab",
      id: 1,
    },
    {
      title: "Second tab",
      id: 2,
    },
  ],
});

// ******* PLUGINS *******
const slots = useSlots();

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
    margin-bottom: 8px;
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
