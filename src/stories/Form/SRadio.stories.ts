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
      <el-radio-group v-model="input" class="ml-4">
      <el-radio label="1" size="large">Option 1</el-radio>
      <el-radio label="2" size="large">Option 2</el-radio>
      </el-radio-group>
    `,
});

export const radio = Template.bind({});
