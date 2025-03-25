<template>
  <div>
    <Teleport v-if="mounted" to="#header-toolbar">
      <div class="bg-white toolbar-header">
        <div
          class="container py-0 d-flex align-items-center justify-content-between"
        >
          <ElBreadcrumb separator="•">
            <ElBreadcrumbItem :to="{ name: 'Dashboard' }">
              {{ $t("main") }}
            </ElBreadcrumbItem>
            <ElBreadcrumbItem :to="{ name: 'ActiveParticipants' }"
              >{{ $t("menus.participants") }}
            </ElBreadcrumbItem>
            <ElBreadcrumbItem :to="{ name: 'RecentChanges' }"
              >{{ $t("menus.finally_change") }}
            </ElBreadcrumbItem>
            <el-breadcrumb-item>
              {{ detail?.participant?.full_name }}
            </el-breadcrumb-item>
          </ElBreadcrumb>
        </div>
      </div>
    </Teleport>

    <Teleport v-if="mounted" to="#topbar-title">
      {{ $t("recent_changes") }}
    </Teleport>

    <SUserTaskSingleHeader
      :title="detail?.participant?.full_name"
      :id="detail?.participant?.id"
    >
      <template #subtitle>
        <div class="d-flex align-center">
          <inline-svg
            src="/assets/ona/svg/user.svg"
            class="d-inline-block me-2"
          />
          <p class="log-id">ID: {{ detail?.participant?.ID }}</p>
        </div>
      </template>

      <template #details>
        <li>
          <div>
            <p class="detail-content">
              {{ detail?.participant?.responsible_person ?? "-" }}
            </p>
            <p class="detail-title">
              {{ $t("responsible_person") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <p class="detail-content">
              {{ dayjs(detail?.timestamp).format("DD.MM.YYYY, HH:mm:ss") }}
            </p>
            <p class="detail-title">
              {{ $t("userTable.change_time") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <p class="detail-content">
              {{ $t("care_count", { count: detail?.changes_count }) }}
            </p>
            <p class="detail-title">
              {{ $t("changes") }}
            </p>
          </div>
        </li>
        <li>
          <div>
            <p class="detail-content">
              {{ getStatus(detail?.action) }}
            </p>
            <p class="detail-title">
              {{ $t("userTable.status") }}
            </p>
          </div>
        </li>
      </template>
    </SUserTaskSingleHeader>
    <div class="card-task">
      <p class="card-task__title px-8 pt-8">{{ $t("changes") }}</p>
      <STable
        :header-data="usersChangesHeaderData"
        :data="detail?.changes"
        class="main-table user-table"
        :items-per-page="10"
        without-header
      >
        <template v-slot:id="{ row: data }">
          {{ data?.index }}
        </template>
        <template v-slot:field="{ row: data }">
          <div class="user-table__item">
            {{ data?.verbose_name }}
          </div>
        </template>
        <template v-slot:old_value="{ row: data }">
          <span>{{
            data?.old_value?.toLowerCase() === "none" ? "-" : data?.old_value
          }}</span>
        </template>
        <template v-slot:new_value="{ row: data }">
          <div
            v-if="
              data?.field !== 'family_members' || data?.field === 'conditions'
            "
            class="max-w__new_changes"
          >
            {{ !data?.new_value?.length ? "-" : data?.new_value }}
          </div>

          <div v-else class="max-w__new_changes">
            {{
              data?.new_value[0]?.toLowerCase() === "none"
                ? "-"
                : data?.new_value[0]
            }}
          </div>
        </template>
      </STable>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useMounted } from "@/composables/useMounted";
import ApiService from "@/core/services/ApiService";
import SUserTaskSingleHeader from "@/pages/PUser/components/Single/SUserTaskSingleHeader.vue";
import { usersChangesHeaderData } from "@/pages/PUser/data";
import STable from "@/stories/Common/Table/STable.vue";

const { mounted } = useMounted();
const route = useRoute();
const { t } = useI18n();

const detail = ref();

async function fetchUserLogDetail() {
  const { data } = await ApiService.get(
    `api/v2/main/ParticipantLogDetail/${route.params.id}`
  );

  detail.value = data;
  detail.value.changes = JSON.parse(detail.value.changes ?? "{}");
}

function getStatus(statusCode: number) {
  const status = {
    0: t("changed"),
    1: t("created"),
    2: t("deleted"),
  };

  return status[statusCode as keyof typeof status];
}

onBeforeMount(() => {
  fetchUserLogDetail();
});
</script>

<style lang="scss" scoped>
.toolbar-header {
  padding: 8px;
  border-top: 1px solid #eff2f5;
}

.card-task {
  background: #ffffff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  margin-top: 28px;

  .dot {
    width: 4px;
    height: 4px;
    background: #1c1f20;
    border-radius: 999px;
  }

  &__title {
    font-weight: 500;
    font-size: 22px;
    line-height: 140%;
    color: #1c1f20;
  }
}

.log-id {
  font-weight: 500;
  font-size: 13px;
  line-height: 130%;
  color: #a2abbe;
}

.max-w__new_changes {
  max-width: 600px;
  margin-left: auto;
}
</style>
