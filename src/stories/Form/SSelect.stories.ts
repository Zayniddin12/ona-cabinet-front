import { Story } from "@storybook/vue3";
import { ref } from "vue";

export default {
  title: "Stories/Form",
};

const Template: Story = (args) => ({
  setup() {
    const input = ref({
      value: "Option1",
      label: "Option1",
    });
    const options = [
      {
        value: "Option1",
        label: "Option1",
      },
      {
        value: "Option2",
        label: "Option2",
      },
      {
        value: "Option3",
        label: "Option3",
      },
      {
        value: "Option4",
        label: "Option4",
      },
      {
        value: "Option5",
        label: "Option5",
      },
    ];
    return {
      options,
      input,
      args,
    };
  },
  template: `
    <el-select v-model="input" class="el-custom-select">
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
    </el-select>
    `,
});

export const select = Template.bind({});
