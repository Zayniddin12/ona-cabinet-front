import { Story } from "@storybook/vue3";

import SCounter from "./SCounter.vue";

export default {
  title: "Stories/Common/Counter",
  component: SCounter,
};

const Template: Story = (args) => ({
  components: {
    SCounter,
  },
  setup() {
    return { args };
  },
  template: `
    <div class="bg-white p-4">
      <SCounter v-bind="args" />
    </div>
  `,
});

export const Counter = Template.bind({});
Counter.args = {};
