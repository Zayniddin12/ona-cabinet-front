import { Story } from "@storybook/vue3";

import SGroupSelect, { Props } from "./SGroupSelect.vue";

export default {
  title: "Stories/Common/Form/GroupSelect",
  component: SGroupSelect,
};

const Template: Story<Props> = (args) => ({
  components: {
    SGroupSelect,
  },
  setup() {
    return { args };
  },
  template: `
    <s-group-select v-bind="args"></s-group-select>`,
});

export const GroupSelectMixed = Template.bind({});
GroupSelectMixed.args = {
  itemsTitle: "The first of items",
  selectedTitle: "The title of selected",
  items: [
    { id: 1, title: "UIC Group", img: "/assets/avatars/300-1.jpg" },
    { id: 2, title: "Murad Buildings", img: "/assets/avatars/300-1.jpg" },
    {
      id: 3,
      title: "Majburiy Ijro Byurosi",
    },
  ],
  selected: [
    {
      id: 4,
      title: "Majburiy Ijro Byurosi 2",
      img: "/assets/avatars/300-1.jpg",
    },
    {
      id: 5,
      title: "Majburiy Ijro Byurosi 3",
    },
  ],
};

export const GroupSelectWithImages = Template.bind({});
GroupSelectWithImages.args = {
  itemsTitle: "The first of items",
  selectedTitle: "The title of selected",
  items: [
    { id: 1, title: "UIC Group", img: "/assets/avatars/300-1.jpg" },
    { id: 2, title: "Murad Buildings", img: "/assets/avatars/300-1.jpg" },
    {
      id: 3,
      title: "Majburiy Ijro Byurosi",
      img: "/assets/avatars/300-1.jpg",
    },
    {
      id: 4,
      title: "Majburiy Ijro Byurosi 2",
      img: "/assets/avatars/300-1.jpg",
    },
    {
      id: 5,
      title: "Majburiy Ijro Byurosi 3",
      img: "/assets/avatars/300-1.jpg",
    },
  ],
};

export const GroupSelectNoImages = Template.bind({});
GroupSelectNoImages.args = {
  itemsTitle: "The first of items",
  selectedTitle: "The title of selected",
  items: [
    { id: 1, title: "UIC Group" },
    { id: 2, title: "Murad Buildings" },
    {
      id: 3,
      title: "Majburiy Ijro Byurosi",
    },
    {
      id: 4,
      title: "Majburiy Ijro Byurosi 2",
    },
    {
      id: 5,
      title: "Majburiy Ijro Byurosi 3",
    },
  ],
};
