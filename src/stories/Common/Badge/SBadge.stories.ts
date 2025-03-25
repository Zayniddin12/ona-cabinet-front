import { Story } from "@storybook/vue3";

import MCard from "@/components/Metronic/Card/MCard.vue";

import SBadge, { Props } from "./SBadge.vue";
import { BadgeVariants } from "./types";

export default {
  title: "Stories/Common/Badges",
  component: SBadge,
};

const Template: Story<Props> = (args) => ({
  components: {
    SBadge,
    MCard,
  },
  setup() {
    return { args, BadgeVariants };
  },
  template: `<div>
    <MCard no-footer title="Badges" class="mb-5">
      <s-badge v-for="v in BadgeVariants" :key="v" v-bind="args" :text="'Badge ' + v" v-bind="args" :variant="v" class="me-3"></s-badge>
    </MCard>
    <MCard no-footer title="Badges with discount icon" class="mb-5">
      <s-badge v-for="v in BadgeVariants" :key="v" v-bind="args" icon="discount" v-bind="args" :variant="v" class="me-3" />
    </MCard>    
    <MCard no-footer title="Badges with cashback icon" class="mb-5">
      <s-badge v-for="v in BadgeVariants" :key="v" v-bind="args" icon="cashback" v-bind="args" :variant="v" class="me-3" />
    </MCard>    
    <MCard no-footer title="Badges with voucher icon" class="mb-5">
      <s-badge v-for="v in BadgeVariants" :key="v" v-bind="args" icon="voucher" v-bind="args" :variant="v" class="me-3" />
    </MCard>
  </div>`,
});

export const Badges = Template.bind({});
