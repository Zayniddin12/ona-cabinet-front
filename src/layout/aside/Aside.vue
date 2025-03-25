<template>
  <!--begin::Aside-->
  <div
    id="kt_aside"
    class="aside aside-hoverable"
    :class="[
      asideTheme === 'light' && 'aside-light',
      asideTheme === 'dark' && 'aside-dark',
    ]"
    data-kt-drawer="true"
    data-kt-drawer-name="aside"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
    data-kt-drawer-direction="start"
    data-kt-drawer-toggle="#kt_aside_mobile_toggle"
  >
    <!--begin::Brand-->
    <div class="aside-logo flex-column-auto" id="kt_aside_logo">
      <!--begin::Logo-->
      <router-link to="/dashboard">
        <img
          alt="Logo"
          src="@/assets/images/logo/main.svg"
          class="app-sidebar-logo-default"
        />
        <!--        <img-->
        <!--          alt="Logo"-->
        <!--          src="@/assets/images/logo/main.svg"-->
        <!--          class="app-sidebar-logo-default minimized"-->
        <!--        />-->
      </router-link>
      <!--end::Logo-->

      <!--begin::Aside toggler-->
      <div
        id="kt_aside_toggle"
        class="btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle"
        data-kt-toggle="true"
        data-kt-toggle-state="active"
        data-kt-toggle-target="body"
        data-kt-toggle-name="aside-minimize"
      >
        <span class="svg-icon svg-icon-1 rotate-180">
          <inline-svg src="/assets/icons/menu/double_arrow.svg" />
        </span>
      </div>
      <!--end::Aside toggler-->
    </div>
    <!--end::Brand-->

    <!--begin::Aside menu-->
    <div class="aside-menu flex-column-fluid">
      <KTMenu />
    </div>
    <!--end::Aside menu-->

    <!--begin::Footer-->
    <div
      v-if="false"
      class="aside-footer flex-column-auto pt-5 pb-7 px-5"
      id="kt_aside_footer"
    >
      <p class="policy">
        <a href="#">{{ $t("privacy_policy") }}</a>
      </p>
      <div class="info">
        <p>{{ $t("version") }}: 7.1.2</p>
        <a href="https://uic.group" class="logo-link" target="_blank">
          <img src="@/assets/images/logo/uic.svg" />
          <img
            src="@/assets/images/logo/uic_group_text.svg"
            class="logo-link__text"
          />
        </a>
      </div>
    </div>
    <!--end::Footer-->

    <div class="bg"></div>
  </div>
  <!--end::Aside-->
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

import { asideTheme } from "@/core/helpers/config";
import KTMenu from "@/layout/aside/CMenu.vue";

export default defineComponent({
  name: "KTAside",
  components: {
    KTMenu,
  },
  props: {
    lightLogo: String,
    darkLogo: String,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();

    const themeMode = computed(() => {
      return store.getters.getThemeMode;
    });

    return {
      asideTheme,
      themeMode,
      t,
    };
  },
});
</script>

<style lang="sass" scoped>
.app-sidebar-logo-default
  width: 70px

body[data-kt-aside-minimize="on"]
  #kt_aside:not(:hover)
    .app-sidebar-logo-default
      display: none

    .app-sidebar-logo-default.minimized
      display: inline

    .aside-footer
      opacity: 0

#kt_aside
  background-color: #010a01

  .aside-logo
    border-bottom: solid 1px rgba(255, 255, 255, 0.12)

  .app-sidebar-logo-default.minimized
    display: none

  .aside-logo, .aside-menu
    background: #04141C

  .aside-footer
    color: #7D867D
    font-size: 12px
    padding: 24px !important
    height: max-content !important
    transition: 0.3s
    min-width: 250px
    overflow-x: hidden

    p
      margin: 0 !important
      line-clamp: 1

    .policy
      margin-bottom: 10px !important
      width: 100%

    a
      color: #7D867D
      text-decoration: underline

    .info
      display: flex
      grid-gap: 12px

    .logo-link
      &__text
        transition: .2s
        transform: scale(0.3)
        opacity: 0
        margin-left: 4px

      &:hover
        .logo-link__text
          transform: scale(1)
          opacity: 1
  .bg
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 200px
    z-index: -1
    opacity: 0.5
    background: linear-gradient(to top, #010A01,  #7DBA28)
</style>
