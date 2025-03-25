<template>
  <div class="group-select-container">
    <div class="group-select">
      <h2 class="group-select__title">{{ itemsTitle }}</h2>
      <div class="group-select__body">
        <!-- Search -->
        <div class="group-select__search">
          <div class="group-select__search__input">
            <input
              v-model="search.item"
              type="text"
              class="form-control"
              :placeholder="`${$t('search')}...`"
            />
            <div
              class="group-select__search__times"
              v-if="search.item.length > 0"
              @click="search.item = ''"
            >
              <i class="bi bi-x-lg"></i>
            </div>
          </div>
          <div
            class="form-check form-check-sm form-check-success form-check-custom form-check-solid"
          >
            <label class="form-check-label" for="alls">
              {{ $t("all") }}
            </label>
            <el-checkbox
              id="alls"
              v-model="allSelected"
              class="el-custom-select"
              text-color="#ffffff"
              :disabled="items.length === 0"
            />
          </div>
        </div>
        <!-- Items container -->
        <div class="card-body">
          <!-- Items -->
          <p class="search-msg" v-if="filteredItems.length === 0">
            {{ $t("nothing_found") }}
          </p>
          <div
            class="align-items-center group-select__item group-select__item__green"
            :class="{ no_img: !i.img, all: allSelected }"
            v-for="i in filteredItems"
            :key="i.id"
            @click="select(i.id)"
          >
            <div v-if="i.img" class="img">
              <img :src="i.img" alt="metronic" />
            </div>
            <h4 class="title">{{ i.title }}</h4>
            <div
              class="bi bi-arrow-right-circle-fill action-btn action-btn__green"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="group-select">
      <h2 class="group-select__title">{{ selectedTitle }}</h2>
      <div class="group-select__body">
        <!-- Search -->
        <div class="group-select__search">
          <div class="group-select__search__input">
            <input
              v-model="search.selected"
              type="text"
              class="form-control"
              :placeholder="`${$t('search')}...`"
            />
            <div
              class="group-select__search__times"
              v-if="search.selected.length > 0"
              @click="search.selected = ''"
            >
              <i class="bi bi-x-lg"></i>
            </div>
          </div>
          <SButton
            @click="unselectAll"
            size="sm"
            variant="light"
            style="padding: 8px 12px !important"
            >{{ $t("clear") }}
          </SButton>
        </div>
        <!-- Items container -->
        <div class="card-body">
          <!-- Items -->
          <p class="search-msg" v-if="filteredSelected.length === 0">
            {{ $t("nothing_found") }}
          </p>
          <div
            class="align-items-center group-select__item group-select__item__red"
            :class="{ no_img: !i.img }"
            v-for="i in filteredSelected"
            :key="i.id"
            @click="unselect(i.id)"
          >
            <div v-if="i.img" class="img">
              <img :src="i.img" alt="metronic" />
            </div>
            <h4 class="title">{{ i.title }}</h4>
            <div class="bi bi-x-circle-fill action-btn action-btn__red"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "@vue/runtime-core";

import SButton from "@/stories/Common/Button/SButton.vue";

interface Props {
  items?: any[];
  selected?: any[];
  itemsTitle?: string;
  selectedTitle?: string;
}

const emit = defineEmits(["result"]);

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  selected: () => [],
});

const items = ref([...props.items]);
const selected = ref([...props.selected]);
const allSelected = ref(false);

const filteredItems = computed(() => {
  return items.value.filter((item: any) =>
    item.title.toLowerCase().includes(search.item.toLowerCase())
  );
});

const emitResult = () => {
  const gr = { items: items.value, selected: selected.value };
  emit("result", gr);
};

const search = reactive({
  item: "",
  selected: "",
});

const filteredSelected = computed(() => {
  return selected.value.filter((item: any) =>
    item.title.toLowerCase().includes(search.selected.toLowerCase())
  );
});

const select = (id: number) => {
  if (allSelected.value) {
    selected.value = [...items.value, ...selected.value];
    items.value = [];
    allSelected.value = false;
    return emitResult();
  }
  selected.value.unshift(items.value.find((i: any) => i.id === id));
  items.value = items.value.filter((i: any) => i.id !== id);
  emitResult();
};

const unselect = (id: number) => {
  items.value.unshift(selected.value.find((i: any) => i.id === id));
  selected.value = selected.value.filter((i: any) => i.id !== id);
  emitResult();
};

const unselectAll = () => {
  items.value = [...selected.value, ...items.value];
  selected.value = [];
  emitResult();
};
</script>

<style lang="scss" scoped src="@/assets/sass/form/group-select.scss"></style>
