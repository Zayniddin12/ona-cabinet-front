<template>
  <div class="table-responsive">
    <transition mode="out-in" name="">
      <div>
        <table
          v-if="!loading"
          class="table align-middle table-row-bordered fs-6 gy-5 dataTable no-footer"
        >
          <TableHeadRow
            v-bind="{ isNotEnd }"
            @onSort="onSort"
            @onSelect="selectAll"
            :checkboxEnabledValue="check"
            :checkboxEnabled="checkboxEnabled"
            :sort-label="sortLabel"
            :sort-order="sortOrder"
            :header="header"
          />
          <TableBodyRow
            v-if="data.length !== 0"
            v-bind="{ statusKey, statusColors, bgRed, pin }"
            :currentlySelectedItems="selectedItems"
            :data="data"
            :header="header"
            :checkbox-enabled="checkboxEnabled"
            :checkbox-label="checkboxLabel"
            @onSelect="itemsSelect"
          >
            <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
              <slot :name="name" :row="item" />
            </template>
          </TableBodyRow>
          <tr class="no-data" v-else>
            <td :colspan="header?.length || 1">
              <div class="odd dataTables_empty" v-if="!loading">
                <img src="/assets/ona/image/no-data.svg" alt="" class="mb-7" />
                <p class="dataTables_empty-title">
                  {{ $t("result_not_exists") }}
                </p>
                <p class="dataTables_empty-text">
                  {{ $t("data_not_found") }}
                </p>
              </div>
            </td>
          </tr>
        </table>
        <div v-if="loading">
          <table
            class="table align-middle table-row-bordered fs-6 gy-5 dataTable no-footer"
            style="margin-bottom: 16px !important"
          >
            <TableHeadRow
              @onSort="onSort"
              @onSelect="selectAll"
              :checkboxEnabledValue="check"
              :checkboxEnabled="checkboxEnabled"
              :sort-label="sortLabel"
              :sort-order="sortOrder"
              :header="header"
            />
          </table>
          <div
            v-for="(item, index) in $route.query.limit
              ? Number($route.query.limit)
              : 10"
            :key="index"
          >
            <PreloaderSkeleton
              width="100%"
              loading
              height="50px"
              preloader-class="mb-5"
            >
              loading...
            </PreloaderSkeleton>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";

import { Sort } from "@/components/kt-datatable/table-partials/models";
import TableBodyRow from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRow.vue";
import TableHeadRow from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRow.vue";
import PreloaderSkeleton from "@/pages/Components/PreloaderSkeleton.vue";

export default defineComponent({
  name: "table-body",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    emptyTableText: { type: String, default: "No data found" },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    pin: Boolean,
    bgRed: Boolean,
    isNotEnd: { type: Boolean, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    loading: { type: Boolean, required: false, default: false },
    statusKey: { type: String, default: "" },
    statusColors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["on-sort", "on-items-select"],
  components: {
    PreloaderSkeleton,
    TableHeadRow,
    TableBodyRow,
  },
  setup(props, { emit }) {
    const selectedItems = ref<Array<any>>([]);
    const allSelectedItems = ref<Array<any>>([]);
    const check = ref<boolean>(false);

    watch(
      () => props.data,
      () => {
        selectedItems.value = [];
        allSelectedItems.value = [];
        check.value = false;
        // eslint-disable-next-line
        props.data.forEach((item: any) => {
          if (item[props.checkboxLabel]) {
            allSelectedItems.value.push(item[props.checkboxLabel]);
          }
        });
      }
    );

    // eslint-disable-next-line
    const selectAll = (checked: any) => {
      check.value = checked;
      if (checked) {
        selectedItems.value = [
          ...new Set([...selectedItems.value, ...allSelectedItems.value]),
        ];
      } else {
        selectedItems.value = [];
      }
    };

    //eslint-disable-next-line
    const itemsSelect = (value: any) => {
      selectedItems.value = [];
      //eslint-disable-next-line
      value.forEach((item: any) => {
        if (!selectedItems.value.includes(item)) {
          selectedItems.value.push(item);
        }
      });
    };

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    watch(
      () => [...selectedItems.value],
      (currentValue) => {
        if (currentValue) {
          emit("on-items-select", currentValue);
        }
      }
    );

    onMounted(() => {
      selectedItems.value = [];
      allSelectedItems.value = [];
      check.value = false;
      // eslint-disable-next-line
      props.data.forEach((item: any) => {
        if (item[props.checkboxLabel]) {
          allSelectedItems.value.push(item[props.checkboxLabel]);
        }
      });
    });

    return {
      onSort,
      selectedItems,
      selectAll,
      itemsSelect,
      check,
    };
  },
});
</script>

<style lang="scss">
.dataTables_empty {
  height: 600px !important;
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  img {
    margin-bottom: 16px;
  }

  &-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 23px;
    text-align: center;
    color: #191e36;
    margin-bottom: 12px;
  }

  &-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #191e36;
    opacity: 0.7;
    max-width: 400px;
  }
}

.custom-table-height {
  min-height: 600px;
}
</style>
