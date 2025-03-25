import { Story } from "@storybook/vue3";
import { ref } from "vue";

import SSearchBar from "./SSearchBar.vue";

export default {
  title: "Stories/Form",
  component: SSearchBar,
};

const Template: Story = (args) => ({
  components: { SSearchBar },
  setup() {
    const value = ref();
    return { args, value };
  },
  template: `
      <SSearchBar v-model="value" v-bind="args" />
    `,
});

export const SearchBar = Template.bind({});
SearchBar.args = {
  type: "text",
  placeholder: "Enter text",
  error: false,
  minlength: 0,
  maxlength: 100,
  min: 0,
  max: 100,
};
