<template>
  <div>
    <STable
      v-bind="{ data, currentPage, loading, itemsPerPage }"
      :total="totalCount"
      :header-data="moderatorsHeaderData"
      :title="$t('menus.transactions')"
      :subtitle-count="totalCount"
      :subtitle="$t('moderators_count')"
      class="main-table user-table"
      statusKey="is_active"
      :statusColors="{ true: 'green', false: 'gray' }"
      search-class="search"
      @search="$emit('search', $event)"
      @on-items-per-page-change="$emit('on-items-per-page-change', $event)"
      @page-change="$emit('page-change', $event)"
    >
      <template #afterSearch>
        <div class="user-table__actions ms-6">
          <SButton variant="secondary" text="" @click="showFilter = true">
            <template #pre-icon>
              <inline-svg src="/assets/ona/svg/filter.svg" />
            </template>
          </SButton>
          <SButton
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
        {{ calcTabIndex(data.index, offset) }}
      </template>
      <template v-slot:login="{ row: data }">
        <WordHighlighter :query="$route?.query?.search || ''">
          {{ data?.username }}
        </WordHighlighter>
      </template>
      <template v-slot:email="{ row: data }">
        {{ data?.email }}
      </template>
      <template v-slot:name="{ row: data }">
        {{ data?.first_name }}
      </template>
      <template v-slot:see="{ row: data }">
        <SCheckStatus :active="data?.is_active" />
      </template>
      <template v-slot:edit="{ row: data }">
        <SCheckStatus :active="data?.is_staff" />
      </template>
      <template v-slot:admin="{ row: data }">
        <SCheckStatus :active="data?.is_superuser" />
      </template>
      <template v-slot:actions="{ row: data }">
        <el-dropdown
          v-if="
            (data?.type !== 'superadmin' && users?.type === 'admin') ||
            users?.type === 'superadmin'
          "
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
              <el-dropdown-item class="border-b" @click="$emit('change', data)">
                <div class="d-flex align-items-center">
                  <inline-svg
                    src="/assets/ona/svg/lock.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span>{{ $t("change_password") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  (data?.type !== 'superadmin' && users?.type === 'admin') ||
                  users?.type === 'superadmin'
                "
                class="border-b"
                :class="data?.is_active ? 'delete' : 'restart'"
                @click="deleteModerator(data)"
              >
                <div class="d-flex align-items-center">
                  <inline-svg
                    v-if="data?.is_active"
                    src="/assets/ona/svg/trash.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <inline-svg
                    v-else
                    src="/assets/ona/svg/restart.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span>{{
                    data?.is_active
                      ? $t("make_inactive")
                      : $t("restart_activity")
                  }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  ((data?.type !== 'superadmin' && users?.type === 'admin') ||
                    users?.type === 'superadmin') &&
                  !data?.is_active
                "
                class="border-b delete__item"
                :class="data?.is_deleted"
                @click="$emit('on-delete', data)"
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
        <el-dropdown
          v-if="data?.id === users?.id && !useRoleManagement('edit', 'admin')"
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
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #footerLeft>
        <STableLabels v-bind="{ labels }" />
      </template>
    </STable>
  </div>
  <CUserFilterModal
    :show="showFilter"
    full
    item-style="col-12"
    width="30%"
    bodyClass="grid-moderators"
    :filters="computedFilter"
    @change="change"
    @close="showFilter = false"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import WordHighlighter from "vue-word-highlighter";
import { useStore } from "vuex";

import useRoleManagement from "@/composables/useRoleManagement";
import { calcTabIndex, updateQueryParams } from "@/helpers";
import {
  filters,
  labels,
  moderatorsHeaderData,
} from "@/pages/Moderators/components/data";
import SCheckStatus from "@/pages/Moderators/components/SCheckStatus.vue";
import CUserFilterModal from "@/pages/PUser/components/Modals/CUserFilterModal.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import STableLabels from "@/stories/Common/TableLabels/STableLabels.vue";

const users = computed(() => {
  return useStore().getters.currentUser;
});

const emit = defineEmits([
  "search",
  "on-items-per-page-change",
  "page-change",
  "add",
  "edit",
  "change",
  "delete",
  "on-change-filter",
  "restart",
]);

interface Props {
  data: Array<any>;
  offset?: number;
  totalCount?: number;
  currentPage?: number;
  loading?: boolean;
  itemsPerPage?: number;
}

withDefaults(defineProps<Props>(), {});

const route = useRoute();

const showFilter = ref(false);

const computedFilter = ref();

const filtersClone = [...filters];

const queryViewer = route.query?.is_active;
const queryStaff = route.query?.type;

if (queryViewer && queryViewer?.length > 0) {
  filtersClone[0].fieldValue = queryViewer;
}

if (queryStaff && queryStaff?.length > 0) {
  filtersClone[1].fieldValue = queryStaff;
}

computedFilter.value = filtersClone;

function change(data: { is_active?: boolean; is_staff?: boolean }) {
  showFilter.value = false;

  const queryParams: { [key: string]: string } = {};
  if (data.is_active !== undefined) {
    queryParams.is_active = String(data.is_active);
  } else {
    queryParams.is_active = undefined;
  }

  if (data.is_staff !== undefined) {
    queryParams.type = String(data.type);
  } else {
    queryParams.type = undefined;
  }

  updateQueryParams(queryParams, true);
  emit("on-change-filter", data);
}

const deleteModerator = (data: { is_active?: boolean; is_staff?: boolean }) => {
  if (data?.is_active) {
    emit("delete", data);
  } else {
    emit("restart", data);
  }
};

watch(
  () => showFilter.value,
  () => {
    const queryViewer = route.query?.is_active;
    const queryStaff = route.query?.type;
    filtersClone[0].fieldValue = queryViewer;

    filtersClone[1].fieldValue = queryStaff;
    computedFilter.value = filtersClone;
  }
);
</script>

<style>
.grid-moderators {
  display: grid;
  grid-template-columns: 1fr;
}
.delete__item {
  color: #ff4c4c !important;
}
.delete__item:hover {
  background: rgba(250, 50, 50, 0.1019607843) !important;
  color: #ff4c4c !important;
}
</style>
