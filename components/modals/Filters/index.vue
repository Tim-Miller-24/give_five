<template>
  <ModalsOverlay
    :is-show="isShowFilters"
    @close="closeModal()"
  >
    <div class="modal-filters">
      <div class="modal-filters__main">
        <div class="modal-filters__header">
          <p class="modal-filters__title">
            Фильтры
          </p>

          <a
            href="#"
            class="modal-filters__close"
            @click.prevent="closeModal()"
          >
            <UIIcon name="close" />
          </a>
        </div>

        <div class="modal-filters__list">
          <ModalsFiltersBlock
            title="Цена"
            class="modal-filters__item"
            :isHaveSelectedItem="selectedPriceFilters?.length > 0"
          >

            <label class="radio">
              <input class="radio__input" type="radio" id="up" value="up" v-model="selectedPriceFilters" />
              <span class="radio__box"></span>
              <label class="radio__text" for="up">По возрастанию</label>
            </label>

            <label class="radio">
              <input class="radio__input" type="radio" id="down" value="down" v-model="selectedPriceFilters" />
              <span class="radio__box"></span>
              <label class="radio__text" for="down">По убыванию</label>
            </label>

          </ModalsFiltersBlock>

          <ModalsFiltersBlock 
            v-if="attributes.length > 0"
            v-for="(attribute, index) in attributes" 
            :key="index"
            :title="attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1)"
            class="modal-filters__item"
            :isHaveSelectedItem="attribute?.options?.some(option => selectedAttributesFilters?.includes(option))"
          >
            <template #default="{ isHaveSelectedItem }">
              <label 
                class="checkbox" 
                v-for="(option, i) in attribute.options" 
                :key="i"
                :isHaveSelectedItem="selectedAttributesFilters?.includes(option)"
              >
                <input 
                  type="checkbox" 
                  class="checkbox__input" 
                  :id="i"
                  :value="option" 
                  v-model="selectedAttributesFilters" 
                />
                <span class="checkbox__box"></span>
                <span class="checkbox__text">{{ option }}</span>
              </label>
            </template>
          </ModalsFiltersBlock>



          <ModalsFiltersBlock v-if="productBadge.length > 0"
            title="Теги"
            class="modal-filters__item"
            :isHaveSelectedItem="selectedBadgeFilters?.length > 0"
          >
            <label class="checkbox" v-for="(item, index) in productBadge" :key="index">
              <input type="checkbox" class="checkbox__input" :id="index"
              :value="item" v-model="selectedBadgeFilters" />

              <span class="checkbox__box"></span>

              <span class="checkbox__text">{{ item }}</span>
            </label>

          </ModalsFiltersBlock>
        </div>
      </div>

      <div class="modal-filters__footer">
        <div class="modal-filters__buttons">
          <UIButton
            color="gray"
            class="modal-filters__button"
            @click="resetFilters()"
          >
            Сбросить фильтры
          </UIButton>

          <UIButton
            color="yellow"
            class="modal-filters__button"
            @click="submit()"
          >
            Применить фильтры
          </UIButton>
        </div>
      </div>
    </div>
  </ModalsOverlay>
</template>

<script setup>
const route = useRoute();

const commonStore = useCommonStore();
const catalogStore = useCatalogStore();

const {categorySlug, subCategorySlug} = route.params;

const isShowFilters = computed(() => commonStore.isShowFiltersModal);

const {
  categories,
  currentCategoryId,
  currentCategory,
  currentSubCategoryId,
  subCategories
} = storeToRefs(catalogStore);

const localCurrentCategory = computed(() => categorySlug
    ? categories.value.find(cat => cat.slug === categorySlug) : null);

const localCurrentSubCategory = computed(() => subCategorySlug
    ? localCurrentCategory?.value?.subCategories.find(cat => cat.slug === subCategorySlug) : null);

const selectedPriceFilters = ref('')

const selectedAttributesFilters = ref([]);

const selectedBadgeFilters = ref([]);

const attributes = ref([]);

const productBadge = ref([]);

onMounted(() => {
  selectedPriceFilters.value = catalogStore.selectedPriceFilters || '';
  selectedAttributesFilters.value = catalogStore.selectedAttributesFilters || [];
  selectedBadgeFilters.value = catalogStore.selectedBadgeFilters || [];

  if (localCurrentSubCategory.value) {
    getProducts(localCurrentSubCategory.value.products);
  }
  else if (localCurrentCategory.value) {
    getProducts(localCurrentCategory.value.products);
  }
  else {
    let temp = catalogStore.categories;
    let allProducts = temp.reduce((accumulator, category) => {
    return accumulator.concat(category.products);
    }, []);

    getProducts(allProducts);
  }
})

function getProducts(products) {
  let productsWithAttributes = products.filter(product => product.attributes.length > 0);

  let temp = [... new Set(productsWithAttributes.map(item => item.attributes).flat())];

  let decodedArr = []
  try {
    decodedArr = temp.map(attribute => {
      const decodedOptions = attribute.options.map(option => {
          return decodeURIComponent(option);
      });
      return { ...attribute, options: decodedOptions };
    });

  } catch (err){}

  attributes.value = decodedArr.reduce((acc, attribute) => {
  // Проверяем, есть ли уже атрибут с таким именем в аккумуляторе
  const existingAttribute = acc.find(item => item.name === attribute.name);

  if (existingAttribute) {
    // Если атрибут уже существует, добавляем новые опции, исключая дубли
    existingAttribute.options = [...new Set([...existingAttribute.options, ...attribute.options])];
  } else {
    // Если атрибута нет, добавляем его в аккумулятор
    acc.push({ ...attribute });
  }

  return acc;
}, []);
  let productsWithBadge = products.filter(product => product.acf['product-badge']?.length > 0);

  productBadge.value = [... new Set(productsWithBadge.map(item => item.acf['product-badge']).flat())];
}

const submit = () => {
  catalogStore.setSelectedPriceFilters(selectedPriceFilters.value);

  catalogStore.setSelectedAttributesFilters(selectedAttributesFilters.value);

  catalogStore.setSelectedBadgeFilters(selectedBadgeFilters.value);

  if (!catalogStore.currentCategory) {
    catalogStore.sortAllCategories();
  }

  catalogStore.filteredCategory = catalogStore.currentCategory;

  closeModal();
}

function resetFilters() {
  closeModal();

  catalogStore.resetFilters();
}

const closeModal = () => {
  document.body.classList.remove('overflow-hidden');
  commonStore.toggleShowFiltersModal(false);
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  grid-gap: 10px;

  @include text_normal;
  font-weight: 500;
  color: var(--black);

  cursor: pointer;

  &__input {
    display: none;

    &:checked + .checkbox {
      &__box {
        border-color: var(--yellow);
        background: $yellow url('@/assets/svg/checked.svg')no-repeat 50%;
      }
    }
  }

  &__box {
    width: 24px;
    height: 24px;

    border: 2px solid var(--grayText2);
    border-radius: 7px;
  }
}

.radio {
  display: flex;
  align-items: center;
  grid-gap: 10px;
  cursor: pointer;

  &__input {
    display: none;

    &:checked + .radio__box {
      border-color: var(--yellow);

      &:after {
        opacity: 1;
      }
    }
  }

  &__text {
    color: var(--black);
    font-weight: 500;
    cursor: pointer;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;

    border: 2px solid var(--grayText2);
    border-radius: 50%;

    &:after {
      content: '';

      width: 16px;
      height: 16px;

      background: var(--yellow);
      border-radius: 50%;

      transition: opacity 0.3s;
      opacity: 0;
    }
  }
}
.modal-filters {
  width: 100vw;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: var(--white);

  @include mq($bp-small) {
    max-width: 640px;
    min-height: auto;

    border-radius: 40px;
  }

  &__main {
    display: flex;
    flex-direction: column;
    grid-gap: 15px;

    padding: 20px 20px 60px;

    @include mq($bp-small) {
      padding: 50px 60px 60px;
    }

    @include maq($bp-small) {
      padding-bottom: 120px;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    @include h2;
  }

  &__close {
    ::v-deep(.ui-icon) svg {
      width: 24px;
      height: 24px;

      path {
        fill: var(--grayText);
      }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;

    grid-gap: 15px;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    grid-gap: 20px;

    padding: 40px 20px 20px;

    border-top: 1px solid var(--grayBg2);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

    @include mq($bp-small) {
      padding: 40px 60px 50px;
    }

    @include maq($bp-small) {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: var(--white);
      z-index: 100;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-gap: 16px;
  }

  &__button {
    font-weight: 500;
  }
}
</style>