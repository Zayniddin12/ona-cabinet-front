import { Story } from "@storybook/vue3";
import { ref } from "vue";

import SReviewCard, { Props } from "./SReviewCard.vue";

export default {
  title: "Stories/Common/Cards",
  component: SReviewCard,
};

const Template: Story<Props> = (args) => ({
  components: {
    SReviewCard,
  },
  setup() {
    const list = ref([
      {
        content:
          "Очень интересный промокод. Воспользовался несколько раз и надеюсь подобные акции будут делаться еще чаще. Гап йо болла.",
        user: {
          avatar: "/assets/avatars/300-6.jpg",
          name: "Emma Smith",
          resident: "DODO Pizza",
          rating: 3,
        },
      },
      {
        content:
          "Очень интересный промокод. Воспользовался несколько раз и надеюсь подобные акции будут делаться еще чаще. Гап йо болла.",
        user: {
          avatar: "/assets/avatars/300-5.jpg",
          name: "Sean Bean",
          slug: "sean_bean",
          resident: "Chopar Pizza",
          rating: 4,
        },
      },
      {
        content:
          "Ну не очень если честно, что есть промокод, что его нет - толку от этого не так уж и много. Со-со ребята, охшамапти.",
        user: {
          avatar: "/assets/avatars/300-11.jpg",
          name: "Brian Cox",
          slug: "brian_cox",
          resident: "IbroBest",
          rating: 5,
        },
      },
      {
        content:
          "Когда кассиры увидели что очень дорогая покупка обходится мне практически бесплатно, они выгнали меня из заведения. ТРЭШ👎🏾👎🏾👎🏾!!!",
        user: {
          avatar: "/assets/avatars/300-9.jpg",
          name: "Francis Mitcham",
          slug: "francis_mitcham",
          resident: "IbroBest",
          rating: 1.5,
        },
      },
      {
        content: "Спасибо, все круто!",
        user: {
          avatar: "/assets/avatars/300-23.jpg",
          name: "Dan Wilson",
          slug: "dan_wilson",
          resident: "IbroBest",
          rating: 3,
        },
      },
    ]);
    return {
      args,
      list,
    };
  },
  template: `<s-review-card v-for="(item, index) in list" :key="index" :item="item" />`,
});

export const CommentCard = Template.bind({});
CommentCard.args = {};
