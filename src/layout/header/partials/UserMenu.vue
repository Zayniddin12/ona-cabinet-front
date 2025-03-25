<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semobold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ users?.first_name }} {{ users?.last_name }}
            <!--            <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"-->
            <!--              >Pro</span-->
            <!--            >-->
          </div>
          <!--          text-hover-primary-->
          <p class="fw-semobold text-muted fs-7">{{ users?.email }}</p>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <!--    <div class="menu-item px-5">-->
    <!--      <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--        My Profile-->
    <!--      </router-link>-->
    <!--    </div>-->
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <!--    <div class="menu-item px-5">-->
    <!--      <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--        <span class="menu-text">My Projects</span>-->
    <!--        <span class="menu-badge">-->
    <!--          <span class="badge badge-light-danger badge-circle fw-bold fs-7"-->
    <!--            >3</span-->
    <!--          >-->
    <!--        </span>-->
    <!--      </router-link>-->
    <!--    </div>-->
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <!--    <div-->
    <!--      class="menu-item px-5"-->
    <!--      data-kt-menu-trigger="hover"-->
    <!--      data-kt-menu-placement="left-start"-->
    <!--      data-kt-menu-flip="center, top"-->
    <!--    >-->
    <!--      <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--        <span class="menu-title">My Subscription</span>-->
    <!--        <span class="menu-arrow"></span>-->
    <!--      </router-link>-->

    <!--      &lt;!&ndash;begin::Menu sub&ndash;&gt;-->
    <!--      <div class="menu-sub menu-sub-dropdown w-175px py-4">-->
    <!--        &lt;!&ndash;begin::Menu item&ndash;&gt;-->
    <!--        <div class="menu-item px-3">-->
    <!--          <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--            Referrals-->
    <!--          </router-link>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;end::Menu item&ndash;&gt;-->

    <!--        &lt;!&ndash;begin::Menu item&ndash;&gt;-->
    <!--        <div class="menu-item px-3">-->
    <!--          <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--            Billing-->
    <!--          </router-link>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;end::Menu item&ndash;&gt;-->

    <!--        &lt;!&ndash;begin::Menu item&ndash;&gt;-->
    <!--        <div class="menu-item px-3">-->
    <!--          <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--            Payments-->
    <!--          </router-link>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;end::Menu item&ndash;&gt;-->

    <!--        &lt;!&ndash;begin::Menu item&ndash;&gt;-->
    <!--        <div class="menu-item px-3">-->
    <!--          <router-link-->
    <!--            to="/pages/profile/overview"-->
    <!--            class="menu-link d-flex flex-stack px-5"-->
    <!--          >-->
    <!--            Statements-->

    <!--            <i-->
    <!--              class="fas fa-exclamation-circle ms-2 fs-7"-->
    <!--              data-bs-toggle="tooltip"-->
    <!--              title="View your statements"-->
    <!--            ></i>-->
    <!--          </router-link>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;end::Menu item&ndash;&gt;-->

    <!--        &lt;!&ndash;begin::Menu separator&ndash;&gt;-->
    <!--        <div class="separator my-2"></div>-->
    <!--        &lt;!&ndash;end::Menu separator&ndash;&gt;-->

    <!--        &lt;!&ndash;begin::Menu item&ndash;&gt;-->
    <!--        <div class="menu-item px-3">-->
    <!--          <div class="menu-content px-3">-->
    <!--            <label-->
    <!--              class="form-check form-switch form-check-custom form-check-solid"-->
    <!--            >-->
    <!--              <input-->
    <!--                class="form-check-input w-30px h-20px"-->
    <!--                type="checkbox"-->
    <!--                value="1"-->
    <!--                checked="checked"-->
    <!--                name="notifications"-->
    <!--              />-->
    <!--              <span class="form-check-label text-muted fs-7">-->
    <!--                Notifications-->
    <!--              </span>-->
    <!--            </label>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;end::Menu item&ndash;&gt;-->
    <!--      </div>-->
    <!--      &lt;!&ndash;end::Menu sub&ndash;&gt;-->
    <!--    </div>-->
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <!--    <div class="menu-item px-5">-->
    <!--      <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--        My Statements-->
    <!--      </router-link>-->
    <!--    </div>-->
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <!--    <div class="separator my-2"></div>-->
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <!--    <div-->
    <!--      class="menu-item px-5"-->
    <!--      data-kt-menu-trigger="hover"-->
    <!--      data-kt-menu-placement="left-start"-->
    <!--      data-kt-menu-flip="center, top"-->
    <!--    >-->
    <!--      <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--        <span class="menu-title position-relative">-->
    <!--          Language-->
    <!--          <span-->
    <!--            class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"-->
    <!--          >-->
    <!--            {{ currentLanguageLocale }}-->
    <!--            <img-->
    <!--              class="w-15px h-15px rounded-1 ms-2"-->
    <!--              :src="currentLanguageLocale"-->
    <!--              alt="metronic"-->
    <!--            />-->
    <!--          </span>-->
    <!--        </span>-->
    <!--      </router-link>-->

    <!--      &lt;!&ndash;begin::Menu sub&ndash;&gt;-->
    <!--&lt;!&ndash;      <div class="menu-sub menu-sub-dropdown w-175px py-4">&ndash;&gt;-->
    <!--&lt;!&ndash;        &lt;!&ndash;begin::Menu item&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;        <div class="menu-item px-3">&ndash;&gt;-->
    <!--&lt;!&ndash;          <a&ndash;&gt;-->
    <!--&lt;!&ndash;            @click="setLang('en')"&ndash;&gt;-->
    <!--&lt;!&ndash;            href="#"&ndash;&gt;-->
    <!--&lt;!&ndash;            class="menu-link d-flex px-5"&ndash;&gt;-->
    <!--&lt;!&ndash;            :class="{ active: currentLanguage('en') }"&ndash;&gt;-->
    <!--&lt;!&ndash;          >&ndash;&gt;-->
    <!--&lt;!&ndash;            English&ndash;&gt;-->
    <!--&lt;!&ndash;          </a>&ndash;&gt;-->
    <!--&lt;!&ndash;        </div>&ndash;&gt;-->
    <!--&lt;!&ndash;        &lt;!&ndash;end::Menu item&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;      </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;end::Menu sub&ndash;&gt;-->
    <!--    </div>-->
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <!--    <div class="menu-item px-5 my-1">-->
    <!--      <router-link to="/pages/profile/overview" class="menu-link px-5">-->
    <!--        Account Settings-->
    <!--      </router-link>-->
    <!--    </div>-->
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5">{{ $t("sign_out") }}</a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import i18n from "@/core/plugins/i18n";
import { Actions } from "@/store/enums/StoreEnums";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const store = useStore();

    const countries: { [key: string]: { flag: string; name: string } } = {
      en: {
        flag: "/assets/flagsunited-states.svg",
        name: "English",
      },
      es: {
        flag: "/assets/flagsspain.svg",
        name: "Spanish",
      },
      de: {
        flag: "/assets/flagsgermany.svg",
        name: "German",
      },
      ja: {
        flag: "/assets/flagsjapan.svg",
        name: "Japanese",
      },
      fr: {
        flag: "/assets/flagsfrance.svg",
        name: "French",
      },
    };

    const users = computed(() => {
      return useStore().getters.currentUser;
    });

    const signOut = () => {
      store
        .dispatch(Actions.LOGOUT)
        .then(() => router.push({ name: "sign-in" }));
    };

    const setLang = (lang: "ru" | "uz" | "en") => {
      localStorage.setItem("locale", lang);
      i18n.global.locale.value = lang;
    };

    const currentLanguage = (lang: string) => {
      return i18n.global.locale.value === lang;
    };

    const currentLanguageLocale = computed(() => {
      return countries[i18n.global.locale.value];
    });

    return {
      signOut,
      setLang,
      currentLanguage,
      users,
      currentLanguageLocale,
      countries,
    };
  },
});
</script>
