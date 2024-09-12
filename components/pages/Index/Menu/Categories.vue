<template>
  <div
    class="index-menu-categories"
    :class="{'categories-header': headerMenu || isMobileOrTablet, 'categories-page': !headerMenu}"
    style="border: 1px solid; border-color: transparent"
  >
    <div
      class="index-menu-categories__tabs-wrap"
      :class="{'tabs-wrap-header': headerMenu || isMobileOrTablet, 'tabs-wrap-page': !headerMenu && !isMobileOrTablet}"
      @focusout="isShowMore = false"
    >
      <div v-if="(pageType === 'cat1' || pageType === 'cat2' || pageType === 'cat12') && (route.params.subcategory || route.params.subCategorySlug)"
        id="category-tabs"
        class="index-menu-categories__tabs here"
        :class="{'tabs-page': !headerMenu && !isMobileOrTablet}"
      >
        <SubCategoryMenu />
      </div>

      <div v-else
        id="category-tabs"
        class="index-menu-categories__tabs"
        :class="{'tabs-page': !headerMenu && !isMobileOrTablet}"
      >
        <CommonFilterButton
            v-if="isShowFilter && (pageType !== 'cat2' || !'index'.includes(route.name))"
            @click="commonStore.toggleShowFiltersModal(true)"
        />
        <NuxtLink
          title="На главную страницу"
          v-if="route.fullPath !== '/'"
          class="index-menu-categories-tab"
          to="/"
        >
          <UIIcon name="arrow" class="back-button" />
        </NuxtLink>

        <div v-for="item in filteredCategories" :key="item.id" :id="`link-${item.id}`"class="index-menu-categories-tab-span" @mouseenter="mouseenter">
          <NuxtLink          
            class="index-menu-categories-tab"
            :class="{ 'active' : +categoryId === +item.id || !categoryId && +activeTab === +item.id}"
            :to="`/menu/${item.slug}`"
          >
            {{ item.name }}
          </NuxtLink>

          <div class="subCategories" v-if="pageType ==='lending' && item?.subCategories?.length > 0" :style="`top: ${tabRectTop}px; width: ${tabRectWidth}px;`">

            <span v-for="sub in item?.subCategories" @click="scrollToEl(`sub-${sub.id}`, -100)" :key="sub.id">
              {{ sub.name }}
            </span>

          </div> 
        </div>
        
      </div>
    </div>
    
    <div v-if="headerMenu" class="more-button">
      <button @click="openCategoriesModal">•••</button>
    </div>

  </div>
</template>

<script setup>
const catalogStore = useCatalogStore();
const commonStore = useCommonStore();

const pageType = computed(() => commonStore.facade?.catalog_front);

const activeTab = ref(null)
const elseBtn = ref(null)
const dropdownLeftPosition = ref(0)
const isShowMore = ref(false)
const positions = ref([]);
const route = useRoute();
const HEIGHT = 80

const tabRectTop = ref(0);
const tabRectWidth = ref(0);

const categoryId = computed(() => catalogStore.currentCategoryId);
const categories = computed(() => catalogStore.categories);
const headerMenu = computed(() => catalogStore.headerMenu);
const isMobileOrTablet = computed(() => commonStore.isMobileOrTablet);
const isShowFilter = computed(() => commonStore.facade?.show_filter_button);

const filteredCategories = computed(() => {
  return categories.value.filter(cat => {
    if (!catalogStore.isFullCatalogGot) {
      return true;
    }
    else if (cat.products?.length > 0) {
      return true;
    }
    else if (cat.subCategories?.length > 0 && cat.subCategories?.some(item => item.products?.length > 0)) {
      return true;
    }
  })
})


const onScroll = () => {
  const scrollPosition = (window.pageYOffset || document.documentElement.scrollTop) + HEIGHT
  if (scrollPosition < positions.value[0]?.top) {
    return activeTab.value = positions.value[0]?.id || null
  }
  const isset = positions.value.find(item => {
    if (scrollPosition >= (item.top - 40) && scrollPosition <= item.bottom) {
      activeTab.value = item.id

      const tabs = document.getElementById('category-tabs')
      const el = document.getElementById(`link-${item.id}`)
      if (el && tabs) {
        //el.scrollIntoView({behavior: 'smooth', inline: "center"});
        tabs.scroll({
          left: el.offsetLeft,
          behavior: 'smooth'
        })
      }
      return true
    }
    return false
  })
  if (!isset) {
    activeTab.value = null
  }
}

const openCategoriesModal = () => {
  commonStore.categoriesMenuTitle = 'Категории';
  commonStore.toggleShowCategoriesModal(true);
}

const getBlocksPositions = () => {
  categories.value.forEach(item => {
    const el = document.getElementById(`block_${item.id}`)
    if (el) {
      positions.value.push({
        id: item.id,
        top: el.offsetTop,
        bottom: el.offsetTop + el.scrollHeight,
      })
    }
  })
};

const elementVisible = element => {
  var style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) !== 0
    && element.offsetWidth && element.offsetHeight && element.getClientRects().length;
};

const mouseenter = (event) => {
  const element = event.target;
  const rect = element.getBoundingClientRect();

  tabRectTop.value = rect.top + element.scrollHeight;
  tabRectWidth.value = element.scrollWidth;
};

const showActiveMenu = id => {
 // console.log(`CATEGORY_ID: ${categoryId.value} , ACTIVE_TAB: ` + `${activeTab.value}` + `, TARGET_ID: ${id}`);
  const scroll = () => {

  }
  setTimeout(scroll, 10);
};

const changeView = view => {
//  console.log('VIEW: ' + view);
  const id = categoryId.value || activeTab.value;
 // console.log('ID: ' + id);
  showActiveMenu(id);
};

onMounted(() => {
  if (catalogStore.filteredCategory && catalogStore.filteredCategory?.id != catalogStore.currentCategory?.id) {
    catalogStore.resetFilters();
  }
  nextTick(() => {
    activeTab.value = categories.value[0]?.id || null
    getBlocksPositions();
    document.addEventListener('scroll', onScroll);
    categoryId.value ? showActiveMenu(categoryId.value) : null;
    // watch(headerMenu, val => changeView(val), {immediate: true});

    setTimeout(() => {
      getBlocksPositions();
    }, 1000 * 10);
  });
});


</script>

<style lang="scss">
.subCategories {
  display: none;
  flex-direction: column;
  position: fixed;

  background: var(--grayBg2);
  border-radius: 14px;
  border: 2px solid var(--grayBg2);

  box-shadow: 0px 10px 10px 1px rgba(0, 0, 0, 0.06);

  z-index: 1000;

  & > span {
    cursor: pointer;

    padding: 5px 22px;
    font-weight: 400;

    font-size: 15px;

    border-radius: 14px;

    white-space: nowrap;
  
      &:hover {
      background-color: var(--white);
      border-color: transparent;
    }
  }
}
.more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  right: 0;
  z-index: 5;
  height: 100%;

  font-size: 20px;
  font-weight: 500;

  background: var(--grayBg2);

  &::before {
    content: "";
    position: absolute;

    top: 0;
    bottom: 0;
    width: 20px;

    z-index: -1;

    background: inherit;
    filter: blur(10px);
    transform: translateX(-100%);
  }

  & > button {
    width: 30px;
    height: 30px;

    margin-left: 5px;
    margin-right: 5px;

    border-radius: 50%;

    background: var(--grayBg2);
  }
}
.back-button {
  transform: rotate(180deg);
}
.categories-page {
  align-items: baseline;
}
.categories-header {
  align-items: center;
}
.tabs-wrap-page {
  min-height: 48px;
}
.tabs-wrap-header {
  // height: 48px;
  // padding-right: 25px;
}
.tabs-page {
  flex-wrap: nowrap;
}
.index-menu-categories__tabs::-webkit-scrollbar {
  display: none;
}
.index-menu-categories::-webkit-scrollbar {
  display: none;
}

.index-menu-categories {
  // position: sticky;
  // top: 0;

  position: relative;

  display: flex;
  //align-items: baseline;
  justify-content: space-between;
  flex-direction: row;
  grid-gap: 16px;
  z-index: 10;
  align-items: center;
  overflow-x: auto;

  margin-left: -20px;
  margin-right: -20px;


  @include mq($bp-small) {
    flex-direction: row;

    padding: 8px;

    background: var(--grayBg2);
    border-radius: 20px;

    margin-left: 0;
    margin-right: 0;
  }

  &__tabs-wrap {
    height: 48px;

    overflow: hidden;

    @include mq($bp-small) {
      margin: 0;
    }
  }

  &__tabs {
    position: relative;

    display: flex;
    align-items: center;
    grid-gap: 7px;


    padding-right: 25px;

    padding-bottom: 20px;

    overflow-x: auto;

    @include mq($bp-small) {
      margin: 0;
      padding: 0;
    }

    @include maq($bp-small) {
      &:first-child {
        padding-left: 20px;
      }  
    }
  }
}

.index-menu-categories-tab {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 48px;

  padding: 12px 15px;

  @include text_normal;
  font-weight: 500;
  white-space: nowrap;

  background: var(--grayBg2);
  border-radius: 14px;
  border: 2px solid var(--grayBg2);

  transition: background-color 0.3s;

  &-span {
    position: relative;
  }

  &-span:hover {
    @include mq($bp-small) {
      & > div.subCategories {
        display: flex;
      }
    }
  }

  @include mq($bp-small) {
    background: none;
    border-color: var(--grayBg2);
  }

  &:hover {
    background-color: var(--white);
    border-color: transparent;
  }

  &.active {
    background-color: var(--white);
    border-color: var(--yellow);
  }
}

.index-menu-categories-dropdown {
  position: absolute;
  top: 100%;
  left: 0;

  width: 260px;

  display: grid;

  padding: 12px 20px;

  background: var(--white);
  border-radius: 20px;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.08);
  z-index: 100;

  &__item {
    padding: 8px 0;

    @include overflow-text;
    @include text_small;
    font-weight: 600;
    color: var(--black);

    cursor: pointer;
  }
}
</style>
