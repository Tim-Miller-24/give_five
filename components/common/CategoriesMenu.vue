<template>
  <div class="categories_menu__w" id="categories_menu__w">
    <div class="categories_menu__head">
      <UISectionTitle :level="3" title="Меню" />
      <CommonFilterButton
        @click="commonStore.toggleShowFiltersModal(true)"
      />
    </div>
    <nav class="categories_menu">
      <ClientOnly>
        <ul>
          <li
              v-for="(category, i) in filteredMenu"
              :key="`category-link-parent-${i}`"
              :class="{ active: isActiveCategory(category) }"
          >
            <NuxtLink :href="`/menu/${category.slug}`" replace class="category_link__parent" :class="{ active: isOpen(category) }">
              <a >
                <p>{{ category.name }}</p>
              </a>
              <div class="count">
                <UIIcon
                    name="arrow"
                    class="icon"
                    v-if="category.subCategories.length"
                    @click.prevent="toggleSubMenu(category)"
                    :filled="true"
                />
                <p> {{ countProductsInDeepestSubCategories(category) }} </p>
              </div>
            </NuxtLink>
            <ul v-show="isOpen(category)">
              <li
                  v-for="(subcategory, j) in category.subCategories.filter(item => item.products.length > 0)"
                  :key="`subcategory-link-${j}`"
              >
                <NuxtLink :href="`/menu/${category.slug}/${subcategory.slug}`" class="category_link__subcategory">
                  <a>
                    <p>{{ subcategory.name }}</p>
                  </a>
                  <div class="count"> <p>{{ subcategory.products.length }}</p></div>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </ClientOnly>
    </nav>
  </div>
</template>

<script setup>
const commonStore = useCommonStore();

const props = defineProps({
  menu: {
    type: Array,
    default: () => [],
  },
});

const filteredMenu = computed(() => {
  return props.menu.filter(item => item.id !== 16 && item.id !== 140
      && (item.products.length || item.subCategories.some(subCategory => subCategory.products.length)));
})

onMounted(() => {

  nextTick(() => {
    const menu = document.getElementById('categories_menu__w');
  
    const adapteMenuHeight = () => {
        const windowHeight = window.innerHeight;
        const rect = menu.getBoundingClientRect()?.top;
        menu.style.maxHeight = `${windowHeight - rect}px`;
    };
  
    adapteMenuHeight();
  
    window.addEventListener('resize', adapteMenuHeight);
  });

})

const hasProductsInDeepestSubCategory = (category) => {
  if (category.subCategories && category.subCategories.length > 0) {
    return category.subCategories.some(subCategory => hasProductsInDeepestSubCategory(subCategory));
  }
  // Если у категории нет подкатегорий, проверяем текущую категорию на наличие продуктов
  return category.products && category.products.length > 0;
};

const editedMenu = computed(() => {
  return props.menu.filter(item => 
    item.id !== 16 &&
    item.id !== 140 &&
    hasProductsInDeepestSubCategory(item)
  );
});

const countProductsInDeepestSubCategories = (category) => {
  if (!category.subCategories || category.subCategories.length === 0) {
    // Если нет подкатегорий, возвращаем количество продуктов в текущей категории
    return category.products ? category.products.length : 0;
  }

  // Рекурсивно вызываем функцию для подкатегорий и суммируем результаты
  return category.subCategories.reduce((total, subCategory) => {
    return total + countProductsInDeepestSubCategories(subCategory);
  }, 0);
};

const route = useRoute();
const openSubMenus = ref({});

const toggleSubMenu = category => openSubMenus.value[category.slug] = !openSubMenus.value[category.slug];

const isOpen = category => !!openSubMenus.value[category.slug];
const isActiveCategory = category =>  route.path === `/menu/${category.slug}`;

const hasActiveChild = category =>
    category.subCategories.some(subCat => route.path.includes(`/menu/${category.slug}/${subCat.slug}`));


watchEffect(() => {
  props.menu.forEach((category) => {
    openSubMenus.value[category.slug] = hasActiveChild(category);
  });
});
</script>

<style lang="scss" scoped>
.categories_menu__w {
  padding: 20px;
  background-color: var(--grayBg2);
  border-radius: 20px;
  width: 285px;
  max-height: 800px;
  
  overflow-y: hidden;

  &:hover {
    overflow: auto;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* Цвет фона дорожки */
    border-radius: 6px; /* Радиус закругления */
  }

  &::-webkit-scrollbar-thumb {
    background: #bbbbbb; /* Цвет ползунка */
    border-radius: 6px; /* Радиус закругления */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5555557b; /* Цвет ползунка при наведении */
  }
}
.categories_menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.categories_menu__switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 21px;
  background-color: var(--white);
  border-radius: 14px;
  padding: 8px 16px;

  span {
    color: var(--orange);
    font-size: 16px;
    font-weight: 500;
  }
}

.divide {
  height: 20px;
  border-right: 2px solid rgb(150, 150, 150);
  border-radius: 100px;
}

.categories_menu {
  & > ul {
    & > li {
      border-bottom: 1px solid rgb(217, 217, 217);
      transition: all 0.3s ease;
      &.active {
        border-bottom: 1px solid var(--orange);
      }

      & > ul {
        margin-top: -6px;
        padding-bottom: 5px;
      }
    }
  }
}

.count {
  display: flex;

  & > p {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--white);
    padding: 0 8px;
    border-radius: 16px;
    font-size: 12px;
    color: var(--grayText);
    height: 22px;
    width: 30px;
  }

  .ui-icon {
    transform: rotate(90deg);

    &:hover {
      cursor: pointer;
    }
  }
}

.category_link__parent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  &:hover {
    color: var(--orange);
  }
  & > a {
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    max-width: 180px;
    width: 100%;
    &:hover {
      color: var(--orange);
    }
    & > p {
      font-size: 17px;
      font-weight: 600;
      padding-right: 18px;
    }
    
  }

  &.active {
    .count {
      .ui-icon {
        transform: rotate(-90deg);
      }
    }
  }
}
.category_link__subcategory {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 5px 0 5px 15px;

  & > a {
    display: inline-flex;
    width: 100%;
    align-items: center;
    & > p {
      font-size: 15px;
      font-weight: 600;
      padding-right: 18px;
    }
    .ui-icon {
      transform: rotate(90deg);
    }
  }
}

.router-link-active {
  color: var(--orange);
}

.category_link__subcategory {
  position: relative;

  &:hover {
    cursor: pointer;
    color: var(--orange);
  }

  .router-link-active {
    color: var(--orange);
    &:before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: 1px solid var(--orange);
    }
  }
}
</style>
