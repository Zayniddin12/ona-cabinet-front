import { Story } from "@storybook/vue3";

import ImageUpload from "./ImageUpload.vue";

export default {
  title: "Stories/Form",
  component: ImageUpload,
};

const Template: Story = (args) => ({
  components: { ImageUpload },

  setup() {
    return { args };
  },
  template: '<ImageUpload v-bind="args" />',
});

export const Upload = Template.bind({});
Upload.args = {
  desc: "Загрузите изображение вашего автомобиля.",
};
