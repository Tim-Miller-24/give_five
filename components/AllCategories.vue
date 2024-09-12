<template>
  <div v-for="category in categories"
      :key="category.id"
    >
    <div :id="`block_${category.id}`"
      class="index-menu__block"
      v-if="category.products.length > 0 || category.subCategories.length > 0 || !catalogStore.isFullCatalogGot"
      style="margin-bottom: 30px;"
    >
      <div class="index-menu__header">
        <h2 class="index-menu__title" v-if="(category.products.length > 0 && category.subCategories?.length === 0) || !catalogStore.isFullCatalogGot">
          {{ category.name }}
        </h2>
        <h2 class="index-menu__title" v-else-if="category.subCategories.length > 0 && category.subCategories.some(item => filterSubProducts(item.products)?.length > 0)"
        style="margin-bottom: -20px;">
          {{ category.name }}
        </h2>

        <div
          v-if="category.id === 140 || category.id === 16"
          class="index-menu__arrows"
        >
          <div :id="`slider-arrow-${category.id}--prev`" class="index-menu__arrow index-menu__arrow--prev">
            <UIIcon name="arrow" />
          </div>
          <div :id="`slider-arrow-${category.id}--next`" class="index-menu__arrow index-menu__arrow--next">
            <UIIcon name="arrow" />
          </div>
        </div>
      </div>

      <Swiper
        v-if="category.id === 140 || category.id === 16"
        :modules="[Navigation]"
        slides-per-view="5"
        :breakpoints="{
          320: { slidesPerView: 2.3, spaceBetween: 5 },
          768: { slidesPerView: 3, spaceBetween: 5 },
          992: { slidesPerView: 5, spaceBetween: 5 },
        }"
        :navigation="{
              prevEl: `#slider-arrow-${category.id}--prev`,
              nextEl: `#slider-arrow-${category.id}--next`,
            }"
        class="index-menu__slider"
      >
        <SwiperSlide
          v-for="product in category.products"
          :key="product.id"
          class="index-menu__slide"
        >
          <CommonProductCard
            :item="product"
            :is-promo="category.id === 140"
          />
        </SwiperSlide>
      </Swiper>

      <div
        v-else-if="!category.subCategories.length"
        class="index-menu__list"
      >
        <CommonProductCard
          v-for="product in category.products"
          :key="product.id"
          :item="product"
        />
      </div>

      <template v-if="category.subCategories.length > 0">
        <div
          v-for="(item, index) in category.subCategories.filter(cat => filterSubProducts(cat?.products)?.length > 0)"
          :key="`sub-${index}`"
        >
          <h3
            class="sub-title"
            :id="`sub-${item.id}`"
          >
            {{ item.name }}
          </h3>
          <div
            class="index-menu__list"
          >
            <CommonProductCard
              v-for="product in filterSubProducts(item.products)"
              :key="product.id"
              :item="product"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/vue";

const catalogStore = useCatalogStore();

const categories = ref([]);

watchEffect(() => {
  let count = catalogStore.filtersCount;
  if (catalogStore.filteredAllCategories && count) {
    categories.value = [...catalogStore.filteredAllCategories];
  } else {
    categories.value = [...catalogStore.categories];
  }

  nextTick(() => {
    // Принудительно перерисовываем компнент
  });
});

const filterSubProducts = (subcategoryProducts) => {
  let temp = subcategoryProducts;

  if (catalogStore.selectedPriceFilters && catalogStore.selectedPriceFilters.length > 0) {
  temp = catalogStore.sortProductByPrice(temp);
  }

  if (catalogStore.selectedBadgeFilters && catalogStore.selectedBadgeFilters.length > 0) {
  temp = catalogStore.sortPdoductsByBadges(temp);
  }

  if (catalogStore.selectedAttributesFilters && catalogStore.selectedAttributesFilters.length > 0) {
  temp = catalogStore.sortPdoductsByAttributes(temp);
  }


  //temp = temp ? temp : catalogStore.currentCategory.products
  temp = temp ? temp : subcategoryProducts;

  return temp;
}

</script>

<style lang="scss" scoped>
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
    font-size: 25px;
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
.sub-title {
  font-weight: bold; 
  font-size: 28px;
  margin-bottom: 0.7rem;

  @include maq($bp-small) {
    font-size: 21px;
    font-weight: 600;
  }
}
</style>