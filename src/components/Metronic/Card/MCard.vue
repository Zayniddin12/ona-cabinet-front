<template>
  <div class="card" :class="[{ shadow }, defaultClass]">
    <slot name="header" v-if="!noHeader">
      <MCardHeader v-bind="headerProps">
        <template #title v-if="$slots['header-title']">
          <slot name="header-title" />
        </template>
        <template #toolbar v-if="$slots['header-toolbar']">
          <slot name="header-toolbar" />
        </template>
      </MCardHeader>
    </slot>
    <MCardBody v-bind="body"><slot /></MCardBody>
    <MCardFooter v-bind="footer" v-if="!noFooter">
      <slot name="footer" />
    </MCardFooter>
  </div>
</template>

<script lang="ts" setup>
import { computed, unref } from "vue";

import MCardBody from "./MCardBody.vue";
import MCardFooter from "./MCardFooter.vue";
import MCardHeader from "./MCardHeader.vue";
import { MTCard, MTCardTitle } from "./types";

const props = withDefaults(defineProps<MTCard>(), {
  header: () => ({
    title: {
      title: "Title",
    },
    noTitle: false,
    toolbar: {},
    noToolbar: false,
  }),
  noHeader: false,
  body: () => ({
    scroll: false,
  }),
  noBody: false,
  footer: () => ({}),
  noFooter: false,
  shadow: true,
});

const headerProps = computed(() => {
  const result = unref(props.header);

  if (props.title) {
    if (!result.title) {
      result.title = {} as MTCardTitle;
    }

    result.title.title = props.title;
  }

  if (props.subTitle != undefined) {
    if (!result.title) {
      result.title = {} as MTCardTitle;
    }

    result.title.subTitle = props.subTitle;
  }

  if (props.noToolbar != undefined) {
    result.noToolbar = props.noToolbar;
  }

  return result;
});
</script>
