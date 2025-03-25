<template>
  <div
    class="i-table bg-white p-6 rounded-4"
    :class="{ bordered: bordered, 'without-header': withoutHeader }"
  >
    <slot name="header">
      <header v-if="!withoutHeader" class="d-flex justify-content-between">
        <div>
          <h2 class="i-table__title fw-bold text-i-primary">
            {{ title }}
          </h2>
          <p class="fs-7 text-i-secondary text-lowercase">
            <span class="ml-1">{{ subtitleCount }}</span>
            {{ subtitle }}
          </p>
        </div>
        <div class="d-flex align-items-stretch">
          <div class="flex-shrink-0">
            <slot name="beforeSearch" />
          </div>
          <SearchBar
            :model-value="$route?.query?.search"
            v-if="!noSearch"
            :placeholder="$t(searchPlaceholder)"
            @update:modelValue="$emit('search', $event)"
            class="ms-6"
          />
          <div class="flex-shrink-0">
            <slot name="afterSearch" />
          </div>
        </div>
      </header>
    </slot>
    <main>
      <KTDataTable
        v-bind="{
          data,
          currentPage,
          total,
          loading,
          statusKey,
          statusColors,
          bgRed,
          pin,
          itemsPerPage,
          isNotEnd,
        }"
        :header="headerData"
        @page-change="$emit('page-change', $event)"
        @on-items-per-page-change="$emit('on-items-per-page-change', $event)"
      >
        <template
          v-for="(row, j) in headerData"
          :key="j"
          v-slot:[row.columnName]="{ row: data }"
        >
          <slot :name="`${row.columnName}`" :row="data">
            {{ row[data.columnName] }}
          </slot>
        </template>
        <template #footerLeft>
          <slot name="footerLeft" />
        </template>
      </KTDataTable>
    </main>
  </div>
</template>

<script setup lang="ts">
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import SearchBar from "@/stories/Form/SearchBar/SSearchBar.vue";

interface THeaderData {
  columnName: string;
  columnLabel: string;
}

// ******* PROPS *******
interface Props {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  subtitleCount?: number;
  headerData: Array<THeaderData>;
  data?: Array<string>;
  hasSearch?: boolean;
  currentPage?: number;
  search?: string;
  total?: number;
  searchPlaceholder?: string;
  bordered?: boolean;
  noSearch?: boolean;
  statusKey?: string;
  statusColors?: any;
  withoutHeader?: boolean;
  bgRed?: boolean;
  pin?: boolean;
  itemsPerPage?: number;
  isNotEnd?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "Ваучеры",
  subtitle: "48 ваучеров",
  currentPage: 1,
  total: 0,
  searchPlaceholder: "search",
  statusKey: "",
  statusColors: () => ({}),
  bordered: true,
});
</script>

<style lang="scss">
.without-header {
  border-top-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
}

.i-table {
  th {
    vertical-align: middle;
  }

  th:first-child {
    padding-left: 20px;
    width: 20px !important;
    border-radius: 8px 0 0 8px;
  }

  th:last-child {
    padding-right: 20px !important;
    border-radius: 0 8px 8px 0;
  }

  &.bordered .table.table-row-bordered thead tr,
  .table.table-row-bordered thead tr {
    border-width: 0 !important;
  }

  .table.table-row-bordered tr {
    border-width: 0 !important;
  }

  &.bordered .table.table-row-bordered tr {
    border-width: 1px !important;
  }

  &.bordered .table.table-row-bordered .no-data {
    border-width: 0 !important;
  }

  td:last-child {
    padding-right: 20px !important;
    text-align: right;
  }

  td:nth-child(2) {
    text-align: left !important;
  }

  th:nth-child(2) {
    text-align: left !important;
  }

  .el-select,
  .select-trigger,
  .el-input {
    height: 100%;
  }

  .el-select .el-input .el-input__wrapper {
    background: var(--el-input-bg-color, var(--el-fill-color-blank)) !important;
  }
}

.i-table-two {
  td:last-child {
    padding-right: 0 !important;
    text-align: left;
  }
}
</style>
