<template>
  <div class="card mb-5 mb-xl-10 partner-card">
    <div class="card-body pt-9 pb-0">
      <!--begin::Details-->
      <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
        <!--begin: Pic-->
        <div class="me-7 mb-4">
          <div
            class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative partner-card__img"
          >
            <img :src="image" alt="image" />
          </div>
        </div>
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
              <div class="d-flex align-items-center mb-3">
                <h2 class="partner-card__title">{{ title }}</h2>
              </div>
              <!--end::Name-->

              <!--begin::Info-->
              <div class="d-flex flex-wrap gap-3 fw-semobold fs-6 mb-4 pe-2">
                <slot name="badges" />
              </div>
              <!--end::Info-->
            </div>
            <!--end::User-->

            <!--begin::Actions-->
            <div class="d-flex my-4 gap-3">
              <slot name="actions" />
            </div>
            <!--end::Actions-->
          </div>
          <!--end::Title-->

          <!--begin::Stats-->
          <div class="d-flex flex-wrap flex-stack">
            <!--begin::Wrapper-->
            <div class="d-flex flex-column flex-grow-1 pe-8">
              <!--begin::Stats-->
              <div class="d-flex flex-wrap">
                <!--begin::Stat-->
                <div
                  v-for="(detail, index) in details"
                  :key="index"
                  class="border border-gray-300 border-dashed rounded py-3 px-4 me-5 mb-3"
                  v-html="detail"
                ></div>
                <!--end::Stat-->
              </div>
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
      <div class="d-flex overflow-auto h-55px border-top mt-5">
        <ul
          class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap partner-card__tab"
        >
          <!--begin::Nav item-->
          <li class="nav-item" v-for="ti in tab" :key="ti.link">
            <router-link
              :to="ti.link"
              class="nav-link text-active-primary me-6"
              active-class="active"
            >
              {{ ti.label }}
            </router-link>
          </li>
          <!--end::Nav item-->
        </ul>
      </div>
      <!--begin::Navs-->
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  image?: string;
  tab: { label: string; link: string }[];
  details: string[];
}

withDefaults(defineProps<Props>(), {
  title: "Partner Header Card Title",
  image: "/assets/avatars/300-1.jpg",
});
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
</style>
