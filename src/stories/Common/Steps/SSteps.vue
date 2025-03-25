<template>
  <div class="i-steps">
    <el-steps v-bind="{ active }" align-center finish-status="success">
      <el-step v-for="(step, index) in steps" :key="index" :title="step" />
    </el-steps>
  </div>
</template>

<script setup lang="ts">
// ******* PROPS *******
interface Props {
  active: number;
  steps: string[];
}
withDefaults(defineProps<Props>(), {
  active: 0,
});
</script>

<style lang="scss">
.i-steps {
  .el-step__icon {
    width: 32px;
    height: 32px;
    background: #e6e7e6;
    border: 2px solid #ffffff;
  }

  .el-step__icon svg {
    height: 14px;
    width: 14px;
  }

  .el-step.is-horizontal .el-step__line {
    top: 50%;
    transform: translateY(-50%);
    background-color: #e6e7e6;
    height: 4px;
  }

  .is-success .el-step__icon,
  .is-process .el-step__icon {
    background-color: #7dba28;
    color: #fff;
  }

  .el-step__icon-inner.is-status {
    transform: translate(0);
  }

  .el-step__title.is-process {
    color: #7dba28;
    font-weight: 600;
  }

  .is-success .el-step__line {
    background-color: #e5f1d4 !important;
  }

  .el-step {
    flex-basis: 200px !important;
  }
}
</style>
