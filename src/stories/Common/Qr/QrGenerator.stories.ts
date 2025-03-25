import { Story } from "@storybook/vue3";

import QrGenerator from "./QrGenerator.vue";

export default {
  title: "Stories/Common/Qr",
  component: QrGenerator,
};

const Template: Story = (args) => ({
  components: { QrGenerator },
  setup() {
    return { args };
  },
  template: `
    <div class="bg-gray-200">
      <QrGenerator v-bind="args" />
    </div>
  `,
});

export const QR = Template.bind({});
QR.args = {
  text: "Hello world!",
  size: 164,
  loading: false,
};
