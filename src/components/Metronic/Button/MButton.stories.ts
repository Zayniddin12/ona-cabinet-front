import { Story } from "@storybook/vue3";

import MCard from "../Card/MCard.vue";
import MButton from "./MButton.vue";
import {
  MButtonColors,
  MButtonHoverEffects,
  MButtonLightColors,
  MButtonOutlineColors,
  MTButton,
} from "./types";

export default {
  title: "Metronic",
  component: MButton,
};

const Template: Story<MTButton> = (args) => ({
  components: {
    MCard,
    MButton,
  },
  setup() {
    return {
      args,
      MButtonColors,
      MButtonLightColors,
      MButtonOutlineColors,
      MButtonHoverEffects,
    };
  },
  template: `<div>
    <MCard no-footer title="Buttons" class="mb-5">
        <MButton v-bind="args" v-for="color in MButtonColors" :key="color" :variant="color" class="me-3">{{ color }}</MButton>
    </MCard>
    <MCard no-footer title="Hover effects" class="mb-5">
        <MButton v-bind="args" v-for="effect in MButtonHoverEffects" :key="effect" variant="secondary" :hover-effect="effect" class="me-3">{{ effect }}</MButton>
    </MCard>
    <MCard no-footer title="Light buttons" class="mb-5">
      <MButton v-bind="args" v-for="color in MButtonLightColors" :key="color" :light="color" class="me-3">{{ color }}</MButton>
    </MCard>
    <MCard no-footer title="Outline buttons" class="mb-5">
      <MButton v-bind="args" v-for="color in MButtonOutlineColors" :key="color" :outline="color" class="me-3">{{ color }}</MButton>
    </MCard>
    <MCard no-footer title="Outline dashed buttons">
      <MButton v-bind="args" v-for="color in MButtonOutlineColors" :key="color" :dashed="color" class="me-3">{{ color }}</MButton>
    </MCard>
  </div>`,
});

export const Buttons = Template.bind({});
