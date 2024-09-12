<template>
  <div class="singleCategory__catalog">

    <div class="singleCategory_catalog__head">
      <SectionTitle :level="1" :title="!product? (localCurrentSubCategory?.name || localCurrentCategory?.name) : product?.name" class="page-title"/>
    </div>

    <SectionTitle
        v-if="localCurrentSubCategory"
        :level="3"
        :title="localCurrentCategory?.name"
        color="grey"
        style="margin-bottom: 20px; margin-top: -20px;"
    />

    <CategoriesGrid
        :title="false"
        v-if="showCategoriesGrid"
        :categories="localCurrentCategory.subCategories"
        :isSubcategory="true"
    />

    <ul class="singleCategory__grid" v-else>
      <li
          class="singleCategory_grid__item"
          v-for="(product, i) in products"
          :key="`category-item-product-${i}`"
      >
        <CommonProductCard :item="product" :is-promo="localCurrentCategory.id === 140"/>
      </li>
    </ul>

    <div class="category_text" v-if="currentCategory?.description" v-html="currentCategory?.description"></div>
  </div>
</template>

<script setup>
import SectionTitle from "/components/UI/SectionTitle";
import CategoriesGrid from "~/components/pages/Index/Categories/CategoriesGrid.vue";
import show_error from  "~/utils/show_error";

const route = useRoute();
const catalogStore = useCatalogStore();
const commonStore = useCommonStore();

const {
  currentCategoryId,
  currentCategory,
  currentSubCategoryId,
  subCategories
} = storeToRefs(catalogStore);

const {categorySlug, subCategorySlug} = route.params;

const categories = computed(() => catalogStore.categories);

const localCurrentCategory = computed(() => categorySlug
    ? categories.value.find(cat => cat.slug === categorySlug) : null);

const localCurrentSubCategory = computed(() => subCategorySlug
    ? localCurrentCategory?.value?.subCategories.find(cat => cat.slug === subCategorySlug) : null);

// const localCurrentSubCategory = computed(() => subCategories.value && subCategories.value.length
//     ? subCategories.value.find(sub => sub?.slug === subCategorySlug) : null);

const product = computed(() => subCategorySlug && !localCurrentSubCategory.value
    ? localCurrentCategory.value?.products.find(item => item?.slug === subCategorySlug) : null);

const showCategoriesGrid = computed(() => localCurrentCategory.value.subCategories
    && localCurrentCategory.value.subCategories.length && !currentSubCategoryId.value && !!commonStore.selectedProductId);

const currentSubCategory = computed(() => subCategories.value?.length && currentSubCategoryId.value
    ? subCategories.value.find(cat => cat.id === currentSubCategoryId.value) : null);

const not_found_error = ref(false);

//Тут может быть два вариатна из одного слага: подкатегория или продукт
if( (localCurrentSubCategory.value && typeof localCurrentSubCategory.value !== "undefined") && (!product.value || typeof product.value === "undefined") ) {
  useServerSeoMeta({
    title: localCurrentSubCategory.value?.seo_data.seo_title,
    ogTitle: `${localCurrentSubCategory.value?.seo_data.seo_title}`,
    description: `${localCurrentSubCategory.value?.seo_data.seo_description}`,
    keywords: `${localCurrentSubCategory.value?.seo_data.seo_fokuse_keyword}`,
    ogDescription: `${localCurrentSubCategory.value?.seo_data.seo_description}`,
    ogImage: `${localCurrentSubCategory.value?.seo_data.seo_og_image}`,
  })
}else if(product.value && typeof product.value !== "undefined"){
  useServerSeoMeta({
    title: `${product.value?.seo_data.seo_title}`,
    ogTitle: `${product.value?.seo_data.seo_title}`,
    description: `${product.value?.seo_data.seo_description}`,
    keywords: `${product.value?.seo_data.seo_fokuse_keyword || ''}`,
    ogDescription: `${product.value?.seo_data.seo_description}`,
    ogImage: `${product.value?.seo_data.seo_og_image || ''}`,
  })
}


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
  if (localCurrentSubCategory.value) {
    temp = temp ? temp : localCurrentSubCategory.value.products
    return temp;
  }
  temp = temp ? temp : localCurrentCategory.value?.products
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

onMounted(() => {
  useHead({
    //title: [`${ localCurrentCategory.value?.seo_data.seo_title }`],
    title: [`${ localCurrentSubCategory.value?.seo_data.seo_title }`],
  });
  window.scrollTo({top: 0, behavior: 'auto'});
  if (catalogStore.filteredCategory && filteredCategory.value?.id != currentCategory.value?.id) {
    catalogStore.resetFilters();
  }
});

watch(localCurrentCategory, val => val ? currentCategoryId.value = val.id : null, {immediate: true});
watch(localCurrentSubCategory, val => val ? currentSubCategoryId.value = val.id : null, {immediate: true});
watch(product, val => val ? catalogStore.setProduct(val.id) : null, {immediate: true}) ;
watch(not_found_error, val => val ? show_error(404) : null, {immediate: true});

watchEffect(() => {
  // console.log('******');
  // console.log(localCurrentCategory.value);
  // console.log(localCurrentSubCategory.value);
  // console.log(product.value);
  //не найдены категории или товар по слагу, переводим на 404
  if(!localCurrentCategory.value || (( typeof(product.value) == 'undefined' && typeof(localCurrentSubCategory.value) == 'undefined' ) || (!product.value && !localCurrentSubCategory.value) ) )
    show_error(404)
});

//show_error(404)
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
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  grid-gap: 5px;
  @include bp($point_2) {
    grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
  }
}

.singleCategory_catalog__head {
  margin-bottom: 30px;
}

.page-title {
  margin-bottom: 12px;
}

.category_text {
  padding: 10px;
   ::v-deep(a) {
      color: var(--blue);
      text-decoration: underline;
  }
}
</style>
