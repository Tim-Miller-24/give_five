<template>
  <div>
    <div
        class="singleCategory__catalog"
        v-if="['cat1', 'cat2'].includes(viewMode)"
    >
      <div class="singleCategory_catalog__head">
        <SectionTitle :level="1" :title="currentCategory && currentCategory.name || ''" class="page-title"/>
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
    <div
        class="index"
        v-else
    >
      <PagesIndexMenu v-if="localCurrentCategory" :block="localCurrentCategory" />
    </div>
  </div>

</template>

<script setup>

import show_error from  "~/utils/show_error";

import SectionTitle from "/components/UI/SectionTitle";
import CategoriesMenu from "/components/common/CategoriesMenu";
import CategoriesGrid from "~/components/pages/Index/Categories/CategoriesGrid.vue";


const route = useRoute();
const catalogStore = useCatalogStore();
const commonStore = useCommonStore();

const {
  currentCategoryId,
  currentCategory,
  currentSubCategoryId,
  subCategories
} = storeToRefs(catalogStore);

const {categorySlug} = route.params;

const categories = computed(() => catalogStore.categories);

const localCurrentCategory = computed(() => categorySlug
    ? categories.value.find(cat => cat.slug === categorySlug) : null);

watchEffect(() => {
  if(!localCurrentCategory.value) show_error(404);
});
//if(!localCurrentCategory.value)  show_error(404);

useServerSeoMeta({
  title: localCurrentCategory.value?.seo_data.seo_title,
  ogTitle: `${localCurrentCategory.value?.seo_data.seo_title}`,
  description: `${localCurrentCategory.value?.seo_data.seo_description}`,
  keywords: `${localCurrentCategory.value?.seo_data.seo_fokuse_keyword}`,
  ogDescription: `${localCurrentCategory.value?.seo_data.seo_description}`,
  ogImage: `${localCurrentCategory.value?.seo_data.seo_og_image}`,
})

const showCategoriesGrid = computed(() => currentCategory.value && currentCategory.value.subCategories
    && currentCategory.value.subCategories.length && !currentSubCategoryId.value);

const currentSubCategory = computed(() => subCategories.value && subCategories.value.length
&& currentSubCategoryId.value ? subCategories.value.find(cat => cat.id === currentSubCategoryId.value) : null);

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

const HEIGHT = computed(() => catalogStore.HEIGHT);

const viewMode = computed(() => commonStore.facade.catalog_front);

onMounted(() => {
  watch(localCurrentCategory, val => val ? currentCategoryId.value = val.id : null, {immediate: true});
  // useHead({
  //   title: [`${ localCurrentCategory.value?.seo_data.seo_title }`],
  // });

  nextTick(() => {
    if (['cat1', 'cat2'].includes(viewMode.value)) {
      window.scrollTo({top: 0, behavior: 'auto'});
    }
    else {
      const scroll = () => {
        const element = document.querySelector('#category-name');
        const menuHeight = document.querySelector('#categories')?.offsetHeight;
        const subMenuHeight = document.querySelector('#sub-category-menu')?.offsetHeight || 0;
        const topPos = element?.getBoundingClientRect().top - HEIGHT.value * 2 - menuHeight - subMenuHeight
        console.log('%c' + `TOP_POS: ${topPos}, ELEMENT: ${element}`, 'color: blue;');
        window.scrollTo({top: topPos, behavior: "auto"});
        console.log('%c' + `Current scrollY: ${window.scrollY}`, 'color: green;');
      }
      setTimeout(scroll, 1);
    }
  })
});

</script>

<style lang="scss" scoped>
.singleCategory__catalog {
  flex-grow: 1;
  @include bp($point_2) {
    overflow: hidden;
  }
}
:deep(.categories_grid__w.w2) {
  margin-left: -20px;
  margin-right: -20px;
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
</style>
