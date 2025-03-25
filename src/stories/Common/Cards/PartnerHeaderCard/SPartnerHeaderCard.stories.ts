import { Story } from "@storybook/vue3";

import SBadge from "@/stories/Common/Badge/SBadge.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

import SPartnerHeaderCard from "./SParterHeaderCard.vue";

export default {
  title: "Stories/Common/Cards/PartnerHeaderCard",
  component: SPartnerHeaderCard,
};

const Template: Story = (args) => ({
  components: {
    SPartnerHeaderCard,
    SBadge,
    SButton,
  },
  setup() {
    return {
      args,
    };
  },
  template: `
    <SPartnerHeaderCard v-bind="args">
    <template #badges>
      <SBadge v-for="badge in 4" :text="'Badge ' + badge"></SBadge>
    </template>
    <template #actions>
      <SButton variant="tertiary" v-for="action in 2">Action {{ action }}</SButton>
    </template>
    </SPartnerHeaderCard>`,
});

export const PartnerHeaderCard = Template.bind({});
PartnerHeaderCard.args = {
  details: [`<b>Detail</b> Card`, `<i>HTML</i>`],
  tab: [
    { label: "First tab", link: "/" },
    { label: "Second tab", link: "/" },
    { label: "Third tab", link: "/" },
  ],
  image: "/assets/avatars/blank.png",
};
