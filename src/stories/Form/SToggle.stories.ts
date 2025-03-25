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
    <el-switch v-model="input" style="--el-switch-on-color: #7DBA28; --el-switch-off-color: #D0D2D0" size="large" />
    `,
});

export const toggle = Template.bind({});
