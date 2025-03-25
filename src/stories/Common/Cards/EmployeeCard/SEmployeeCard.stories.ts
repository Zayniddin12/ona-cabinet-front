import { Story } from "@storybook/vue3";
import { ref } from "vue";

import SEmployeeCard, { Props } from "./SEmployeeCard.vue";

export default {
  title: "Stories/Common/Cards/EmployeeCards",
  component: SEmployeeCard,
};

const Template: Story<Props> = (args) => ({
  components: {
    SEmployeeCard,
  },
  setup() {
    const list = ref([
      {
        avatar: "/assets/avatars/300-6.jpg",
        name: "Emma Smith",
        slug: "emma_smith",
        gender: "male",
        resident: "DODO Pizza",
        date: new Date(),
        rating: 3,
      },
      {
        avatar: "/assets/avatars/300-5.jpg",
        name: "Sean Bean",
        slug: "sean_bean",
        gender: "male",
        resident: "Chopar Pizza",
        date: new Date(),
        rating: 4,
      },
      {
        avatar: "/assets/avatars/300-11.jpg",
        name: "Brian Cox",
        slug: "brian_cox",
        gender: "male",
        resident: "IbroBest",
        date: new Date(),
        rating: 5,
      },
      {
        avatar: "/assets/avatars/300-9.jpg",
        name: "Francis Mitcham",
        slug: "francis_mitcham",
        gender: "female",
        resident: "IbroBest",
        date: new Date(),
        rating: 1.5,
      },
      {
        avatar: "/assets/avatars/300-23.jpg",
        name: "Dan Wilson",
        slug: "dan_wilson",
        gender: "male",
        resident: "IbroBest",
        date: new Date(),
        rating: 3,
      },
    ]);
    return {
      args,
      list,
    };
  },
  template: `<s-employee-card v-bind="args" v-for="(item, index) in list" :key="index" :item="item" :class="{ 'mb-7': list.length - 1 !== index }" />`,
});

export const EmployeeCard = Template.bind({});
EmployeeCard.args = {};

export const EmployeeCardWithoutImage = Template.bind({});
EmployeeCardWithoutImage.args = {
  withoutImage: true,
};

export const EmployeeCardTransaction = Template.bind({});
EmployeeCardTransaction.args = {
  cardType: "transaction",
};

export const EmployeeCardCommentCol = Template.bind({});
EmployeeCardCommentCol.args = {
  cardType: "commentCol",
};

export const EmployeeCardCommentRow = Template.bind({});
EmployeeCardCommentRow.args = {
  cardType: "commentRow",
};
