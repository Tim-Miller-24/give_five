<template>
  <div class="singleCategory__catalog">

    <div class="singleCategory_catalog__head">
      <SectionTitle :level="1" :title="restoredProduct?.name" class="page-title"/>
    </div>

    <CategoriesGrid
        :title="false"
        v-if="showCategoriesGrid"
        :categories="currentCategory.subCategories"
        :isSubcategory="true"
    />

    <ul class="singleCategory__grid" v-else>
      <li
          class="singleCategory_grid__item"
          v-for="(product, i) in products"
          :key="`category-item-product-${i}`"
      >
        <CommonProductCard :item="product" :is-promo="currentCategory.id === 140"/>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {useCatalogStore} from "~/store/catalog";
import {storeToRefs} from "pinia";
import show_error from  "~/utils/show_error";
import SectionTitle from "/components/UI/SectionTitle";
import CategoriesMenu from "/components/common/CategoriesMenu";
import CategoriesGrid from "~/components/pages/Index/Categories/CategoriesGrid.vue";
import Breadcrumbs from "/components/UI/Breadcrumbs";
import MobileCategoriesMenu from "~/components/pages/Index/Menu/MobileCategoriesMenu";


const route = useRoute();
const catalogStore = useCatalogStore();
const {
  currentCategoryId,
  currentCategory,
  currentSubCategoryId,
  subCategories
} = storeToRefs(catalogStore);

const {categorySlug, subCategorySlug, slugProduct} = route.params;

if (slugProduct) {
  catalogStore.productSlug = slugProduct;
}

const restoredProduct = computed(() => catalogStore.slugProduct);

const categories = computed(() => catalogStore.categories);

const localCurrentCategory = computed(() => categorySlug
    ? categories.value.find(cat => cat.slug === categorySlug) : null);

const localCurrentSubCategory = computed(() => subCategories.value && subCategories.value.length
    ? subCategories.value.find(sub => sub.slug === subCategorySlug) : null);

const showCategoriesGrid = computed(() => currentCategory.value.subCategories
    && currentCategory.value.subCategories.length && !currentSubCategoryId.value);

const currentSubCategory = computed(() => subCategories.value?.length && currentSubCategoryId.value
    ? subCategories.value.find(cat => cat.id === currentSubCategoryId.value) : null);

//if(!currentSubCategory.value)  show_error(404);
if(restoredProduct.value){
  useServerSeoMeta({
    title: `${restoredProduct.value?.seo_data.seo_title}`,
    ogTitle: `${restoredProduct.value?.seo_data.seo_title}`,
    description: `${restoredProduct.value?.seo_data.seo_description}`,
    keywords: `${restoredProduct.value?.seo_data.seo_fokuse_keyword}`,
    ogDescription: `${restoredProduct.value?.seo_data.seo_description}`,
    ogImage: `${restoredProduct.value?.seo_data.seo_og_image}`,
  })
}
// else
// if( localCurrentSubCategory.value){
//   console.log(22222)
// useServerSeoMeta({
//   title: localCurrentSubCategory.value?.seo_data.seo_title,
//   ogTitle: `${localCurrentSubCategory.value?.seo_data.seo_title}`,
//   description: `${localCurrentSubCategory.value?.seo_data.seo_description}`,
//   keywords: `${localCurrentSubCategory.value?.seo_data.seo_fokuse_keyword}`,
//   ogDescription: `${localCurrentSubCategory.value?.seo_data.seo_description}`,
//   ogImage: `${localCurrentSubCategory.value?.seo_data.seo_og_image}`,
// })
// }
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
  if (currentSubCategory.value) {
    temp = temp ? temp : currentSubCategory.value.products
    return temp;
  }
  temp = temp ? temp : catalogStore?.currentCategory?.products
  return temp;
});


const bread = computed(() => {
  const crumbs = [];
  if (currentCategory.value) {
    crumbs.push({
      text: currentCategory.value.name,
      to: `/menu/${currentCategory.value.slug}`,
    });
  }
  if (currentSubCategory.value) {
    crumbs.push({
      text: currentSubCategory.value.name,
      to: `/menu/${currentCategory.value.slug}/${currentSubCategory.value.slug}`,
    });
  }
  return crumbs;
});

const filteredCategory = computed(() => catalogStore.filteredCategory);

const product = computed(() => subCategorySlug && !localCurrentSubCategory.value
    ? products.value.find(item => item.slug === subCategorySlug) : null);

//if(!product.value)  show_error(404);

onMounted(() => {
  useHead({
    title: [`${restoredProduct.value?.seo_data.seo_title}`],
  });
  window.scrollTo({top: 0, behavior: 'auto'});
  if (catalogStore.filteredCategory && filteredCategory.value?.id != currentCategory.value?.id) {
    catalogStore.resetFilters();
  }
});

watch(localCurrentCategory, val => val ? currentCategoryId.value = val.id : null, {immediate: true});
watch(localCurrentSubCategory, val => val ? currentSubCategoryId.value = val.id : null, {immediate: true});
watch(product, val => val ? catalogStore.setProduct(val.id) : null, {immediate: true}) ;
watch(restoredProduct, val => val ? catalogStore.setProduct(val.id) : null, {immediate: true}) ;

watchEffect(() => {
  // console.log('******');
  // console.log(localCurrentCategory.value);
  // console.log(localCurrentSubCategory.value);
  // console.log(product.value);
  //не найдены категории или товар по слагу, переводим на 404
  if(!localCurrentCategory.value || (( typeof(product.value) == 'undefined' && typeof(localCurrentSubCategory.value) == 'undefined' ) || (!product.value && !localCurrentSubCategory.value) ) )
    show_error(404)
});

</script>

<style lang="scss" scoped>
.singleCategory__catalog {
  flex-grow: 1;
  @include bp($point_2) {
    overflow: hidden;
  }
}

.singleCategory__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  grid-gap: 5px;
  @include bp($point_2) {
    grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
  }
}

.singleCategory_catalog__head {
  margin: 60px 0 30px 0;
}

.page-title {
  margin-bottom: 12px;
}
</style>
