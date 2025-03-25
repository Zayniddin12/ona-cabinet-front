<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      v-bind="{ statusKey, statusColors, bgRed, pin, isNotEnd }"
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      v-model:itemsPerPage="itemsInTable"
      :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
      v-bind="{ currentPage }"
      @page-change="pageChange"
    >
      <template #footerLeft>
        <slot name="footerLeft" />
      </template>
    </TableFooter>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";

import { Sort } from "@/components/kt-datatable/table-partials/models";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";

export default defineComponent({
  name: "kt-datatable",
  props: {
    header: { type: Array, required: true },
    data: { type: [Array || undefined], required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    bgRed: Boolean,
    pin: Boolean,
    isNotEnd: { type: Boolean, default: false },
    currentPage: { type: Number, default: 1 },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    emptyTableText: { type: String, required: false, default: "No data found" },
    statusKey: { type: String, default: "" },
    statusColors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-items-per-page-change",
  ],
  components: {
    TableContent,
    TableFooter,
  },
  setup(props, { emit }) {
    const currentPage = ref(1);
    const itemsInTable = ref<number>(props.itemsPerPage);

    watch(
      () => itemsInTable.value,
      (val) => {
        currentPage.value = 1;
        emit("on-items-per-page-change", val);
      }
    );

    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };

    const dataToDisplay = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.data;
        } else {
          let sliceFrom = (currentPage.value - 1) * itemsInTable.value;
          return props.data.slice(sliceFrom, sliceFrom + itemsInTable.value);
        }
      }
      return [];
    });

    const totalItems = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.total;
        } else {
          return props.data.length;
        }
      }
      return 0;
    });

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    //eslint-disable-next-line
    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      itemsInTable,
      totalItems,
    };
  },
});
</script>
