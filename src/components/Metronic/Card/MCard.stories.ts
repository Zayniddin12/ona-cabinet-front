import { Story } from "@storybook/vue3";

import MButton from "../Button/MButton.vue";
import MCard from "./MCard.vue";
import { MTCard } from "./types";

export default {
  title: "Metronic/Card",
  component: MCard,
};

const Template: Story<MTCard> = (args) => ({
  components: {
    MCard,
    MButton,
  },
  setup() {
    return { args };
  },
  template: `<MCard v-bind="args">
    <template #header-toolbar><MButton variant="primary">Button</MButton></template>
    Body
    <template #footer>Footer</template>
  </MCard>`,
});

export const Default = Template.bind({});

export const WithoutToolbar = Template.bind({});
WithoutToolbar.args = {
  noToolbar: true,
};

export const WithSubtitle = Template.bind({});
WithSubtitle.args = {
  subTitle: "Subtitle",
};

export const WithoutHeader = Template.bind({});
WithoutHeader.args = {
  noHeader: true,
};

export const WithoutFooter = Template.bind({});
WithoutFooter.args = {
  noFooter: true,
};

export const BodyOnly = Template.bind({});
BodyOnly.args = {
  noHeader: true,
  noFooter: true,
};
