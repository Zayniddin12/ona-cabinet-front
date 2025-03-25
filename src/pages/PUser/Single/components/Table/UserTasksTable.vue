<template>
  <div>
    <STable
      v-bind="{ total, loading, currentPage, itemsPerPage }"
      :header-data="headerData"
      :data="tableData"
      :title="$t(title)"
      :subtitle_count="subtitleCount"
      :subtitle="$t(subtitle)"
      class="main-table user-table"
      no-search
      @page-change="$emit('page-change', $event)"
      @on-items-per-page-change="$emit('on-items-per-page-change', $event)"
    >
      <template #beforeSearch>
        <div class="user-table__actions">
          <div class="d-flex align-items-center gap-4">
            <p class="fs-7 text-gray-400 flex-shrink-0">
              {{ $t("status_task") }}
            </p>
            <el-select v-model="form.status">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <SButton
            v-if="useRoleManagement('edit')"
            variant="primary"
            :text="$t('add_new')"
            @click="$emit('add')"
          >
            <template #pre-icon>
              <img src="/assets/svg/buttons/plus.svg" alt="plus" />
            </template>
          </SButton>
        </div>
      </template>
      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data.index, offset) }}.
      </template>
      <template v-slot:title="{ row: data }">
        <router-link
          :to="`/dashboard/participants/${route?.params?.id}/tasks/${data?.id}`"
          class="task__title"
        >
          {{ data?.name }}
        </router-link>
      </template>
      <template v-slot:akt="{ row: data }">
        {{ data?.akt_number }}
      </template>
      <template v-slot:status="{ row: data }">
        <SBadge :text="$t(data?.status)" :variant="getVariant(data?.status)" />
      </template>
      <template v-slot:responsible="{ row: data }">
        <span v-if="data?.responsible_data?.user">{{
          data?.responsible_data?.user
        }}</span>
        <span v-else>-</span>
      </template>
      <template v-slot:deadline="{ row: data }">
        {{ formatDate(data?.deadline) }}
      </template>
      <template
        v-if="useRoleManagement('delete', 'admin')"
        v-slot:actions="{ row: data }"
      >
        <el-dropdown
          class="user-table__action-dropdown"
          trigger="click"
          placement="bottom-end"
        >
          <button class="btn w-25px h-25px p-0">
            <inline-svg src="/assets/ona/svg/dots-vertical.svg" class="dot" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="border-b" @click="$emit('edit', data)">
                <div class="d-flex align-items-center">
                  <inline-svg
                    src="/assets/ona/svg/pen-solid.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span>{{ $t("edit") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="useRoleManagement('delete', 'superadmin')"
                class="border-b delete"
                @click="$emit('delete', data)"
              >
                <div class="d-flex align-items-center">
                  <inline-svg
                    src="/assets/ona/svg/trash.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span>{{ $t("delete") }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </STable>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import useRoleManagement from "@/composables/useRoleManagement";
import { calcTabIndex, formatDate } from "@/helpers";
import SBadge from "@/stories/Common/Badge/SBadge.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

interface Props {
  headerData?: Array<any>;
  title?: string;
  subtitle?: string;
  subtitleCount?: number;
  fetchUrl?: string;
  total?: number;
  offset?: number;
  limit?: number;
  loading?: boolean;
  tableData?: any;
  currentPage?: number;
  itemsPerPage?: number;
}

withDefaults(defineProps<Props>(), {});

function getVariant(status: string) {
  if (status === "not_completed") {
    return "red";
  } else if (status === "on_process") {
    return "yellow";
  } else {
    return "green";
  }
}

const form = ref({
  status: "",
});

const options = [
  {
    value: "",
    label: t("all"),
  },
  {
    value: "not_completed",
    label: t("not_completed"),
  },
  {
    value: "completed",
    label: t("completed"),
  },
  {
    value: "on_process",
    label: t("on_process"),
  },
];

watch(
  () => form.value.status,
  () => {
    if (form.value.status) {
      router.push({ query: { status: form.value?.status } });
    } else {
      router.push(`/dashboard/participants/${route.params.id}/tasks`);
    }
  }
);
</script>

<style lang="scss" scoped>
.task__title {
  color: #1c1f20;

  &:hover {
    color: #00a3ff;
  }
}
</style>
