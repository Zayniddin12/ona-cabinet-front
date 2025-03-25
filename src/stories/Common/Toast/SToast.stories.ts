import { Story } from "@storybook/vue3";
import { useToast } from "vue-toastification";

export default {
  title: "Stories/Form",
};

const Template: Story = (args) => ({
  setup() {
    const toast = useToast();

    function openToast(message: string) {
      if (message === "success") {
        toast.success("Новый ваучер успешно\n" + "добавлен");
      } else if (message === "info") {
        toast.info("Info", {
          icon: {
            iconClass: "info-icon",
            iconTag: "div",
          },
        });
      } else if (message === "warning") {
        toast.warning("Warning", {
          icon: {
            iconClass: "warning-icon",
            iconTag: "div",
          },
        });
      } else if (message === "error") {
        toast.error("Error", {
          icon: {
            iconClass: "error-icon",
            iconTag: "div",
          },
        });
      }
    }

    return {
      openToast,
      args,
    };
  },
  template: `
      <div class="d-flex gap-4">
      <button @click="openToast('success')" class="btn btn-success">Success</button>
      <button @click="openToast('info')" class="btn btn-info">Info</button>
      <button @click="openToast('warning')" class="btn btn-warning">Warning</button>
      <button @click="openToast('error')" class="btn btn-danger">Error</button>
      </div>`,
});

export const toast = Template.bind({});
