<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column notification-dropdown w-350px w-lg-375px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex align-items-center justify-content-between bgi-no-repeat rounded-top my-6 mx-5"
    >
      <!--begin::Title-->
      <h3 class="text-i-primary fw-semibold fs-2">
        {{ $t("notification") }}
      </h3>
      <button class="menu-close-btn btn p-0" @click="closeDropdown">
        <inline-svg src="assets/svg/common/close.svg" />
      </button>
      <!--end::Title-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div class="overflow-auto" style="max-height: 350px">
      <div
        class="notification-group"
        v-for="(group, idx) in groupByDate"
        :key="idx"
        :class="{ 'mt-0': idx === 0 }"
      >
        <p
          style="padding-left: 20px"
          class="notification-group__date mx-i-5 mb-i-2"
        >
          {{ parseData(group[0].timestamp) }}
        </p>

        <ul class="list-unstyled notifications m-0">
          <li
            @click="markAsRead(notification)"
            v-for="(notification, idx) in group"
            :key="idx"
            style="height: 60px; padding: 12px 20px"
            class="notification position-relative px-i-5 py-i-3 list-none position-relative d-flex justify-content-between"
          >
            <div
              v-if="!notification.is_read"
              class="position-absolute notif-not-read"
            ></div>
            <span
              v-if="!notification.is_read"
              class="notification__status position-absolute left-0 top-50 translate-middle-y i-bg-green rounded-left-lg w-4px h-32px"
            />
            <p
              class="notification__title"
              :class="[notification.is_read ? 'read' : '']"
            >
              {{ $t(notification.message) }}
            </p>
            <span class="notification__past-time">
              {{ detectTime(notification.timestamp) }}
            </span>
          </li>
        </ul>
      </div>

      <div
        v-if="notifications.length === 0"
        class="p-15 d-flex flex-column align-items-center"
      >
        <inline-svg src="/assets/icons/loyalty/notification.svg" />
        <h3 class="mt-7">{{ $t("no_notification") }}</h3>
      </div>
      <div v-if="params.count > notifications?.length" ref="fetchCont" />
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core";
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { MenuComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";
import {
  INotificationItem,
  TNotificationResponse,
} from "@/types/notifications";

const { t } = useI18n();
const router = useRouter();
const emit = defineEmits(["fetch"]);
const fetchCont = ref<HTMLDivElement | null>(null);

const params = reactive({
  limit: 10,
  offset: 0,
  count: 0,
});

useIntersectionObserver(fetchCont, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    loadMore();
  }
});

const notifications = ref<INotificationItem[]>([]);

async function fetchNotifications() {
  params.offset = 0;
  await ApiService.get<TNotificationResponse>("api/v2/notifications/", {
    params: {
      limit: params.limit,
      offset: params.offset,
    },
  }).then((res) => {
    notifications.value = res.data.results;
    params.count = res.data.count;
  });
}

function loadMore() {
  params.offset += params.limit;
  ApiService.get<TNotificationResponse>("api/v2/notifications/", {
    params: {
      limit: params.limit,
      offset: params.offset,
    },
  }).then((res) => {
    notifications.value = [...notifications.value, ...res.data.results];
  });
}

function closeDropdown() {
  MenuComponent.hideDropdowns(undefined);
}

function markAsRead(notification: any) {
  emit("fetch");
  // ApiService.patch(`api/v2/notifications/${id}/`, {
  //   is_read: true,
  // }).then(() => {
  //   fetchNotifications();
  // });
  ApiService.get(`api/v2/notifications/${notification.id}/`).then(() => {
    fetchNotifications();
  });
  if (notification?.source === "task") {
    router.push(
      `/dashboard/participants/${notification.participant_id}/tasks/${notification.source_id}`
    );
  } else {
    router.push(`/contracts/${notification.source_id}`);
  }
}

const groupByDate = computed(() => {
  const groupedNotifications: { [key: string]: INotificationItem[] } = {};

  notifications.value.forEach((n: INotificationItem) => {
    const date = new Date(n?.timestamp);
    const day = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ) as unknown;

    if (!groupedNotifications[day as string]) {
      groupedNotifications[day as keyof typeof groupedNotifications] = [];
    }

    groupedNotifications[day as keyof typeof groupedNotifications].push(n);
  });

  return Object.values(groupedNotifications);
});

function detectTime(timeString: string) {
  const givenTime = new Date(timeString).getTime();
  const currentTime = new Date().getTime();

  const diffInMinutes = Math.floor((currentTime - givenTime) / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hours`;
  } else {
    return `${diffInMinutes} min`;
  }
}

function parseData(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === today.getTime()) {
    return t("today");
  } else if (inputDate.getTime() === yesterday.getTime()) {
    return t("yesterday");
  } else {
    return dayjs(date).format("DD.MM.YYYY");
  }
}
onMounted(() => {
  fetchNotifications();
});
</script>

<style>
.notif-not-read {
  background: #30a1db;
  width: 4px;
  height: 32px;
  z-index: 1;
  position: absolute;
  left: 0;
  top: 22%;
  border-radius: 0 4px 4px 0;
}
.read {
  color: rgba(53, 61, 53, 0.8);
}
.menu-close-btn svg path {
  transition: all 0.2s ease-in-out;
}

.menu-close-btn:hover svg path {
  stroke: #fd5757;
  transform: scale(0.9);
  transform-origin: center;
}
</style>

<style lang="scss">
.notification-dropdown {
  overflow: hidden;
}

.notification-group {
  margin-top: 8px;

  &:first-child {
    margin-top: 0;
  }

  &__date {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #7d867d;
  }
}

.notification {
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #eee;
  }

  &__status {
    border-radius: 0 4px 4px 0;
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    letter-spacing: -0.3px;
    color: #353d35;
    max-width: 75%;
  }

  &__past-time {
    font-size: 10px;
    line-height: 12px;
    text-align: right;
    color: #30a1db;
    margin-top: 3px;
  }
}
</style>
