<template>
  <section class="categories">
    <div class="container">

      <div
        class="categories_grid__w w1"
        v-if="isCat2"
      >
        <div
          v-for="category in categoriesForCat2"
          :key="`categories-grid-item-${category.id}`"
          :id="`block_${category.id}`"
        >
          <UISectionTitle :level="2" style="margin-top: 3rem;" :title="category.name" />

          <ul class="categories_grid">
            <li v-for="subCategory in category.subCategories.filter(item => {
              if (!catalogStore.isFullCatalogGot) {
                return item;
              }
              else {
                return item.products.length > 0;
              }
            })" 
            :key="subCategory.id">
              <CategoriesCard
                  :parent-category="category"
                  :data="subCategory"
                  :isSubcategory="true"
              />
            </li>
          </ul>
        </div>
      </div>

      <div
        class="categories_grid__w w2"
        v-else-if="!isCat2 && route.name !== 'menu-categories-subcategory'"
      >
        <ul class="categories_grid">
          <li v-for="category in editCategories"
           :key="`categories-grid-item${category.id}`">
            <CategoriesCard :data="category" :parent-category="{slug: route.params.categorySlug}" />
          </li>
        </ul>
      </div>


      <div class="categories_grid__w w3" v-else>
        <UISectionTitle :level="2" title="Каталог" v-if="title" />
        <ul class="categories_grid">
          <li v-for="category in editCategories"
           :key="`categories-grid-item${category.id}`">
            <CategoriesCard :data="category" :isSubcategory="isSubcategory" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import CategoriesCard from "./CategoriesCard.vue";

const commonStore = useCommonStore();
const catalogStore = useCatalogStore();
const route = useRoute();

const pageType = computed(() => commonStore.facade?.catalog_front);

const { isFullCatalogGot } = storeToRefs(catalogStore);

const props = defineProps({
  categories: {
    type: Array,
    default: [],
  },
  title: {
    type: Boolean,
    default: true,
  },
  isSubcategory: {
    type: Boolean,
    default: true,
  },
});

const isCat2 = ref(pageType.value === 'cat2' && route.name === 'index');

const editCategories = computed(() => {
  return props.categories.filter(item => {
    let condition1 = item.id !== 16 && item.id !== 140;
    let condition2 = item.products?.length > 0;
    let condition3 = item.subCategories && item.subCategories?.length > 0 && item.subCategories.some(subcat => subcat.products?.length > 0);

    return condition1 && ((condition2 || condition3) || !isFullCatalogGot.value);
  });
})

const categoriesForCat2 = computed(() => {
  return editCategories.value.filter(item => item?.subCategories?.length > 0);
})

</script>

<style lang="scss" scoped>
.categories_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17%, 1fr));
  grid-gap: 5px;
  @include maq($bp-medium) {
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  }
  @include maq($bp-small-medium) {
    grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
  }

  @include maq($bp-super-small) {
    grid-gap: 5px;
  }
}

.categories_grid__w {
  h2 {
    margin-bottom: 30px;
  }
}

.categories_grid__w.w1 {
  margin-top: -40px;
}
</style>
