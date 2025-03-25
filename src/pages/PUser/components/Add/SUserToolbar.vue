<template>
  <div class="bg-white toolbar-header">
    <div
      class="container py-0 d-flex align-items-center justify-content-between"
    >
      <el-breadcrumb separator="•">
        <el-breadcrumb-item :to="{ path: '/' }">
          {{ $t("main") }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/dashboard/participants/active' }">{{
          $t("menus.participants")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'PAdminActiveEmployees' }">{{
          $t(title)
        }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="d-flex align-items-center gap-4">
        <el-switch
          class="add-user"
          v-model="values.active"
          style="--el-switch-on-color: #30a1db; --el-switch-off-color: #f0f0f5"
          :inactive-text="$t('active')"
        />
        <router-link to="/dashboard/participants/active">
          <SButton variant="secondary">
            <div class="d-flex align-items-center gap-1">
              <inline-svg src="/assets/ona/svg/close.svg" />
              {{ $t("cancel") }}
            </div>
          </SButton>
        </router-link>
        <SButton @click="$emit('add')" :loading="loading">
          <div class="d-flex align-items-center gap-1">
            <inline-svg
              src="/assets/ona/svg/done-outline.svg"
              class="done-outline-add"
            />
            {{ $t("save") }}
          </div>
        </SButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue";

import { TForm } from "@/composables/useForm";
import SButton from "@/stories/Common/Button/SButton.vue";

interface Props {
  form?: TForm<any>;
  loading?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "add_new",
});

const { form } = unref(props);
const { values } = form;
</script>

<style scoped>
.toolbar-header {
  padding: 8px;
  border-top: 1px solid #eff2f5;
}
</style>

<style>
.add-user .el-switch__label {
  color: #1c1f20 !important;
}

.done-outline-add path {
  stroke: #fff;
}
</style>
