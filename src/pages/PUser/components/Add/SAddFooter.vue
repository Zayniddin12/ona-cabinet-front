<template>
  <div class="add-footer">
    <i18n-t keypath="footer_text" tag="p" class="add-footer__title">
      <template #link>
        <span class="text-dark-black fw-semibold"> {{ $t("make_sure") }} </span>
      </template>
    </i18n-t>

    <div class="d-flex align-items-center gap-5">
      <SButton
        v-if="step !== 1"
        :text="$t('back')"
        variant="secondary"
        class="py-3"
        :disabled="step === 1"
        @click="$emit('back')"
      >
        <template #pre-icon>
          <inline-svg
            src="/assets/ona/svg/arrow-stroke-right.svg"
            class="rotate-180 mr-1"
          />
        </template>
      </SButton>

      <SButton v-if="step === 7" @click="$emit('submit')" :loading="loading">
        <div class="d-flex align-items-center gap-1">
          <inline-svg
            src="/assets/ona/svg/done-outline.svg"
            class="done-outline-add"
          />
          {{ $t("save") }}
        </div>
      </SButton>
      <SButton
        v-else
        :text="$t('further')"
        class="py-3"
        variant="secondary"
        @click="$emit('submit')"
      >
        <template #post-icon>
          <inline-svg
            src="/assets/ona/svg/arrow-stroke-right.svg"
            class="ml-1"
          />
        </template>
      </SButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import SButton from "@/stories/Common/Button/SButton.vue";

interface Props {
  step?: number;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.add-footer {
  background: #fff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__title {
    font-weight: 400;
    max-width: 30%;
    font-size: 12px;
    line-height: 130%;
    color: #a2abbe;
    a {
      font-weight: 600;
    }
  }
}

.rotate-180 {
  transform: rotate(180deg);
}

.mr-1 {
  margin-right: 4px;
}
.ml-1 {
  margin-left: 4px;
}
</style>
