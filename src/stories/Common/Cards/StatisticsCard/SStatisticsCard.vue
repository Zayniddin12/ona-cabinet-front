<template>
  <div class="statistics-card" :class="type">
    <div class="d-flex align-items-center">
      <span class="statistics-card__icon">
        <inline-svg :src="`/assets/svg/common/statistic-icons/${type}.svg`" />
      </span>
      <h3 class="statistics-card__number">{{ formatNumber(number) }}</h3>
    </div>
    <p class="statistics-card__text">{{ $t(`services.${type}`) }}</p>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from "@/helpers";

interface Props {
  number: number;
  type?:
    | "residents"
    | "clients"
    | "males"
    | "females"
    | "partners"
    | "services"
    | "vouchers"
    | "sum";
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
.statistics-card {
  background: #ffffff;
  box-shadow: 0 0 30px rgba(56, 71, 109, 0.09);
  border-radius: 12px;
  padding: 24px;
  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    flex-shrink: 0;
  }
  &__number {
    margin-left: 12px;
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 130%;
    color: #334055;
  }
  &__text {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: #8390a6;
    margin-top: 8px;
  }

  &.residents {
    .statistics-card__icon {
      background: #7dba28;
      box-shadow: 0 4px 20px rgba(125, 186, 40, 0.2);
    }
  }
  &.clients {
    .statistics-card__icon {
      background: #ff8c01;
      box-shadow: 0 4px 20px rgba(255, 140, 1, 0.2);
    }
  }
  &.males {
    .statistics-card__icon {
      background: #028787;
      box-shadow: 0 4px 20px rgba(2, 135, 135, 0.2);
    }
  }
  &.females {
    .statistics-card__icon {
      background: #e242bf;
      box-shadow: 0 4px 20px rgba(226, 66, 191, 0.2);
    }
  }
  &.partners {
    .statistics-card__icon {
      background: #e14343;
      box-shadow: 0 4px 20px rgba(225, 67, 67, 0.2);
    }
  }
  &.services {
    .statistics-card__icon {
      background: #532aa9;
      box-shadow: 0 4px 20px rgba(83, 42, 169, 0.2);
    }
  }
  &.vouchers {
    .statistics-card__icon {
      background: #2885ba;
      box-shadow: 0 4px 20px rgba(40, 133, 186, 0.2);
    }
  }
  &.sum {
    .statistics-card__icon {
      background: #dfa535;
      box-shadow: 0 4px 20px rgba(223, 165, 53, 0.2);
    }
  }
}
</style>
