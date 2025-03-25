<template>
  <!--begin::Toolbar wrapper-->
  <div id="topbar" class="d-flex align-items-stretch flex-shrink-0">
    <div class="d-flex align-items-center">
      <div class="d-flex topbar_wrapper align-items-center ms-1 ms-lg-3">
        <!--begin::Menu-->
        <div
          class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="bottom"
        >
          <span class="svg-icon svg-icon-1 position-relative">
            <inline-svg src="/assets//icons/header/notification.svg" />
            <div class="unreads-icon" v-if="isHasUnread" />
          </span>
        </div>
        <NotificationsMenu @fetch="getNotRead" />
        <!--end::Menu-->
      </div>
      <!--end::Notifications-->
      <div class="line-header" />
      <!--begin::Theme mode-->
    </div>

    <div class="vertical-line d-flex align-items-center" />

    <!--begin::Theme mode-->
    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::Menu toggle-->
      <!--      btn-active-light-primary-->
      <a
        href="#"
        class="langSelect"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <div class="d-flex align-items-center">
          <span class="">
            <inline-svg
              :src="`/assets/icons/header/lang_${currentLang}.svg`"
              class=""
            />
          </span>
          <div class="lang-title text-hover-primary">
            <span v-if="currentLang === 'uz'">O'zbekcha</span>
            <span v-if="currentLang === 'ru'">Русский</span>
            <span v-if="currentLang === 'en'">English</span>
          </div>
          <div class="icon-lang">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29723 4.45453L5.57332 8.27766C5.62613 8.33925 5.69163 8.38869 5.76534 8.42258C5.83905 8.45648 5.91922 8.47403 6.00035 8.47403C6.08148 8.47403 6.16165 8.45648 6.23536 8.42258C6.30907 8.38869 6.37458 8.33925 6.42738 8.27766L9.70348 4.45453C10.0161 4.08961 9.75691 3.52594 9.27645 3.52594H2.72332C2.24285 3.52594 1.98363 4.08961 2.29723 4.45453Z"
                fill="#8390A6"
                class="text-hover-primary"
              />
            </svg>
          </div>
        </div>
      </a>
      <!--begin::Menu toggle-->
      <KTThemeModeSwitcher></KTThemeModeSwitcher>
    </div>
    <!--end::Theme mode-->
    <div class="vertical-line d-flex align-items-center" />
    <!--begin::User-->
    <div
      class="d-flex align-items-center ms-1 ms-lg-3"
      id="kt_header_user_menu_toggle"
    >
      <!--begin::Menu-->
      <div
        class="symbol cursor-pointer symbol-30px symbol-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <div class="profile">
          <div>
            <h4 class="profile__title">
              {{ users?.first_name }} {{ users?.last_name }}
            </h4>
            <p class="profile__subtitle">{{ $t(users?.type ?? "") }}</p>
          </div>
        </div>
      </div>
      <KTUserMenu></KTUserMenu>
      <!--end::Menu-->
    </div>
    <!--end::User -->

    <!--begin::Heaeder menu toggle-->
    <div
      class="d-flex align-items-center d-lg-none ms-2 me-n3"
      title="Show header menu"
    >
      <div
        class="btn btn-icon btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40px"
        id="kt_header_menu_mobile_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="/assets/icons/duotune/text/txt001.svg" />
        </span>
      </div>
    </div>
    <!--end::Heaeder menu toggle-->
  </div>
  <!--end::Toolbar wrapper-->
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";

import i18n from "@/core/plugins/i18n";
import ApiService from "@/core/services/ApiService";
import NotificationsMenu from "@/layout/header/partials/NotificationsMenu.vue";
import KTUserMenu from "@/layout/header/partials/UserMenu.vue";
import KTThemeModeSwitcher from "@/layout/theme-mode/ThemeModeSwitcher.vue";

export default defineComponent({
  name: "header-topbar",
  components: {
    NotificationsMenu,
    KTThemeModeSwitcher,
    KTUserMenu,
  },
  setup() {
    const users = computed(() => {
      return useStore().getters.currentUser;
    });

    const isHasUnread = ref(false);

    const currentLang = computed(() => {
      return i18n.global.locale.value;
    });

    onMounted(() => {
      getNotRead();
    });

    function getNotRead() {
      ApiService.get("api/v2/notifications/read/status/").then((res) => {
        isHasUnread.value = res.data.has_unread_notifications;
      });
    }

    return {
      users,
      currentLang,
      isHasUnread,
      getNotRead,
    };
  },
});
</script>
<style lang="scss" src="@/assets/sass/header/topbar.scss"></style>
<style scoped>
.unreads-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  background-color: #ff0000;
  border-radius: 50%;
}
.lang-title {
  margin-left: 8px;
}

.lang-svg {
  width: 24px !important;
  height: 24px !important;
  border-radius: 40px !important;
}

.icon-lang {
  cursor: pointer;
  margin-left: 4px;
}

.langSelect {
  margin-right: 30px;
  transition: all 0.6s;
}

.vertical-line {
  width: 1px;
  height: 32px;
  margin-left: 20px;
  background: #f0f1f4;
  position: relative;
  top: 25%;
}

.langSelect:hover .icon-lang svg path {
  transition: 0.3s;
  fill: #30a1db;
}
</style>
