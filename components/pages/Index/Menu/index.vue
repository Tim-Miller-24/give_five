<template>
  <section class="index-menu">
    <div class="container" style="margin-top: 1em">
      <div class="index-menu__content">
        <SubCategoryMenu
            v-if="hasSubCategories && !headerMenu"
        />
        <div>
          <CategoryBlock
              v-if="block"
              :block="block"
          />
          <AllCategories v-else />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
//const block = computed(() => catalogStore.currentCategory);
const props = defineProps({
  block: {
    type: Object,
  }
});
const block = props.block;
import {storeToRefs} from "pinia";
import { useCatalogStore } from '@/store/catalog';

const catalogStore = useCatalogStore();
const {currentSubCategoryId} = storeToRefs(catalogStore);
const headerMenu = computed(() => catalogStore.headerMenu);
//const block = computed(() => catalogStore.currentCategory);
const hasSubCategories = computed(() => catalogStore.hasSubCategories);
watch(hasSubCategories, val => val ? currentSubCategoryId.value = block.value.subCategories[0].id
    : null, {immediate: true});

</script>

<style lang="scss">
.block-app {
  margin-top: 3rem;
}
.category-header {
  margin-top: 2em;
}
.category-name {
  margin-right: 1em;
}
.sub-category-title {
  display: inline-flex;
  font-size: 28px;
  gap: .5em;
}
@import 'swiper/css';

.index-menu {
  overflow: hidden;
  margin-left: -20px;
  margin-right: -20px;

  &__categories {
    margin-bottom: 30px;

    @include mq($bp-small) {
      margin-bottom: 40px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    
  }

  &__block {
    display: flex;
    flex-direction: column;
    grid-gap: 20px;

    margin-bottom: 20px;

    @include mq($bp-small) {
      grid-gap: 30px;

      margin-bottom: 30px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    @include text_large;
    font-weight: 700;

    @include mq($bp-small) {
      @include h2;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;

    @include mq($bp-small) {
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 5px;
    }
  }

  &__slider {
    width: 100%;

    overflow: visible;
  }

  &__slide {
    width: 212px;

    @include mq($bp-small) {
      width: 316px;
    }
  }

  &__arrows {
    display: flex;
    align-items: center;
    grid-gap: 20px;
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 48px;
    height: 48px;

    background: var(--white);
    border-radius: 14px;
    border: 2px solid var(--yellow);

    cursor: pointer;

    &--prev {
      .ui-icon {
        transform: rotate(180deg);
      }
    }

    &.swiper-button-lock {
      display: none;
    }
  }
}
</style>