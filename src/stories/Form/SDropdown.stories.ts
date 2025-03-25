import { Story } from "@storybook/vue3";
import { ref } from "vue";

export default {
  title: "Stories/Form",
};

const Template: Story = (args) => ({
  setup() {
    const input = ref("");
    return {
      input,
      args,
    };
  },
  template: `
    <el-dropdown>
    <span class="el-dropdown-link">
      Dropdown List
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item class="border-b">Action 1</el-dropdown-item>
        <el-dropdown-item class="border-b">Action 2</el-dropdown-item>
        <el-dropdown-item>Action 3</el-dropdown-item>
       </el-dropdown-menu>
    </template>
    </el-dropdown>
    `,
});

export const Dropdown = Template.bind({});
Dropdown.args = {};
