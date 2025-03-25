import { Story } from "@storybook/vue3";

import STableLabels from "./STableLabels.vue";

export default {
  title: "Stories/Common/TableLabels",
  component: STableLabels,
};

const Template: Story = (args) => ({
  components: {
    STableLabels,
  },
  setup() {
    return { args };
  },
  template: `
    <div class="bg-white p-4">
      <STableLabels v-bind="args" />
    </div>
  `,
});

export const TableLabels = Template.bind({});
TableLabels.args = {
  labels: [
    {
      color: "green",
      title: "Успешно",
    },
    {
      color: "red",
      title: "Отменено",
    },
  ],
};
