import { Story } from "@storybook/vue3";

import SStatisticsCard, { Props } from "./SStatisticsCard.vue";

export default {
  title: "Stories/Common/Cards",
  component: SStatisticsCard,
};

const Template: Story<Props> = (args) => ({
  components: {
    SStatisticsCard,
  },
  setup() {
    return {
      args,
    };
  },
  template: `
    <div class="d-flex flex-column gap-3">
    <s-statistics-card number="758" type="residents" />
    <s-statistics-card number="32231" type="clients" />
    <s-statistics-card number="10847" type="males" />
    <s-statistics-card number="12051" type="females" />
    <s-statistics-card number="71" type="partners" />
    <s-statistics-card number="758" type="services" />
    <s-statistics-card number="12051" type="vouchers" />
    <s-statistics-card number="10847" type="sum" />
    </div>
  `,
});

export const StatisticsCard = Template.bind({});
StatisticsCard.args = {
  type: "males",
};
