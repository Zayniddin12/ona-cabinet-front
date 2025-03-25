<template>
  <tbody class="fw-semibold text-gray-600">
    <template v-for="(row, i) in data" :key="i">
      <tr
        class="i-table-body-row"
        :class="[bgRed && 'table-red', checkPin(row?.pinned)]"
      >
        <td v-if="checkboxEnabled">
          <div
            class="form-check form-check-sm form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="row[checkboxLabel]"
              v-model="selectedItems"
              @change="onChange"
            />
          </div>
        </td>
        <template v-for="(properties, j) in header" :key="j">
          <td :class="itemStatus(row)">
            <slot
              :name="`${properties.columnName}`"
              :row="{ ...row, index: ++i }"
            >
              {{ row[properties] }}
            </slot>
          </td>
        </template>
      </tr>
    </template>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "table-body-row",
  components: {},
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    bgRed: Boolean,
    pin: Boolean,
    currentlySelectedItems: { type: Array, required: false, default: () => [] },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    statusKey: { type: String, default: "" }, //active|twenty_Days_left|ten_days_left
    statusColors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["on-select"],
  setup(props, { emit }) {
    //eslint-disable-next-line
    const selectedItems = ref<Array<any>>([]);

    watch(
      () => [...props.currentlySelectedItems],
      (currentValue) => {
        if (props.currentlySelectedItems.length !== 0) {
          selectedItems.value = [
            ...new Set([...selectedItems.value, ...currentValue]),
          ];
        } else {
          selectedItems.value = [];
        }
      }
    );

    const onChange = () => {
      emit("on-select", selectedItems.value);
    };

    const itemStatus = (row: any) => {
      const nestedKeys = props.statusKey.split(".");
      const lastKey = nestedKeys.pop();
      const nestedObj = nestedKeys.reduce((a, prop) => a[prop], row);
      return props.statusColors[nestedObj[lastKey as keyof typeof nestedObj]];
    };

    const checkPin = (pin: boolean) => {
      if (props.pin) {
        if (pin) {
          return "pin";
        } else {
          return "unpin";
        }
      } else {
        return "";
      }
    };

    return {
      selectedItems,
      itemStatus,
      onChange,
      checkPin,
    };
  },
});
</script>

<style lang="scss">
.i-table-body-row {
  position: relative;

  td:first-child {
    padding-left: 20px;
  }

  .green,
  .red,
  .yellow,
  .blue,
  .gray {
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 44px;
      width: 3px;
      border-radius: 0 4px 4px 0;
    }
  }

  .green::before {
    background-color: #2ed47a;
  }

  .red::before {
    background-color: #de2727;
  }

  .gray::before {
    background-color: #c0c0c0;
  }

  .blue::before {
    background-color: #30a1db;
  }

  .yellow::before {
    background-color: #ff8c01;
  }

  &.pin {
    background: #f3fafd;

    td:first-child::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 20px;
      width: 20px;
      border-radius: 0 4px 4px 0;
      background-image: url("/assets/ona/svg/bookmarked.svg");
      background-repeat: no-repeat !important;
      background-color: transparent;
    }

    td:first-child.red::before {
      background-image: url("/assets/ona/svg/bookmarked-red.svg");
    }

    td:not(:first-child).red::before {
      background: transparent;
    }

    td:first-child.yellow::before {
      background-image: url("/assets/ona/svg/bookmarked-yellow.svg");
    }

    td:not(:first-child).yellow::before {
      background: transparent;
    }
  }
}

.table-red {
  background: rgba(250, 50, 50, 0.03);
}
</style>
