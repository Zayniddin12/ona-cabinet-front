<template>
  <div class="d-flex justify-content-between align-items-center">
    <div :class="count > 10 || pageCount > 1 ? '' : 'pt-5'">
      <slot name="footerLeft" />
    </div>
    <div class="d-flex pt-4" v-if="count > 10 || pageCount > 1">
      <TableItemsPerPageSelect
        v-if="count > 10"
        class="d-inline-flex"
        v-model:itemsPerPage="itemsCountInTable"
        :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
      />
      <TablePagination
        v-if="pageCount > 1"
        :total-pages="pageCount"
        :total="count"
        :per-page="itemsPerPage"
        :current-page="page"
        @page-change="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  WritableComputedRef,
} from "vue";

import TableItemsPerPageSelect from "@/components/kt-datatable/table-partials/table-content/table-footer/TableItemsPerPageSelect.vue";

import TablePagination from "./table-content/table-footer/TablePagination.vue";

export default defineComponent({
  name: "table-footer",
  components: {
    TableItemsPerPageSelect,
    TablePagination,
  },
  props: {
    count: { type: Number, required: false, default: 5 },
    itemsPerPage: { type: Number, default: 5 },
    currentPage: { type: Number, default: 1 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["update:itemsPerPage", "page-change"],
  setup(props, { emit }) {
    const page = ref(props.currentPage);
    const inputItemsPerPage = ref(5);

    watch(
      () => props.count,
      () => {
        if (!props.currentPage) {
          page.value = 1;
        } else {
          page.value = +props.currentPage;
        }
      }
    );

    watch(
      () => inputItemsPerPage.value,
      () => {
        if (!props.currentPage) {
          page.value = 1;
        } else {
          page.value = +props.currentPage;
        }
      }
    );

    watch(
      () => props.currentPage,
      (newValue) => {
        page.value = newValue;
      }
    );

    onMounted(() => {
      inputItemsPerPage.value = props.itemsPerPage;
    });

    const pageChange = (newPage: number) => {
      page.value = newPage;
      emit("page-change", page.value);
    };

    const itemsCountInTable: WritableComputedRef<number> = computed({
      get(): number {
        return props.itemsPerPage;
      },
      set(value: number): void {
        inputItemsPerPage.value = value;
        emit("update:itemsPerPage", value);
      },
    });

    const pageCount = computed(() => {
      return Math.ceil(props.count / itemsCountInTable.value);
    });

    return {
      pageChange,
      pageCount,
      page,
      itemsCountInTable,
      inputItemsPerPage,
    };
  },
});
</script>
