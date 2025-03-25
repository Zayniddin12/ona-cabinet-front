<template>
  <div class="steps">
    <p class="steps__title">{{ $t(title) }}</p>
    <div class="steps-user">
      <div v-for="(item, index) in steps" :key="index" class="steps-user-item">
        <div
          class="steps-user-item-header cursor-pointer"
          @click="$emit('next', item?.id)"
        >
          <p
            class="steps-user-item-header__number"
            :class="{
              'steps-user-item-header__number-active': item?.id === step,
            }"
          >
            {{ item?.id }}
          </p>
          <p
            class="steps-user-item-header__title"
            :class="{
              'steps-user-item-header__title-active': item?.id === step,
            }"
          >
            {{ item?.title }}
          </p>
        </div>
        <div class="steps-user-item-progress">
          <div
            :class="{ 'steps-user-item-progress-inner': item?.id === step }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  steps: {
    title: string;
    id: number;
  }[];
  step?: number;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: "add_new",
});
</script>

<style lang="scss" scoped>
.steps {
  background: #ffffff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  padding: 24px;
  &__title {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #1c1f20;
    margin-bottom: 24px;
  }
  &-user {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;

    &-item {
      width: 100%;
      height: 100%;

      &-header {
        display: flex;
        align-items: center;
        gap: 4px;

        &__number {
          font-weight: 600;
          font-size: 25px;
          line-height: 29px;
          color: #a2abbe;
          transition: all 300ms ease-out;
          &-active {
            color: #3699ff !important;
          }
        }
        &__title {
          font-weight: 500;
          font-size: 13px;
          line-height: 15px;
          color: #a2abbe;
          transition: all 300ms ease-out;
          &-active {
            color: #3699ff !important;
          }
        }
      }

      &-progress {
        width: 100%;
        height: 2px;
        margin-top: 8px;
        background: #a2abbe;
        border-radius: 150px;

        &-inner {
          background: #3699ff;
          height: 2px;
          animation: fill 300ms ease-out forwards;
        }
      }
    }
  }
}

@keyframes fill {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.steps-user-item-header:hover .steps-user-item-header__title {
  color: #00a3ff;
}
.steps-user-item-header:hover .steps-user-item-header__number {
  color: #00a3ff;
}
</style>
