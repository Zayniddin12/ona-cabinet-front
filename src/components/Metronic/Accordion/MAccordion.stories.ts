import { Story } from "@storybook/vue3";

import MAccordion from "./MAccordion.vue";
import MAccordionItem from "./MAccordionItem.vue";
import { MTAccordion } from "./types";

export default {
  title: "Metronic/Accordion",
  component: MAccordion,
};

const Template: Story<MTAccordion> = (args) => ({
  components: {
    MAccordion,
    MAccordionItem,
  },
  setup() {
    return { args };
  },
  template: `
    <MAccordion v-bind="args">
      <MAccordionItem title="Title 1">Hello</MAccordionItem>
      <MAccordionItem title="Title 2"><p v-for="i in 20" :key="i">Very long content here</p></MAccordionItem>
      <MAccordionItem title="Title 3" />
    </MAccordion>`,
});

export const Single = Template.bind({});
Single.args = {
  mode: "single",
};

export const Multiple = Template.bind({});
Multiple.args = {
  mode: "multiple",
};
