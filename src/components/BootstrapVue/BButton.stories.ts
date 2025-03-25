import { Story } from "@storybook/vue3";
import { BButton, BCard } from "bootstrap-vue-3";

import MCodeHighlighter from "@/components/Metronic/CodeHighlighter/MCodeHighlighter.vue";

export default {
  title: "BootstrapVue",
};

const ButtonVariants = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "link",
  "outline-primary",
  "outline-secondary",
  "outline-success",
  "outline-danger",
  "outline-warning",
  "outline-info",
  "outline-light",
  "outline-dark",
];

const Template: Story = (args) => ({
  components: {
    BButton,
    BCard,
    MCodeHighlighter,
  },
  setup() {
    return { args, ButtonVariants };
  },
  template: `
    <div class="py-5">
      <BCard class="mb-5">
        <a href="https://cdmoro.github.io/bootstrap-vue-3/components/Button.html" target="_blank" size="sm">
          BootstrapVue Docs
        </a>
        <span> | </span>
        <a href="https://preview.keenthemes.com/metronic8/vue/docs/#/buttons" target="_blank">Metronic Docs</a>
      </BCard>
    
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Button variants</h3>
        </template>
  
        <div class="d-flex flex-wrap gap-4 p-5">
          <BButton :variant="variant" v-for="variant of ButtonVariants" :key="variant">{{ variant }}</BButton>
        </div>
        <div class="d-flex flex-wrap bg-dark gap-4 p-5">
          <BButton :variant="variant" v-for="variant of ButtonVariants" :key="variant">{{ variant }}</BButton>
        </div>
  
        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BButton variant="primary">Content</BButton>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
      
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Button sizes</h3>
        </template>
  
        <div class="d-flex flex-wrap align-items-center gap-4">
          <BButton variant="secondary" size="sm">Button small (sm)</BButton>
          <BButton variant="secondary">Button (md)</BButton>
          <BButton variant="secondary" size="lg">Button large (lg)</BButton>
        </div>
        
        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BButton size="sm">Content</BButton>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>

      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Button pill style</h3>
        </template>

        <div class="d-flex flex-wrap gap-4 p-5">
          <BButton :variant="variant" v-for="variant of ButtonVariants" :key="variant" pill>{{ variant }}</BButton>
        </div>
        <div class="d-flex flex-wrap bg-dark gap-4 p-5">
          <BButton :variant="variant" v-for="variant of ButtonVariants" :key="variant" pill>{{ variant }}</BButton>
        </div>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BButton pill>Content</BButton>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>

      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Button squared style</h3>
        </template>

        <div class="d-flex flex-wrap gap-4 p-5">
          <BButton :variant="variant" v-for="variant of ButtonVariants" :key="variant" squared>{{ variant }}</BButton>
        </div>
        <div class="d-flex flex-wrap bg-dark gap-4 p-5">
          <BButton :variant="variant" v-for="variant of ButtonVariants" :key="variant" squared>{{ variant }}</BButton>
        </div>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BButton squared>Content</BButton>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
    </div>`,
});

export const Button = Template.bind({});
