import { Story } from "@storybook/vue3";
import { BAccordion, BAccordionItem, BCard } from "bootstrap-vue-3";

import MCodeHighlighter from "@/components/Metronic/CodeHighlighter/MCodeHighlighter.vue";

export default {
  title: "BootstrapVue",
};

const Template: Story = (args) => ({
  components: {
    BCard,
    BAccordion,
    BAccordionItem,
    MCodeHighlighter,
  },
  setup() {
    return { args };
  },
  template: `<div class="py-5">
  <BCard class="mb-5">
    <a href="https://cdmoro.github.io/bootstrap-vue-3/components/Accordion.html" target="_blank" size="sm">
      BootstrapVue Docs
    </a>
  </BCard>

  <BCard class="mb-5">
    <template #header>
      <h3 class="card-title">Default accordion</h3>
    </template>
    
    <BAccordion>
      <BAccordionItem title="Title 1">Content 1</BAccordionItem>
      <BAccordionItem title="Title 2">Content 2</BAccordionItem>
      <BAccordionItem title="Title 3">Content 3</BAccordionItem>
    </BAccordion>

    <template #footer>
      <MCodeHighlighter lang="html">{{\`
        <BAccordion>
          <BAccordionItem title="Title 1">Content 1</BAccordionItem>
          <BAccordionItem title="Title 2">Content 2</BAccordionItem>
          <BAccordionItem title="Title 3">Content 3</BAccordionItem>
        </BAccordion>
        \`}}
      </MCodeHighlighter>
    </template>
  </BCard>

  <BCard class="mb-5">
    <template #header>
      <h3 class="card-title">Always open accordion</h3>
    </template>
    
    <BAccordion free>
      <BAccordionItem title="Title 1">Content 1</BAccordionItem>
      <BAccordionItem title="Title 2">Content 2</BAccordionItem>
      <BAccordionItem title="Title 3">Content 3</BAccordionItem>
    </BAccordion>

    <template #footer>
      <MCodeHighlighter lang="html">{{\`
        <BAccordion free>
          <BAccordionItem title="Title 1">Content 1</BAccordionItem>
          <BAccordionItem title="Title 2">Content 2</BAccordionItem>
          <BAccordionItem title="Title 3">Content 3</BAccordionItem>
        </BAccordion>
        \`}}
      </MCodeHighlighter>
    </template>
  </BCard>
  </div>`,
});

export const Accordion = Template.bind({});
