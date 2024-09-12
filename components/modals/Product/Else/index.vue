<template>
  <div class="modal-product-else">
    <div class="modal-product-else__header">
      <p class="modal-product-else__title">
        Что нибудь ещё?
      </p>

      <div class="modal-product-else__arrows">
        <div ref="prev" class="modal-product-else__arrow modal-product-else__arrow--prev">
          <UIIcon name="arrow" />
        </div>
        <div ref="next" class="modal-product-else__arrow modal-product-else__arrow--next">
          <UIIcon name="arrow" />
        </div>
      </div>
    </div>

    <Swiper
      :modules="[Navigation]"
      :slides-per-view="'auto'"
      :space-between="15"
      :navigation="{
        prevEl: prev,
        nextEl: next,
      }"
      class="modal-product-else__slider"
    >
      <SwiperSlide
        v-for="(item, i) in related"
        :key="i"
        class="modal-product-else__slide"
      >
        <ModalsProductElseProduct
          :item="item"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

defineProps({
  related: {
    type: Array,
    default: () => ([]),
  },
})

const prev = ref(null)
const next = ref(null)
</script>

<style lang="scss" scoped>
.modal-product-else {
  display: grid;
  grid-gap: 20px;

  padding: 0 20px;

  background: var(--white);

  @include mq($bp-small) {
    padding: 20px 30px 30px;

    background: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    @include text_large;
    font-weight: 700;
    color: var(--blackText);

    @include mq($bp-small) {
      @include h2;
      color: var(--black);
    }
  }

  &__slider {
    margin: 0 -20px;
    padding: 0 20px;

    overflow: hidden;

    @include mq($bp-small) {
      margin: 0 -30px;
      padding: 0 30px;
    }
  }

  &__slide {
    width: auto;
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

    width: 44px;
    height: 44px;

    background: var(--white);
    border-radius: 14px;
    border: 2px solid var(--yellow);

    cursor: pointer;

    @include mq($bp-small) {
      width: 48px;
      height: 48px;
    }

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