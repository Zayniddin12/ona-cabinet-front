import { Story } from "@storybook/vue3";
import { ref } from "vue";

import SDialogHeader from "./SDialogHeader.vue";

export default {
  title: "Stories/Common/Dialog",
  component: SDialogHeader,
};

const Template: Story = (args) => ({
  components: {
    SDialogHeader,
  },
  setup() {
    const show = ref(true);
    return {
      args,
      show,
    };
  },
  template: `
    <el-button @click="show = true">show Modal</el-button>
    <el-dialog v-model="show" >
      <template #header>
        <SDialogHeader v-bind="args" @close="show = false" />
      </template>
    
      <div style="height: 300px">
        this is content
      </div>
    </el-dialog>
    `,
});

export const dialog = Template.bind({});
