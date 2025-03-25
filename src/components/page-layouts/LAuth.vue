<template>
  <div class="overflow-hidden h-100">
    <div class="row h-100 auth-layout">
      <div
        class="d-flex col-6 flex-center align-items-center flex-column flex-column-fluid justify-content-between gap-6 p-10 pb-lg-20 auth-layout__left"
      >
        <a href="#" class="logo">
          <img src="/assets/logos/auth-logo.svg" alt="" />
        </a>

        <router-view></router-view>
        <div class="text-center d-flex align-items-center privacy-policy">
          <a href="#" class="auth__link" target="_blank">
            {{ $t("privacy_policy") }}
          </a>
          <p class="separator">·</p>
          <p class="auth__version text-center">
            {{ $t("version") }} {{ appVersion }}
          </p>
        </div>
      </div>
      <div
        class="auth-layout__right col-6 h-100 position-relative overflow-hidden d-flex align-items-center justify-content-center"
      >
        <inline-svg
          src="/assets/logos/auth-logo-side.svg"
          class="auth-layout__right__svg"
        />
        <div class="auth-layout__right__logo position-absolute">
          <p class="description">Made with 💙 by:</p>
          <a href="https://uic.group/" target="_blank" class="">
            <inline-svg src="/assets/logos/uic.svg" />
            <inline-svg src="/assets/logos/uic-text.svg" class="text" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

import { Actions } from "@/store/enums/StoreEnums";

const store = useStore();

const appVersion = computed(() => {
  return import.meta.env.VITE_APP_PROJECT_VERSION;
});

onMounted(() => {
  store.dispatch(Actions.ADD_BODY_CLASSNAME, "bg-body");
});

onUnmounted(() => {
  store.dispatch(Actions.REMOVE_BODY_CLASSNAME, "bg-body");
});
</script>

<style lang="scss" scoped>
.auth-layout {
  &__right {
    background: linear-gradient(180deg, #071a24 0%, rgba(7, 26, 36, 0.95) 100%);
    overflow: hidden;

    &__svg {
      top: 3%;
      left: 0;
    }

    &__logo {
      padding-bottom: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      bottom: 0;
      margin-right: -70px;

      .text {
        transition: all 300ms;
        opacity: 0;
        transform: translateX(20px);
      }

      &:hover {
        .text {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .description {
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        color: #fff;
      }
    }
  }

  &__left {
    .logo {
      margin-top: 64px;
    }
  }
}

.auth__link {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #a2abbe;
  text-decoration-line: underline;
}

.auth__version {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #7d867d;
}

.privacy-policy {
  gap: 6px;
  align-items: center;

  p {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #a2abbe;
  }

  .separator {
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
  }
}
</style>
