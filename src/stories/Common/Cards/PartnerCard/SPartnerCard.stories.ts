import { Story } from "@storybook/vue3";
import { ref } from "vue";

import SPartnerCard, { Props } from "./SPartnerCard.vue";

export default {
  title: "Stories/Common/Cards",
  component: SPartnerCard,
};

const Template: Story<Props> = (args) => ({
  components: {
    SPartnerCard,
  },
  setup() {
    const list = ref([
      {
        avatar: "/assets/avatars/300-6.jpg",
        name: "Emma Smith",
        description: "Project Manager",
      },
      {
        avatar: "/assets/avatars/300-5.jpg",
        name: "Sean Bean",
        description: "PHP, SQLite, Artisan CLI",
      },
      {
        avatar: "/assets/avatars/300-11.jpg",
        name: "Brian Cox",
        description: "PHP, SQLite, Artisan CLI",
      },
      {
        avatar: "/assets/avatars/300-9.jpg",
        name: "Francis Mitcham",
        description: "PHP, SQLite, Artisan CLI",
      },
      {
        avatar: "/assets/avatars/300-23.jpg",
        name: "Dan Wilson",
        description: "PHP, SQLite, Artisan CLI",
      },
    ]);
    return {
      args,
      list,
    };
  },
  template: `<s-partner-card v-for="(item, index) in list" :key="index" :item="item" :class="{ 'mb-7': list.length - 1 !== index }" />`,
});

export const PartnerCard = Template.bind({});
PartnerCard.args = {
  loading: true,
  width: "270px",
  height: "36.38px",
};
