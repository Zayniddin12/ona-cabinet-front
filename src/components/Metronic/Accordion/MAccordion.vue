<script lang="ts">
import { defineComponent, h, PropType, ref, Slot, VNode } from "vue";

import { MAccordionModes, MTAccordion } from "./types";

export default defineComponent({
  props: {
    mode: {
      type: String as PropType<MTAccordion["mode"]>,
      validator: (value: string) => {
        return (MAccordionModes as readonly string[]).includes(value);
      },
      required: true,
      default: "single",
    },
  },
  setup(props, { slots }) {
    const activeItemIndex = ref<number | null>(null);
    const activeItemIndexes = ref<number[]>([]);

    return () => {
      const defaultSlot = slots.default as Slot;
      const items: VNode[] = defaultSlot();

      for (let i = 0; i < items.length; i++) {
        const itemProps =
          props.mode == "single"
            ? {
                collapsed: activeItemIndex.value != i,
                onClick() {
                  if (activeItemIndex.value == i) {
                    activeItemIndex.value = null;
                  } else {
                    activeItemIndex.value = i;
                  }
                },
              }
            : {
                collapsed: !activeItemIndexes.value.includes(i),
                onClick() {
                  if (activeItemIndexes.value.includes(i)) {
                    activeItemIndexes.value = activeItemIndexes.value.filter(
                      (v) => v != i
                    );
                  } else {
                    activeItemIndexes.value.push(i);
                  }
                },
              };

        items[i] = h(items[i], itemProps);
      }

      return h("div", { class: "accordion" }, items);
    };
  },
});
</script>
