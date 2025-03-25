import { Story } from "@storybook/vue3";
import { ref } from "vue";

import SSteps from "./SSteps.vue";

const steps = ["Общая информация", "Пароль"];

export default {
  title: "Stories/Common/Steps",
  component: SSteps,
};

const Template: Story = (args) => ({
  components: {
    SSteps,
  },
  setup() {
    const active = ref(0);

    const prevStep = () => {
      if (active.value > 0) {
        active.value--;
      }
    };
    const nextStep = () => {
      if (active.value < steps.length) {
        active.value++;
      }
    };

    return { args, active, prevStep, nextStep };
  },
  template: `
    <div class="bg-white p-4">
      <SSteps v-bind="args" :active="active" />
      <div class="d-flex mt-4">
        <button class="btn btn-primary me-2" @click="prevStep()">Prev</button>
        <button class="btn btn-primary" @click="nextStep()">Next</button>
      </div>
    <pre class="d-inline-block mt-4">Step: {{ active }}</pre>
    </div>
  `,
});

export const Steps = Template.bind({});
Steps.args = {
  steps,
};
