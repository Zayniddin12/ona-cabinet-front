import { Story } from "@storybook/vue3";

import STable from "./STable.vue";

export default {
  title: "Stories/Common/Tables",
  component: STable,
};

const Template: Story = (args) => ({
  components: {
    STable,
  },
  setup() {
    return { args };
  },
  template: `
    <STable v-bind="args">
    <template v-slot:id="{ row: data }">
      {{ data.id }}
    </template>
      <template v-slot:name="{ row: data }">
        {{ data.name }}
      </template>
      <template v-slot:position="{ row: data }">
        {{ data.position }}
      </template>
      <template v-slot:office="{ row: data }">
        {{ data.office }}
      </template>
      <template v-slot:age="{ row: data }">
        {{ data.age }}
      </template>
      <template v-slot:startDate="{ row: data }">
        {{ data.startDate }}
      </template>
      <template v-slot:salary="{ row: data }">
        {{ data.salary }}
    </template>
    <template v-slot:action="{ row: data }">
      <button class="btn btn-primary btn-sm">Button</button>
    </template>
    <template #footerLeft>
      LeftSide of Footer
    </template>
    </STable>
  `,
});

export const Table = Template.bind({});
Table.args = {
  headerData: [
    {
      columnName: "id",
      columnLabel: "№",
    },
    {
      columnName: "name",
      columnLabel: "Name",
    },
    {
      columnName: "position",
      columnLabel: "Position",
    },
    {
      columnName: "office",
      columnLabel: "Office",
    },
    {
      columnName: "age",
      columnLabel: "Age",
    },
    {
      columnName: "startDate",
      columnLabel: "Start date",
    },
    {
      columnName: "salary",
      columnLabel: "Salary",
    },
    {
      columnName: "action",
      columnLabel: "",
    },
  ],
  data: [
    {
      id: 1,
      name: "Tiger Nixon",
      position: "System Architect",
      office: "Edinburgh",
      age: "61",
      startDate: "2011/04/25",
      salary: "$320,800",
    },
    {
      id: 2,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 3,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 4,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 5,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 6,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 7,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 8,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 9,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 10,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 11,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 12,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 13,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startDate: "2011/07/25",
      salary: "$170,750",
    },
  ],
};
