<template>
  <div
      v-if="block"
    :id="`block_${block.id}`"
    class="index-menu__block"
    style="margin-top: 1em"
  >
    <div class="index-menu__header">
      <h1
        id="category-name"
        class="index-menu__title category-name"
      >
        {{ block.name }}
      </h1>
      <MenuArrows
          block="block"
      />
    </div>

    <div v-if="!hasSubCategories">
      <!-- <MenuSwiper
        :block="block"
      /> -->
      <div class="index-menu__list">
        <CommonProductCard
          v-for="product in products"
          :key="product.id + Math.random()"
          :item="product"
        />
      </div>
    </div>

    <div v-else>
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
    </div>

    <div v-if="block.description?.length > 0"
      class="category__info"
      v-html="block.description"
    />

  </div>

</template>

<script setup>

const catalogStore = useCatalogStore();
//const block = computed(() => catalogStore.currentCategory);

const props = defineProps({
  block: {
    type: Object,
    default: () => ({
      id: 0,
      name: "",
      img: "",
      slug: "slug"
    })
  }
});

const block = props.block;

const hasSubCategories = computed(() => catalogStore.hasSubCategories);

onMounted(() => {
  if (catalogStore.filteredCategory && catalogStore.filteredCategory?.id != block?.id) {
    catalogStore.resetFilters();
  }
})

const products = computed(() => {
  let temp = null;

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
  temp = temp ? temp : block.products

  return temp;
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
  temp = temp ? temp : subcategoryProducts

  return temp;
}
</script>

<style lang="scss" scoped>
.category__info {
  margin-bottom: 3rem;

  ::v-deep h3 {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  ::v-deep p {
    font-weight: 400;
  }
  ::v-deep ul {
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: 400;
    list-style-type: disc;
    padding-left: 15px;
  }
  ::v-deep h4 {
    font-weight: 600;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  ::v-deep h2 {
    font-weight: 600;
    margin-top: 15px;
    margin-bottom: 15px;
  }
}
</style>