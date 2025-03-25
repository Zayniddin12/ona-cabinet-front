import { Story } from "@storybook/vue3";
import { ref } from "vue";

import SInput from "./SInput.vue";

export default {
  title: "Stories/Form",
  component: SInput,
};

const Template: Story = (args) => ({
  components: { SInput },
  setup() {
    const value = ref();
    return { args, value };
  },
  template: `
    <div>
      <SInput v-model="value" v-bind="args" />
      <SInput v-model="value" v-bind="args" class="mt-5">
        <template #prefix>
          <div class="prefix-custom">
            +998
          </div>
        </template>
      </SInput>
    </div>
    `,
});

export const BaseInput = Template.bind({});
BaseInput.args = {
  type: "text",
  placeholder: "Enter text",
  error: false,
  minlength: 0,
  maxlength: 100,
  min: 0,
  max: 100,
};
