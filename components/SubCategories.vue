<template>
  <template>
    <div>
      <div
        v-for="(item, index) in block.subCategories"
        :key="`sub-${index}`"
      >
        <h3
          style="font-weight: bold; font-size: 28px; margin: .7em"
          :id="`sub-${item.id}`"
        >
          {{ item.name }}
        </h3>

        <Swiper
          :modules="[Navigation]"
          slides-per-view="auto"
          :breakpoints="{
              0: {
                spaceBetween: 15,
              },
              991: {
                spaceBetween: 30,
              }
            }"
          :navigation="{
              prevEl: `#slider-arrow-${block.id}--prev`,
              nextEl: `#slider-arrow-${block.id}--next`,
            }"
          class="index-menu__slider"
        >
          <SwiperSlide
            v-for="product in item.products"
            :key="product.id"
            class="index-menu__slide"
          >
            <CommonProductCard
              :item="product"
              :is-promo="block.id === 140"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </template>

</template>

<script setup>
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/vue";
const props = defineProps({block: {type: Object, required: true}});
const {block} = toRefs(props);
const subCategories = computed(() => block.value.subCategories);
</script>

<style lang="scss" scoped>
.sub-category-title {
  display: inline-flex;
  font-size: 28px;
  gap: .5em;
}
@import 'swiper/css';

.index-menu {
  overflow: hidden;

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
    justify-content: space-between;
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
    grid-gap: 16px;

    @include mq($bp-small) {
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 25px 15px;
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