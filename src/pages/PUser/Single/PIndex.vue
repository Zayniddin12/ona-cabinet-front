<template>
  <div>
    <Transition name="fade" mode="out-in">
      <Teleport v-if="mounted" to="#header-toolbar">
        <div class="custom-height">
          <div class="bg-white toolbar-header">
            <div
              class="container py-0 d-flex align-items-center justify-content-between"
            >
              <div>
                <SBreadcrumb :routes="routes" />
              </div>
              <!--            <el-breadcrumb separator="•">-->
              <!--              <el-breadcrumb-item :to="{ name: 'Dashboard' }">-->
              <!--                {{ $t("main") }}-->
              <!--              </el-breadcrumb-item>-->
              <!--              <el-breadcrumb-item to="/dashboard/participants/active"-->
              <!--                >{{ $t("menus.employees") }}-->
              <!--              </el-breadcrumb-item>-->
              <!--              <el-breadcrumb-item-->
              <!--                >{{ participant?.full_name }}-->
              <!--              </el-breadcrumb-item>-->
              <!--            </el-breadcrumb>-->

              <div class="d-flex align-items-center gap-4">
                <el-switch
                  v-if="useRoleManagement('delete', 'superadmin')"
                  :disabled="participant?.deleted"
                  v-model="form.active"
                  style="
                    --el-switch-on-color: #30a1db;
                    --el-switch-off-color: #f0f0f5;
                  "
                  :inactive-text="$t('active')"
                />
                <div v-if="useRoleManagement('delete', 'superadmin')">
                  <SButton
                    v-if="!participant?.deleted"
                    variant="danger"
                    @click="showArchive = true"
                  >
                    <div class="d-flex align-items-center gap-1">
                      <inline-svg src="/assets/ona/svg/trash.svg" />
                      {{ $t("put_archive") }}
                    </div>
                  </SButton>
                  <SButton
                    v-else
                    variant="secondary"
                    @click="showOutArchive = true"
                  >
                    <div class="d-flex align-items-center gap-1">
                      {{ $t("out_archive") }}
                    </div>
                  </SButton>
                </div>
                <router-link
                  v-if="useRoleManagement('edit')"
                  :to="`/dashboard/participants/${route.params.id}/edit`"
                >
                  <SButton>
                    <div class="d-flex align-items-center gap-1">
                      <inline-svg src="/assets/ona/svg/pen.svg" />
                      {{ $t("edit") }}
                    </div>
                  </SButton>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </Transition>

    <Teleport v-if="mounted" to="#topbar-title">
      {{ $t("menus.employees") }}
    </Teleport>
    <SSingleHeaderCard
      :load="loading"
      :percent="participant.completion_percent"
      @download="downloadShow = true"
      @last="showLastUpdates = true"
      :tabs="tabListUserSingle"
      :active="activeTab"
      :loading="loading"
      :image="participant?.profile_photo?.file"
      :last-update="participant?.updated_at"
      @tab-change="changeTab"
      :title="participant?.full_name"
      class="participant__single"
    >
      <template #badges>
        <div class="d-flex align-items-center gap-1 mt-1">
          <PreloaderSkeleton
            width="42px"
            v-bind="{ loading }"
            height="18px"
            preloader-class="me-7 mb-4"
          >
            <div class="d-flex align-items-center gap-1">
              <inline-svg src="/assets/ona/svg/user-solid.svg" />
              <p class="text-secondary-dark fs-7 fw-bold">
                ID: {{ participant?.ID }}
              </p>
            </div>
          </PreloaderSkeleton>
        </div>
      </template>
      <template #details>
        <li v-if="participant?.birth_date">
          <div>
            <p class="partner-single-details__title">
              {{ dayjs(participant?.birth_date).format("DD.MM.YYYY") }}
            </p>
            <p class="partner-single-details__subtitle">
              {{ $t("birthdate") }}
            </p>
          </div>
        </li>
        <li v-if="participant.phone">
          <div>
            <a :href="`tel: ${participant?.phone}`" class="hover-phone">
              <p class="partner-single-details__title transition-200">
                {{ formatPhoneNumber(`998${participant.phone}`) }}
              </p>
            </a>
            <p class="partner-single-details__subtitle">
              {{ $t("phone_number") }}
            </p>
          </div>
        </li>
        <li v-if="participantPassport">
          <div>
            <div class="d-flex align-items-center gap-1">
              <p class="partner-single-details__title transition-200">
                {{ participantPassport }}
              </p>
              <inline-svg
                v-if="participant?.passport_scan?.length"
                src="/assets/ona/svg/download.svg"
                class="download-li"
                @click="showPassport = true"
              />
            </div>
            <p class="partner-single-details__subtitle">
              {{ $t("passport_id") }}
            </p>
          </div>
        </li>
        <li v-if="participant.programs && participant.programs?.length">
          <div>
            <div class="d-flex align-items-center gap-1">
              <p
                v-if="participant.programs"
                class="partner-single-details__title transition-200"
              >
                {{ participant?.programs[0]?.name }}
              </p>

              <el-tooltip
                v-if="participant?.programs?.length > 1"
                class="program"
                effect="dark"
                :content="tooltipContent(participant?.programs)"
                placement="top"
              >
                <span class="text-blue fw-bolder cursor-pointer hover-opacity"
                  >+{{ participant?.programs?.length - 1 }}</span
                >
              </el-tooltip>
            </div>
            <p class="partner-single-details__subtitle">
              {{ $t("programs") }}
            </p>
          </div>
        </li>
        <li v-if="participant?.point">
          <div>
            <p
              @click="getPointList(participant?.id, participant?.point)"
              class="partner-single-details__title cursor-pointer"
            >
              {{ participant?.point }}
            </p>
            <p class="partner-single-details__subtitle">
              {{ $t("ijt") }}
            </p>
          </div>
        </li>
      </template>
    </SSingleHeaderCard>
    <transition name="pageChange" mode="out-in">
      <template v-if="!loading">
        <RouterView />
      </template>
    </transition>
    <SDownloadModal
      :show="downloadShow"
      @close="downloadShow = false"
      @submit="downloadExcel"
    />
    <SFamilyLightbox
      :show="showPassport"
      :images="participant?.passport_scan"
      @close="showPassport = false"
    />
    <SChangeModal
      :list="lastLogs"
      :show="showLastUpdates"
      @close="showLastUpdates = false"
    />
    <SDeleteTaskModal
      :title="$t('put_archive')"
      :text="$t('put_archive_text')"
      :button-text="$t('put_archive')"
      :show="showArchive"
      @close="showArchive = false"
      @submit="putArchive"
      :loading="buttonLoading"
    />
    <SDeleteTaskModal
      :show="showOutArchive"
      button-variant="primary"
      :title="$t('out_archive')"
      :button-text="$t('out_archive')"
      :text="$t('out_archive_text')"
      @close="showOutArchive = false"
      @submit="outArchive"
      :loading="buttonLoading"
    />
  </div>
  <CBallInfoModal
    :show="showBall"
    @close="showBall = false"
    v-bind="{ pointList, pointsCount }"
  />
</template>

<script setup lang="ts">
import axios from "axios";
import dayjs from "dayjs";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import KtLoading from "@/components/kt-datatable/table-partials/Loading.vue";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import ApiService from "@/core/services/ApiService";
import { formatPhoneNumber } from "@/helpers";
import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";
import CBallInfoModal from "@/pages/PUser/components/Modals/CBallInfoModal.vue";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SChangeModal from "@/pages/PUser/Single/components/ChangesModal/SChangeModal.vue";
import SDownloadModal from "@/pages/PUser/Single/components/Download/SDownloadModal.vue";
import SFamilyLightbox from "@/pages/PUser/Single/components/Family/SFamilyLightbox.vue";
import SSingleHeaderCard from "@/pages/PUser/Single/components/SSingleHeaderCard.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import { tabListUserSingle } from "@/pages/PUser/Single/data";
import { Actions } from "@/store/enums/StoreEnums";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

const { t } = useI18n();
const showArchive = ref(false);
const buttonLoading = ref(false);
const store = useStore();
const router = useRouter();
const route = useRoute();
const { participant, participantPassport } = useParticipant();

const showPassport = ref(false);
const showLastUpdates = ref(false);
const downloadShow = ref(false);
const activeTab = ref();
const showOutArchive = ref(false);
const loading = ref(false);
const lastLogs = ref();
const { mounted } = useMounted();

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.employees",
      route: "/dashboard/participants/active",
      link: false,
    },
    {
      name: t(participant.value.full_name),
      route: "/",
      link: false,
    },
  ];
});
const pointList = ref([]);
const showBall = ref(false);
const pointsCount = ref(0);
async function getPointList(id: number, points: number) {
  pointsCount.value = points;
  showBall.value = true;
  await axios.get(`api/v2/participants/${id}/points/`).then((res) => {
    pointList.value = res.data?.conditions;
  });
}
function changeTab(id: number) {
  activeTab.value = id;
  tabListUserSingle.find((el: any) => {
    if (el.id === id) {
      router.push({
        name: el.path,
      });
    }
  });
}

onMounted(() => {
  tabListUserSingle.forEach((el: any) => {
    if (el.path === route.name) {
      activeTab.value = el.id;
    }
  });
});

const form = ref({
  active: false,
});

function tooltipContent(arr: { name: string }[]) {
  let stringArray: any = [];
  arr.forEach((el: any) => {
    stringArray.push(el?.name);
  });

  return stringArray.toString().replaceAll(",", "; \n");
}
onMounted(() => {
  loading.value = true;
  store
    .dispatch(Actions.FETCH_PARTICIPANT_SINGLE, route.params.id)
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    });
  ApiService.get(
    `api/v2/main/ParticipantLogList?participant=${route?.params?.id}`
  ).then((res: any) => {
    lastLogs.value = res?.data?.results;
  });
});

// Active value change

watch(
  () => participant.value,
  () => {
    form.value.active = participant.value.active;
  }
);

// watch(
//   () => form.value.active,
//   () => {
//     loading.value = true;
//     ApiService.patch(
//       `api/v2/participants/participantUpdate/${route.params.id}/`,
//       {
//         active: form.value.active,
//       }
//     ).finally(() => {
//       loading.value = false;
//     });
//   }
// );

// Put Archive
function putArchive() {
  loading.value = true;
  buttonLoading.value = true;
  ApiService.patch(
    `api/v2/participants/participantUpdate/${route.params.id}/`,
    {
      deleted: true,
    }
  )
    .then(() => {
      store.dispatch(Actions.FETCH_PARTICIPANT_SINGLE, route.params.id);
      showArchive.value = false;
    })
    .finally(() => {
      buttonLoading.value = false;
      loading.value = false;
    });
}

// Out Archive

function outArchive() {
  loading.value = true;
  buttonLoading.value = true;
  ApiService.patch(
    `api/v2/participants/participantUpdate/${route.params.id}/`,
    {
      deleted: false,
    }
  )
    .then(() => {
      store.dispatch(Actions.FETCH_PARTICIPANT_SINGLE, route.params.id);
      showOutArchive.value = false;
    })
    .finally(() => {
      buttonLoading.value = false;
      loading.value = false;
    });
}

// Download for Employee

function downloadExcel(status: string) {
  if (status === "employee") {
    ApiService.query(
      `api/v2/participants/participantDetailExcel/${route?.params?.id}/`,
      {
        responseType: "blob",
      }
    ).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xls");
      link.click();
    });
  } else if (status === "donor") {
    ApiService.query(
      `api/v2/participants/participantDetailPDF/${route?.params?.id}/`,
      {
        responseType: "blob",
      }
    ).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.pdf");
      link.click();
    });
  }
  downloadShow.value = false;
}
</script>

<style lang="scss" scoped>
.partner-single {
  &__status {
    background: #34ba281a;
    padding: 6px 20px;
    border-radius: 6px;
    font-weight: 400;
    font-size: 12px;
    color: #34ba28;
    line-height: 14px;
  }

  &-details {
    &__title {
      font-weight: 700;
      font-size: 14px;
      line-height: 130%;
      color: #353d35;

      span {
        font-weight: 500;
      }
    }

    &__subtitle {
      font-weight: 500;
      font-size: 13px;
      line-height: 130%;
      color: #b5b5c3;
      margin-top: 1px;
    }
  }
}

.toolbar-header {
  padding: 9px 0;
  border-top: 1px solid #eff2f5;
}

.download-li {
  margin-top: -4px;
  cursor: pointer;
  transition: all 200ms ease-in;

  &:hover {
    opacity: 70%;
  }

  &:active {
    transform: scale(0.9);
  }
}
</style>

<style lang="scss">
.el-switch__label.is-active {
  color: #1c1f20 !important;
}

.hover-phone:hover p {
  color: #00a3ff !important;
}

.el-popper {
  /*max-width: 294px !important;*/
  /*width: 100% !important;*/
  white-space: pre-line !important;
  text-align: center !important;
}

.participant__single {
  .el-tabs__nav-wrap {
    padding: 0 44px;

    &::after {
      display: none;
    }
  }

  .el-tabs__nav-prev .el-icon {
    left: 10px;
  }

  .el-tabs__nav-next .el-icon {
    right: 10px;
  }

  .el-icon {
    width: 26px;
    height: 26px;
    background: #ffffff !important;
    border: 1px solid #eff2f5;
    box-shadow: 0px 2px 8px rgba(56, 71, 109, 0.06);
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 11;
    top: 5px;
  }

  .el-tabs__item {
    height: auto !important;
    padding: 0 18px 4px 18px;

    &:last-child {
      padding-right: 18px !important;
    }

    &:nth-child(2) {
      padding-left: 18px !important;
    }
  }

  .el-tabs__item:hover {
    color: #30a1db;
  }

  .el-tabs__item.is-active {
    background: linear-gradient(
      180deg,
      rgba(48, 161, 219, 0) 0%,
      rgba(48, 161, 219, 0.1) 100%
    );
    color: #30a1db;
    bottom: 1px;

    &::after {
      content: "";
      width: 100%;
      height: 2px;
      display: block;
      position: absolute;
      inset: auto 0 0 0;
      background: #30a1db;
      border-radius: 3px;
    }
  }

  .el-tabs__active-bar {
    display: none;
  }
}
</style>
