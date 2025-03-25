import { Story } from "@storybook/vue3";
import { ref } from "vue";

export default {
  title: "Stories/Form",
};

const Template: Story = (args) => ({
  setup() {
    const input = ref(false);
    return {
      input,
      args,
    };
  },
  template: `
    <el-checkbox v-model="input" class="el-custom-select" label="checkbox" text-color="#ffffff" />
    `,
});

export const checkbox = Template.bind({});
