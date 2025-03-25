<template>
  <div class="d-flex flex-column gap-7">
    <SUserFormWrapper>
      <SFormGroup
        v-for="(condition, index) in conditions"
        :required="activeIndex(index)"
        :key="index"
        :label="condition?.title"
      >
        <el-select
          v-model="values.conditions[`condition_${index}`]"
          :placeholder="$t('choose_condition')"
          :disabled="!condition?.options?.length"
          :multiple="condition.selection_type === 2"
          filterable
          remote
          reserve-keyword
          remote-show-suffix
        >
          <el-option
            v-for="item in condition?.options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </SFormGroup>
    </SUserFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { unref } from "vue";

import { TForm } from "@/composables/useForm";
import SUserFormWrapper from "@/pages/PUser/components/Add/SUserFormWrapper.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";

function activeIndex(idx: number) {
  if (idx == 0) {
    return true;
  } else if (idx == 2) {
    return true;
  } else if (idx == 3) {
    return true;
  }
}
interface Props {
  show?: boolean;
  form?: TForm<any>;
  employmentType?: Array<any>;
  conditions?: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {});

const { form } = unref(props);
const { values } = form;
</script>

<style scoped>
.col-span-2 {
  grid-column: span 2;
}

.mr-2 {
  margin-right: 10px;
}
</style>
