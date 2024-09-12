<template>
  <div
    id="sub-category-menu"
    class="index-menu-categories header__categories sub-categories"
  >
    <div
      id="index-menu-categories__tabs"
      class="index-menu-categories__tabs"
      v-if="localCurrentCategory && localCurrentCategory.subCategories.length"
    >
      <NuxtLink
          title="Назад"
          v-if="route.fullPath !== '/'"
          class="index-menu-categories-tab"
          @click="backClick"
      >
        <UIIcon name="arrow" class="back-button" />
      </NuxtLink>
      <div
        class="index-menu-categories-tab"
        v-for="(cat, index) in localCurrentCategory.subCategories.filter(subcat => subcat.products?.length > 0)"
        :id="`menu-sub-${cat.id}`"
        style="cursor: pointer"
        :class="[{'active': route.params.subCategorySlug === cat.slug}]"
        :key="`cat-${index}`"
        @click="click(cat)"
      >
        {{ cat.name }}
      </div>
    </div>
  </div>

</template>

<script setup>
const catalogStore = useCatalogStore();
const commonStore = useCommonStore();
const route = useRoute()
const router = useRouter();

const {currentSubCategoryId, HEIGHT, categories, headerMenu} = storeToRefs(catalogStore);

const {categorySlug, subCategorySlug} = route.params;

const pageType = computed(() => commonStore.facade?.catalog_front);

const ownHeight = computed(() => document.getElementById('sub-category-menu').offsetHeight);
const offset = computed(() => headerMenu.value ? HEIGHT.value : HEIGHT.value + ownHeight.value);

const localCurrentCategory = computed(() => categorySlug
? categories.value.find(cat => cat.slug === categorySlug) : null);

const localCurrentSubCategory = computed(() => subCategorySlug
? localCurrentCategory?.value?.subCategories.find(cat => cat.slug === subCategorySlug) : null);

const positions = ref([]);

function backClick() {
  if (pageType.value === 'cat1' || pageType.value === 'cat2') {
    scrollToEl();
    router.push(`/menu/${route.params.categorySlug || ''}`);
  }
  else if (pageType.value === 'lending_cat' || pageType.value === 'cat12') {
    scrollToEl();
    router.push(`/menu/${route.params.categorySlug || ''}`);
  }
}

function click(category) {
  if (pageType.value === 'cat1' || pageType.value === 'cat2') {
    router.push(route.fullPath.replace(route.params.subCategorySlug, category.slug));
  }
  else if (pageType.value === 'lending_cat' || pageType.value === 'cat12') {
    scrollTo(category.id)
  }
}

const scrollTo = id => {
  scrollToEl(`sub-${id}`, -offset.value)
}
const getBlockPositions = () => {
  localCurrentCategory.value.subCategories.forEach(item => {
    const el = document.getElementById(`sub-${item.id}`)
    if (el) {
      positions.value.push({
        id: item.id,
        top: el.offsetTop,
        bottom: el.offsetTop + el.scrollHeight,
      })
    }
  })
};

const onScroll = (e) => {
  const scrollPosition = (window.pageYOffset || document.documentElement.scrollTop) + HEIGHT.value;

  if (scrollPosition < positions.value[0]?.top) {
    return currentSubCategoryId.value = positions.value[0]?.id || null
  }

  const isset = positions.value.find(item => {
    if (scrollPosition >= (item.top - 40) && scrollPosition <= item.bottom) {
      currentSubCategoryId.value = item.id

      const tabs = document.getElementById('index-menu-categories__tabs')
      const el = document.getElementById(`menu-sub-${item.id}`)
      if (tabs && el) {
        tabs.scroll({
          left: el.offsetLeft,
          behavior: 'smooth'
        })
      }

      return true
    }

    return false
  })
}

onMounted(() => {
  nextTick(() => {
    getBlockPositions();
    document.addEventListener('scroll', onScroll);

    setTimeout(() => {
      getBlockPositions();
    }, 1000 * 10);
  })
});
</script>

<style lang="scss" scoped>
.index-menu .sub-categories{
  margin-bottom: 1.3em;
}
.index-menu-categories__tabs::-webkit-scrollbar {
  display: none;
}

.index-menu-categories-tab {
  &:hover {
    cursor: pointer;
  }
}

@include maq($bp-small) {
  .header__side {
    .index-menu-categories__tabs {
      padding-bottom: 0;
    }

    .sub-categories {
      margin-bottom: 0;
    }
  }
}
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
