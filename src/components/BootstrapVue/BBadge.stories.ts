import { Story } from "@storybook/vue3";
import { BBadge, BButton, BCard } from "bootstrap-vue-3";

import MCodeHighlighter from "@/components/Metronic/CodeHighlighter/MCodeHighlighter.vue";

export default {
  title: "BootstrapVue",
};

const BadgeVariants = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
];

const Template: Story = (args) => ({
  components: {
    BBadge,
    BButton,
    BCard,
    MCodeHighlighter,
  },
  setup() {
    return { args, BadgeVariants };
  },
  template: `
    <div class="py-5">
      <BCard class="mb-5">
        <a href="https://cdmoro.github.io/bootstrap-vue-3/components/Badge.html" target="_blank" size="sm">
          BootstrapVue Docs
        </a>
      </BCard>
    
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Headings</h3>
        </template>

        <h1>Example heading <BBadge variant="primary">New</BBadge></h1>
        <h2>Example heading <BBadge variant="primary">New</BBadge></h2>
        <h3>Example heading <BBadge variant="primary">New</BBadge></h3>
        <h4>Example heading <BBadge variant="primary">New</BBadge></h4>
        <h5>Example heading <BBadge variant="primary">New</BBadge></h5>
        <h6>Example heading <BBadge variant="primary">New</BBadge></h6>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <h1>Example heading <BBadge variant="primary">New</BBadge></h1>
            <h2>Example heading <BBadge variant="primary">New</BBadge></h2>
            <h3>Example heading <BBadge variant="primary">New</BBadge></h3>
            <h4>Example heading <BBadge variant="primary">New</BBadge></h4>
            <h5>Example heading <BBadge variant="primary">New</BBadge></h5>
            <h6>Example heading <BBadge variant="primary">New</BBadge></h6>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
      
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Buttons</h3>
        </template>

        <BButton variant="primary">
          Notifications
          <BBadge variant="light">5</BBadge>
        </BButton>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BButton variant="primary">
              Notifications
              <BBadge variant="light">5</BBadge>
            </BButton>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
      
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Positioned</h3>
        </template>

        <BButton variant="primary" class="position-relative">
          Inbox
          <BBadge variant="danger" text-indicator>99+</BBadge>
        </BButton>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BButton variant="primary" class="position-relative">
              Inbox
              <BBadge variant="danger" text-indicator>99+</BBadge>
            </BButton>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
      
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Dot indicator</h3>
        </template>

        <BButton variant="primary" class="position-relative">
          Inbox
          <BBadge variant="danger" dot-indicator />
        </BButton>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BButton variant="primary" class="position-relative">
              Inbox
              <BBadge variant="danger" text-indicator>99+</BBadge>
            </BButton>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
      
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Variants</h3>
        </template>

        <div class="d-flex flex-wrap gap-3">
          <BBadge :variant="variant" v-for="variant in BadgeVariants" :key="variant">{{ variant }}</BBadge>
        </div>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BBadge variant="warning">Bagde</BBadge>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
      
      <BCard class="mb-5">
        <template #header>
          <h3 class="card-title">Pill badges</h3>
        </template>

        <div class="d-flex flex-wrap gap-3">
          <BBadge :variant="variant" pill v-for="variant in BadgeVariants" :key="variant">{{ variant }}</BBadge>
        </div>

        <template #footer>
          <MCodeHighlighter lang="html">{{\`
            <BBadge pill>Bagde</BBadge>
            \`}}
          </MCodeHighlighter>
        </template>
      </BCard>
    </div>`,
});

export const Badge = Template.bind({});
