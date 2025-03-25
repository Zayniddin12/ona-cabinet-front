<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-175px"
    data-kt-menu="true"
    data-kt-element="theme-mode-menu"
    :title="currentLang"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3 my-0" @click="changeLang('ru')">
      <a :class="{ active: currentLang === 'ru' }" class="menu-link px-3 py-2">
        <span class="menu-icon" data-kt-element="icon">
          <span class="svg-icon svg-icon-3">
            <!--            <inline-svg src="/assets/icons/header/lang_ru.svg" />-->
            <img
              src="/assets/icons/header/lang_ru.svg"
              alt=""
              class="lang-flag"
            />
          </span>
        </span>
        <span class="menu-title">Русский</span>
      </a>
    </div>
    <!--end::Menu item-->
    <!--begin::Menu item-->
    <div class="menu-item px-3 my-0" @click="changeLang('uz')">
      <a :class="{ active: currentLang === 'uz' }" class="menu-link px-3 py-2">
        <span class="menu-icon" data-kt-element="icon">
          <span class="svg-icon svg-icon-3">
            <!--            <inline-svg src="/assets/icons/header/lang_uz.svg" />-->
            <img
              src="/assets/icons/header/lang_uz.svg"
              alt=""
              class="lang-flag2"
            />
          </span>
        </span>
        <span class="menu-title">O'zbekcha</span>
      </a>
    </div>
    <!--end::Menu item-->
    <!--begin::Menu item-->
    <!--    <div class="menu-item px-3 my-0" @click="changeLang('en')">-->
    <!--      <a :class="{ active: currentLang === 'en' }" class="menu-link px-3 py-2">-->
    <!--        <span class="menu-icon" data-kt-element="icon">-->
    <!--          <span class="svg-icon svg-icon-3">-->
    <!--            <inline-svg src="/assets//icons/header/lang_ru.svg" />-->
    <!--          </span>-->
    <!--        </span>-->
    <!--        <span class="menu-title">English</span>-->
    <!--      </a>-->
    <!--    </div>-->
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import i18n from "@/core/plugins/i18n";
import { Actions } from "@/store/enums/StoreEnums";

const store = useStore();
const route = useRoute();

const themeMode = computed(() => {
  return store.getters.getThemeMode;
});

const changeLang = (lang: "ru" | "uz") => {
  localStorage.setItem("locale", lang);
  i18n.global.locale.value = lang;
  location.reload();
};

const currentLang = computed(() => {
  return i18n.global.locale.value;
});

const setMode = (mode: string) => {
  store.dispatch(Actions.SET_THEME_MODE_ACTION, mode);
};
</script>

<style scoped>
.lang-flag {
  width: 25px;
  height: 25px;
  /*border-radius: 50%;*/
}
.lang-flag2 {
  width: 20px;
  height: 20px;
  /*border-radius: 50%;*/
}
</style>
