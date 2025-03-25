<template>
  <thead>
    <tr class="text-start text-gray-400 fw-bold fs-7 gs-0">
      <th
        v-if="checkboxEnabled"
        :style="{ width: '30px' }"
        class="i-bg-white-100"
      >
        <div
          class="form-check form-check-sm form-check-custom form-check-solid me-3"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-model="checked"
            @change="selectAll()"
          />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th
          :class="[
            {
              'text-end': i === header.length - 1 && !isNotEnd,
            },

            { 'w-40px': i === 0 },
          ]"
          :style="{
            minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
            width: 'auto',
            cursor: column.sortEnabled ? 'pointer' : 'auto',
          }"
          @click="onSort(column.columnName, column.sortEnabled)"
        >
          {{ $t(column.columnLabel) }}
          <span
            v-if="column.columnLabel && column.sortEnabled"
            class="table-sort"
          >
            <inline-svg
              src="/assets/ona/svg/sort-down.svg"
              :class="{
                active:
                  router.currentRoute.value.query.ordering ===
                  `-${column.columnName}`,
              }"
            />
            <inline-svg
              src="/assets/ona/svg/sort-up.svg"
              :class="{
                active:
                  router.currentRoute.value.query.ordering ===
                  `${column.columnName}`,
              }"
            />
          </span>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import { Sort } from "@/components/kt-datatable/table-partials/models";
import { updateQueryParams } from "@/helpers";
import router from "@/router";

export default defineComponent({
  name: "table-head-row",
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    isNotEnd: { type: Boolean, required: false, default: false },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    header: { type: Array, required: true },
  },
  emits: ["on-select", "on-sort"],
  components: {},
  setup(props, { emit }) {
    const checked = ref<boolean>(false);
    const columnLabelAndOrder = ref<Sort>({
      label: props.sortLabel,
      order: props.sortOrder,
    });
    const query = ref(router.currentRoute.value.query.ordering);
    watch(
      () => props.checkboxEnabledValue,
      (currentValue) => {
        checked.value = currentValue;
      }
    );

    const selectAll = () => {
      emit("on-select", checked.value);
    };

    const onSort = (label: string, sortEnabled: boolean) => {
      if (sortEnabled) {
        if (query.value === label) {
          query.value = "-" + label;
        } else {
          query.value = label;
        }
        const newQuery = ref({
          ordering: query.value,
        });
        updateQueryParams(newQuery.value);
        // emit("on-sort", columnLabelAndOrder.value);
      }
    };
    return {
      onSort,
      selectAll,
      checked,
      columnLabelAndOrder,
      router,
    };
  },
});
</script>
<style lang="scss">
.table-sort {
  .active {
    path {
      stroke: #0f6fff;
    }
  }
}
</style>
