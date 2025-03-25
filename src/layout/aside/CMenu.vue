<template>
  <!--begin::Menu wrapper-->
  <div
    id="kt_aside_menu_wrapper"
    ref="scrollElRef"
    class="hover-scroll-overlay-y my-5 my-lg-5"
    data-kt-scroll="true"
    data-kt-scroll-activate="{default: false, lg: true}"
    data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
    data-kt-scroll-height="auto"
    data-kt-scroll-offset="0"
    data-kt-scroll-wrappers="#kt_aside_menu"
  >
    <!--begin::Menu-->
    <div
      id="#kt_header_menu"
      class="as_menu menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
      data-kt-menu="true"
    >
      <template
        v-for="(item, i) in useRoleManagement('edit')
          ? DocMenuConfig
          : isResponsiblePerson
          ? ResponsiblePersonMenus
          : DocMenuConfigAuth"
        :key="i"
      >
        <div v-if="item.heading" class="menu-item">
          <div class="menu-content pt-8 pb-2">
            <span class="menu-section text-muted text-uppercase fs-8 ls-1">
              {{ $t(item.heading) }}
            </span>
          </div>
        </div>
        <template v-for="(menuItem, k) in item.pages" :key="k">
          <template v-if="menuItem.heading">
            <div class="menu-item" :key="route.path">
              <a
                v-if="menuItem.link"
                :href="menuItem.link"
                class="menu-link"
                target="_blank"
              >
                <span
                  v-if="menuItem.svgIcon || menuItem.fontIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="asideMenuIcons === 'font'"
                    :class="menuItem.fontIcon"
                    class="bi fs-3"
                  ></i>
                  <span
                    v-else-if="asideMenuIcons === 'svg'"
                    class="svg-icon svg-icon-2"
                  >
                    <inline-svg :src="menuItem.svgIcon" />
                  </span>
                </span>
                <span class="menu-title">{{ $t(menuItem.heading) }}</span>
              </a>
              <router-link
                v-else
                class="menu-link"
                active-class="active"
                :to="menuItem.route"
              >
                <span
                  v-if="menuItem.svgIcon || menuItem.fontIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="asideMenuIcons === 'font'"
                    :class="menuItem.fontIcon"
                    class="bi fs-3"
                  ></i>
                  <span
                    v-else-if="asideMenuIcons === 'svg'"
                    class="svg-icon svg-icon-2"
                  >
                    <inline-svg :src="menuItem.svgIcon" />
                  </span>
                </span>
                <span class="menu-title">{{ $t(menuItem.heading) }}</span>
              </router-link>
            </div>
          </template>
          <div
            v-if="menuItem.sectionTitle"
            :key="route.path"
            :class="{
              show: hasActiveChildren(menuItem.route),
              active: hasActiveChildren(menuItem.route),
            }"
            class="menu-item menu-accordion"
            data-kt-menu-sub="accordion"
            data-kt-menu-trigger="click"
          >
            <span class="menu-link">
              <span
                v-if="menuItem.svgIcon || menuItem.fontIcon"
                class="menu-icon"
              >
                <i
                  v-if="asideMenuIcons === 'font'"
                  :class="menuItem.fontIcon"
                  class="bi fs-3"
                />
                <span
                  v-else-if="asideMenuIcons === 'svg'"
                  class="svg-icon svg-icon-2"
                >
                  <inline-svg :src="menuItem.svgIcon" />
                </span>
              </span>
              <span class="menu-title">{{ $t(menuItem.sectionTitle) }}</span>
              <span class="menu-arrow-icon">
                <inline-svg src="/assets/icons/menu/arrow.svg" />
              </span>
            </span>
            <div
              :class="{ show: hasActiveChildren(menuItem.route) }"
              class="menu-sub menu-sub-accordion"
            >
              <template v-for="(item2, k) in menuItem.sub" :key="k">
                <div v-if="item2.heading" class="menu-item">
                  <router-link
                    class="menu-link"
                    active-class="active"
                    :to="item2.route"
                  >
                    <!-- <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span> -->
                    <span class="menu-title">
                      <span class="index">-</span>
                      {{ $t(item2.heading) }}</span
                    >
                  </router-link>
                </div>
                <div
                  v-if="item2.sectionTitle"
                  :class="{ show: hasActiveChildren(item2.route) }"
                  class="menu-item menu-accordion"
                  data-kt-menu-sub="accordion"
                  data-kt-menu-trigger="click"
                >
                  <span class="menu-link">
                    <!-- <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span> -->
                    <span class="menu-title">
                      <span class="index">-</span>
                      {{ $t(item2.sectionTitle) }}
                    </span>
                    <span class="menu-arrow"></span>
                  </span>
                  <div
                    :class="{ show: hasActiveChildren(item2.route) }"
                    class="menu-sub menu-sub-accordion"
                  >
                    <template v-for="(item3, k) in item2.sub" :key="k">
                      <div v-if="item3.heading" class="menu-item">
                        <router-link
                          class="menu-link"
                          active-class="active"
                          :to="item3.route"
                        >
                          <!-- <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span> -->
                          <span class="menu-title">
                            <span class="index">-</span>
                            {{ $t(item3.heading) }}
                          </span>
                        </router-link>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <div
          v-if="!isResponsiblePerson"
          class="text-white ml-4 menu-item setting"
        >
          {{ $t("menus.setting") }}
        </div>
        <template v-for="(menuItem, i) in item.settingItem" :key="i * 12">
          <template v-if="menuItem.heading">
            <div class="menu-item" :key="route.path">
              <a
                v-if="menuItem.link"
                :href="menuItem.link"
                class="menu-link"
                target="_blank"
              >
                <span
                  v-if="menuItem.svgIcon || menuItem.fontIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="asideMenuIcons === 'font'"
                    :class="menuItem.fontIcon"
                    class="bi fs-3"
                  ></i>
                  <span
                    v-else-if="asideMenuIcons === 'svg'"
                    class="svg-icon svg-icon-2"
                  >
                    <inline-svg :src="menuItem.svgIcon" />
                  </span>
                </span>
                <span class="menu-title">{{ $t(menuItem.heading) }}</span>
              </a>
              <router-link
                v-else
                class="menu-link"
                active-class="active"
                :to="menuItem.route"
              >
                <span
                  v-if="menuItem.svgIcon || menuItem.fontIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="asideMenuIcons === 'font'"
                    :class="menuItem.fontIcon"
                    class="bi fs-3"
                  ></i>
                  <span
                    v-else-if="asideMenuIcons === 'svg'"
                    class="svg-icon svg-icon-2"
                  >
                    <inline-svg :src="menuItem.svgIcon" />
                  </span>
                </span>
                <span class="menu-title">{{ $t(menuItem.heading) }}</span>
              </router-link>
            </div>
          </template>
          <div
            v-if="menuItem.sectionTitle"
            :class="{
              show: hasActiveChildren(menuItem.route),
              active: hasActiveChildren(menuItem.route),
            }"
            :key="route.path"
            class="menu-item menu-accordion"
            data-kt-menu-sub="accordion"
            data-kt-menu-trigger="click"
          >
            <span class="menu-link">
              <span
                v-if="menuItem.svgIcon || menuItem.fontIcon"
                class="menu-icon"
              >
                <i
                  v-if="asideMenuIcons === 'font'"
                  :class="menuItem.fontIcon"
                  class="bi fs-3"
                />
                <span
                  v-else-if="asideMenuIcons === 'svg'"
                  class="svg-icon svg-icon-2"
                >
                  <inline-svg :src="menuItem.svgIcon" />
                </span>
              </span>
              <span class="menu-title">{{ $t(menuItem.sectionTitle) }}</span>
              <span class="menu-arrow-icon">
                <inline-svg src="/assets/icons/menu/arrow.svg" />
              </span>
            </span>
            <div
              :class="{ show: hasActiveChildren(menuItem.route) }"
              class="menu-sub menu-sub-accordion"
            >
              <template v-for="(item2, k) in menuItem.sub" :key="k">
                <div v-if="item2.heading" class="menu-item">
                  <router-link
                    class="menu-link"
                    active-class="active"
                    :to="item2.route"
                  >
                    <span class="menu-title">
                      <span class="index">-</span>
                      {{ $t(item2.heading) }}</span
                    >
                  </router-link>
                </div>
                <div
                  v-if="item2.sectionTitle"
                  :class="{ show: hasActiveChildren(item2.route) }"
                  class="menu-item menu-accordion"
                  data-kt-menu-sub="accordion"
                  data-kt-menu-trigger="click"
                >
                  <span class="menu-link">
                    <span class="menu-title">
                      <span class="index">-</span>
                      {{ $t(item2.sectionTitle) }}
                    </span>
                    <span class="menu-arrow"></span>
                  </span>
                  <div
                    :class="{ show: hasActiveChildren(item2.route) }"
                    class="menu-sub menu-sub-accordion"
                  >
                    <template v-for="(item3, k) in item2.sub" :key="k">
                      <div v-if="item3.heading" class="menu-item">
                        <router-link
                          class="menu-link"
                          active-class="active"
                          :to="item3.route"
                        >
                          <span class="menu-title">
                            <span class="index">-</span>
                            {{ $t(item3.heading) }}
                          </span>
                        </router-link>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>

      <template>
        <div class="menu-item">
          <div class="menu-content pt-8 pb-2">
            <span class="menu-section text-muted text-uppercase fs-8 ls-1">
            </span>
          </div>
        </div>
      </template>
      <div class="menu-item mt-4">
        <div class="setting"></div>
      </div>
    </div>
    <!--end::Menu-->
  </div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import useRoleManagement from "@/composables/useRoleManagement";
import {
  DocMenuConfig,
  DocMenuConfigAuth,
  ResponsiblePersonMenus,
} from "@/core/config/CleanMainMenuConfig";
import { asideMenuIcons } from "@/core/helpers/config";

const route = useRoute();
const scrollElRef = ref<null | HTMLElement>(null);

onMounted(() => {
  if (scrollElRef.value) {
    scrollElRef.value.scrollTop = 0;
  }
});

const hasActiveChildren = (match: string) => {
  return route.path.indexOf(match) !== -1;
};

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});
</script>

<style lang="sass" src="@/assets/sass/header/menu.sass">
.setting
  margin-left: 14px
</style>
