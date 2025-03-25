<template>
  <div>
    <KTLoader v-if="loaderEnabled" :logo="loaderLogo" />

    <!-- begin:: Body -->
    <div class="page d-flex flex-row flex-column-fluid" id="kt_layout">
      <!-- begin:: Aside Left -->
      <KTAside
        v-if="asideEnabled"
        :lightLogo="themeLightLogo"
        :darkLogo="themeDarkLogo"
      />
      <!-- end:: Aside Left -->

      <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
        <KTHeader :title="pageTitle" />

        <!-- begin:: Content -->
        <div id="kt_content" class="d-flex flex-column flex-column-fluid">
          <transition name="pageChange" mode="out-in">
            <div :key="$route.name">
              <!-- begin:: Content Head -->
              <div
                id="header-toolbar"
                :class="{
                  'custom-height-toolbar':
                    $route.name === 'userMain' ||
                    $route.name === 'userMedic' ||
                    $route.name === 'userHistorySupport' ||
                    $route.name === 'userConditions' ||
                    $route.name === 'userFinancial' ||
                    $route.name === 'userTasks' ||
                    $route.name === 'userComments' ||
                    $route.name === 'userResponsible' ||
                    $route.name === 'userFamily' ||
                    $route.name === 'ProgramSingle' ||
                    $route.name === 'RPCare' ||
                    $route.name === 'ContractSingle' ||
                    $route.name === 'FinancialId' ||
                    $route.name === 'RPActivity',
                }"
              ></div>

              <!-- end:: Content Head -->
            </div>
          </transition>

          <!-- begin:: Content Body -->
          <div class="post d-flex flex-column-fluid">
            <div
              id="kt_content_container"
              :class="{
                'container-fluid': contentWidthFluid,
                'container-xxl': !contentWidthFluid,
              }"
            >
              <RouterView v-slot="{ Component }">
                <transition name="pageChange" mode="out-in">
                  <div :key="$route.name">
                    <component :is="Component" />
                  </div>
                </transition>
              </RouterView>
            </div>
          </div>
          <!-- end:: Content Body -->
        </div>
        <!-- end:: Content -->
        <KTFooter v-if="false" />
      </div>

      <UserActivityTracker />
    </div>
    <!-- end:: Body -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import { MenuComponent } from "@/assets/ts/components";
import KTLoader from "@/components/Loader.vue";
import UserActivityTracker from "@/components/UserActivityTracker.vue";
import {
  asideEnabled,
  contentWidthFluid,
  loaderEnabled,
  loaderLogo,
  subheaderDisplay,
  themeDarkLogo,
  themeLightLogo,
  toolbarDisplay,
} from "@/core/helpers/config";
import { removeModalBackdrop } from "@/core/helpers/dom";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import HtmlClass from "@/core/services/LayoutService";
import KTAside from "@/layout/aside/Aside.vue";
import KTFooter from "@/layout/footer/Footer.vue";
import KTHeader from "@/layout/header/Header.vue";
import { Actions } from "@/store/enums/StoreEnums";

export default defineComponent({
  name: "theme-layout",
  components: {
    UserActivityTracker,
    KTAside,
    KTHeader,
    KTFooter,
    KTLoader,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    // show page loading
    store.dispatch(Actions.ADD_BODY_CLASSNAME, "page-loading");

    // initialize html element classes
    HtmlClass.init();

    const pageTitle = computed(() => {
      return store.getters.pageTitle;
    });

    const breadcrumbs = computed(() => {
      return store.getters.pageBreadcrumbPath;
    });

    onMounted(() => {
      //check if current user is authenticated
      if (!store.getters.isUserAuthenticated) {
        router.push({ name: "sign-in" });
      }

      nextTick(() => {
        reinitializeComponents();
      });

      // Simulate the delay page loading
      setTimeout(() => {
        // Remove page loader after some time
        store.dispatch(Actions.REMOVE_BODY_CLASSNAME, "page-loading");
      }, 500);
    });

    watch(
      () => route.path,
      () => {
        MenuComponent.hideDropdowns(undefined);

        // check if current user is authenticated
        if (!store.getters.isUserAuthenticated) {
          router.push({ name: "sign-in" });
        }

        nextTick(() => {
          reinitializeComponents();
        });
        removeModalBackdrop();
      }
    );

    return {
      toolbarDisplay,
      loaderEnabled,
      contentWidthFluid,
      loaderLogo,
      asideEnabled,
      subheaderDisplay,
      pageTitle,
      breadcrumbs,
      themeLightLogo,
      themeDarkLogo,
    };
  },
});
</script>
<style>
.custom-height-toolbar {
  min-height: 63.73px;
}
</style>
