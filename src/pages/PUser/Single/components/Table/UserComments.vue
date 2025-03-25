<template>
  <div class="">
    <STable
      v-bind="{ total, loading, currentPage, itemsPerPage }"
      :header-data="headerData"
      :data="tableData"
      :title="$t(title)"
      :subtitle="$t(subtitle)"
      :subtitle-count="total"
      class="main-table user-table"
      :statusColors="{ true: 'green' }"
      search-class="search"
      @page-change="$emit('page-change', $event)"
      @on-items-per-page-change="$emit('on-items-per-page-change', $event)"
      @search="$emit('on-search', $event)"
    >
      <template #afterSearch>
        <SButton
          v-if="useRoleManagement('edit', ['responsible_person'])"
          variant="primary"
          :text="$t('add_comment')"
          class="btn-style ms-6"
          @click="$emit('add')"
        >
          <template #pre-icon>
            <img src="/assets/svg/buttons/plus.svg" alt="plus" />
          </template>
        </SButton>
      </template>
      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data.index, offset) }}.
      </template>
      <template v-slot:comment="{ row: data }">
        <p class="line-clamp-2 comment__title line-clamp-2">
          <WordHighlighter :query="$route?.query?.search || ''">
            {{ data?.comment }}
          </WordHighlighter>
        </p>
      </template>
      <template v-slot:commenter="{ row: data }">
        {{ data?.creator?.username }}
      </template>
      <template v-slot:date="{ row: data }">
        {{ dayjs(data?.created_at).format("DD.MM.YYYY") }}
      </template>
      <template v-slot:actions="{ row: data }">
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
              <el-dropdown-item class="border-b" @click="$emit('view', data)">
                <div class="d-flex align-items-center">
                  <inline-svg
                    src="/assets/ona/svg/eye-solid.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span>{{ $t("view") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="useRoleManagement('edit', 'admin')"
                class="border-b"
                @click="$emit('edit', data)"
              >
                <div class="d-flex align-items-center">
                  <inline-svg
                    src="/assets/ona/svg/pen-solid.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span>{{ $t("edit") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="useRoleManagement('', [])"
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
import dayjs from "dayjs";
import WordHighlighter from "vue-word-highlighter";

import useRoleManagement from "@/composables/useRoleManagement";
import { calcTabIndex } from "@/helpers";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

interface Props {
  headerData: Array<any>;
  title: string;
  subtitle: string;

  total?: number;
  offset?: number;
  limit?: number;
  loading?: boolean;
  tableData?: any;
  currentPage?: number;
  itemsPerPage?: number;
}

withDefaults(defineProps<Props>(), {});
</script>

<style scoped>
.comment__title {
  width: 50%;
}
</style>
