<template>
  <div class="my-header">
    <h4 class="modal__title">{{ $t("title") }}</h4>
    <button class="modal-close__btn" @click="$emit('close')">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.16797 4.16663L15.8339 15.8325"
          stroke="#7D867D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.16713 15.8325L15.833 4.16663"
          stroke="#7D867D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.el-dialog__headerbtn {
  display: none;
}

.el-dialog__header {
  margin-right: 0;
  border-bottom: 1px solid #ebecee;
  padding: 16px 20px;
}

.modal__title {
  font-weight: 500;
  font-size: 20px;
  margin: 0;
  line-height: 23px;
  color: #333333;
}

.modal-close__btn {
  background: transparent;
  border: none;
  svg {
    path {
      transition: all 300ms;
    }
  }
  &:hover {
    svg {
      path {
        stroke: #de2727;
      }
    }
  }
}
</style>
