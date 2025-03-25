<template>
  <div class="card single-card partner-card">
    <div>
      <router-link
        :to="`/dashboard/participants/${id}/`"
        class="title d-inline-block"
        >{{ title }}</router-link
      >
      <div class="mt-1">
        <slot name="subtitle" />
      </div>
    </div>

    <div class="d-flex flex-column">
      <!--begin::Stats-->
      <ul class="single-card__details d-flex flex-wrap p-0">
        <!--begin::Stat-->
        <slot name="details"></slot>
        <!--end::Stat-->
      </ul>
      <!--end::Stats-->
    </div>
  </div>
</template>

<script setup lang="ts">
// ******* PROPS *******
interface Props {
  title?: string;
  id?: number;
}

withDefaults(defineProps<Props>(), {
  title: "Title",
});
</script>

<style lang="scss">
.title {
  transition: 0.2s ease-in-out all;
}
.title:hover {
  color: #30a1db;
  transition: 0.2s ease-in-out all;
}
.partner-card {
  border-radius: 12px !important;

  &__info {
    display: grid;
  }

  &__img img {
    border: solid 2px #e4e6ef;
    border-radius: 6px !important;
    object-fit: cover;
  }
}

.single-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 182px;

  &__details {
    margin: 0;
  }

  &__details li {
    border: 1px dashed #e4e6ef;
    padding: 8px 12px;
    list-style: none;
    border-radius: 6px;
    display: block;
  }

  &__details li:not(:last-child) {
    margin-right: 16px;
  }

  .detail-title {
    font-weight: 500;
    font-size: 13px;
    line-height: 130%;
    color: #b5b5c3;
    margin-top: 2px;
  }

  .detail-content {
    font-weight: 700;
    font-size: 14px;
    line-height: 130%;
    color: #353d35;
  }

  .detail-content.purple {
    color: #700680;
  }

  .detail-content.green {
    color: #7dba28;
  }
}
</style>
