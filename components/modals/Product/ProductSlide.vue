<template>
  <div ref="modalProduct" class="modal-product" :id="`modal-product-${props.item.id}`">
    <button
      type="button"
      class="modal-product__close"
      @click.prevent="closeModal()"
    >
      <UIIcon name="close" />
    </button>

    <div class="modal-product__main">
      <div class="modal-product__image">
        <div v-if="!isImageLoaded" class="loader" :class="[{'min-height': !isImageLoaded}]"></div>
        <img
          v-lazy-load
          :data-src="productImage"
          :alt="product.name"
          :key="product.id"
          :class="[{'min-height': !isImageLoaded}]"
          @load="isImageLoaded = true"
        >
        
        <p
          v-if="discount"
          class="modal-product__discount"
        >
          -{{ discount }}%
        </p>

        <button
          type="button"
          :class="['modal-product__favorite', { 'modal-product__favorite--active' : isProductFavorite(+product.id) }]"
          @click.prevent="toggleFavorite()"
        >
          <UIIcon name="heart" />
        </button>

        <div class="modal-product__characteristics">
          <div v-if="badges.includes('halal')" class="modal-product__characteristic">
            <UIIcon name="icon-halal" />
          </div>
          <div v-if="badges.includes('preorder')" class="modal-product__characteristic">
            <UIIcon name="icon-hit" />
          </div>
          <div v-if="badges.includes('vegan')" class="modal-product__characteristic">
            <UIIcon name="icon-vegan" />
          </div>
          <div v-if="badges.includes('spicy')" class="modal-product__characteristic">
            <UIIcon name="icon-hot" />
          </div>
        </div>
      </div>

      <div class="modal-product__content">
        <div class="modal-product__header">
          <h1 class="modal-product__title">
            {{ productTitle }}
          </h1>

          <p
            v-if="!isCountable && isMobileOrTablet"
            class="modal-product-weight uncountable"
          >
            <span>
              {{ product.portion_nat_size }} {{ product.measure_unit }}
            </span>

            <span>
              {{ productPrice }} ₽
            </span>
          </p>

          <div
              class="modal-product__footer-line"
              v-if="isMobileOrTablet"
          >
            <p
              v-if="isCountable && productWeight"
              class="modal-product-weight"
            >
              <span>
                Вес
              </span>
              <span>
                {{ productWeight }} гр
              </span>
            </p>

            <p
                v-if="isManageStock && facade.show_stock_value"
                class="modal-product-weight">
                <span>
                  В наличии
                </span>
                      <span
                          v-if="inStock"
                      >
                  {{ inStock }} {{ productMeasureUnit }}
                </span>
            </p>
            <p
                v-else-if="!isManageStock && facade.show_stock_value"
                class="modal-product-weight">
              <span>
                В наличии
              </span>
            </p>
          </div>

          <div class="modal-product__description"
            :class="[
                {'hide': !isShowMoreDescription && !isMobileOrTablet}, 
                {'show': isShowMoreDescription || isMobileOrTablet}
              ]">
              <div
                v-html="productDescription"
                class="modal-product__description-text"
                id="modal-product__description-text"
                :class="[
                  {'hide': !isShowMoreDescription && !isMobileOrTablet}, 
                  {'show': isShowMoreDescription || isMobileOrTablet}
                ]"
              />
              <button class="modal-product__description-more" 
              v-if="!isMobileOrTablet && isHeightBigger"
              :class="[
                {'hide': !isShowMoreDescription}, 
                {'show': isShowMoreDescription}
              ]"
              @click="isShowMoreDescription = !isShowMoreDescription">
                <span v-if="!isShowMoreDescription">ещё ↓</span>
                <span v-else>скрыть ↑</span>
              </button>
            </div>

        </div>
        <div
          v-if="(productType === 'variable') && productAttributes.length"
          class="modal-product-attributes"
        >
          <div
            v-for="(attribute, a) in productAttributes"
            :key="attribute.id"
            class="modal-product-attributes__line"
          >
            <button
              v-for="(option, o) in attribute.options"
              :key="o"
              :class="['modal-product-attributes__button', { 'active' : +currentVariableIdx[a] === o }]"
              @click.prevent="setCurrentVariableIdx(o, a)"
            >
              {{ decodeURI(option) }}
            </button>
          </div>
        </div>
        <ul
          v-if="(productType === 'simple') && productAttributes.length"
          class="modal-product-attributes  modal-product-attributes--char"
        >
          <li
            v-for="(attribute, index) in productAttributes"
            :key="index"
            class="modal-product-attributes__line modal-product-attributes__line--char"
            :class="{'gray': index % 2 !== 0}"
          >
            <h4>
              {{ attribute.name }}
            </h4>

            <p>
              {{ attribute.options[0] }}
            </p>

          </li>
        </ul>

        <div
          v-if="variations.length"
          class="modal-product-attributes"
        >
          <div class="modal-product-attributes__line">
            <button
              v-for="variation in variations"
              :key="variation.product"
              :class="['modal-product-attributes__button', { 'active' : variation.product === product.id }]"
              @click.prevent="setVariation(variation.product)"
            >
              <p>{{ variation.product_name_short }} </p>
            </button>
          </div>
        </div>

        <div
          v-if="productSupplements.length"
          class="modal-product-add"
        >
          <p class="modal-product-add__title">
            Добавить к блюду
          </p>

          <div class="modal-product-add__supplements-catalog supplements-catalog" v-if="isShowCatalogSupplements && productSupplements.length > 1">

            <div class="supplements-catalog__item"  v-for="(supplement, index) in productSupplements" :key="index">
              <h3 class="supplements-catalog__title"> 
                {{ supplement.title }} 
                <span
                  v-if="supplement.supplement_required === 'yes'"
                  class="supplements-catalog__required"
                >
                  Обязательно
                </span>

                <UIIcon name="arrow" class="supplements-catalog__arrow" 
                :class="{'opened': toggledSupplements.includes(index)}"
                @click="toggleSupplementsCatalog(index)" />
              </h3>
              

              <div class="supplements-catalog__content"
              :class="{'opened': toggledSupplements.includes(index)}"
              style="margin-top: 1rem;">
                <ModalsSupplementsProduct
                  v-for="(product, i) in products"
                  :key="i"
                  :item="product"
                  :supplement="[supplement]"
                  :quantity="supplement.quantity"
                  :max="+supplement.quantity_max || 10"
                  :min="+supplement.quantity_min"
                  :switcherView="isShowCatalogSupplements"
                  @select="selectProduct"
                  @increment="incrementSingleSupplement"
                  @decrement="decrementSingleSupplement"
                />
              </div>

            </div>
          </div>

          <div class="modal-product-add__content" v-else-if="productSupplements.length > 1">
            <div 
              v-for="(supplement, s) in productSupplements"
              :key="s"
              :class="['modal-product-add-item', { 'active' : selectedSupplements[s]?.length }]"
              @click="openSupplementsModal(supplement, s)"
            >
              <div
                v-if="selectedSupplements[s]?.length"
                class="modal-product-add-item__selected"
              >
                <span>
                  {{ selectedSupplements[s].reduce((acc, item) => { acc += item.count; return acc }, 0) }} шт
                </span>
                <span>
                  {{ selectedSupplements[s].reduce((acc, item) => { acc += item.count * item.price; return acc }, 0) }} ₽
                </span>
              </div>
              <div
                v-else-if="supplement.supplement_required === 'yes'"
                class="modal-product-add-item__required"
              >
                Обязательно
              </div>
              <div class="modal-product-add-item__image">
                <img
                  v-lazy-load
                  :data-src="supplement.image"
                  alt=""
                  :src="supplement.image"
                  loading="lazy"
                >
              </div>
              <div class="modal-product-add-item__box">
                {{ supplement.title }}
              </div>
            </div>
          </div>

          <div v-else>
              <div class="modal-product-add-item__box-one-supplement">
                <h3 class="modal-product-add-item__box-one-supplement__title"> 
                  {{ productSupplements[0].title }} 
                  <span
                    v-if="productSupplements[0].supplement_required === 'yes'"
                    class="modal-product-add-item__box-one-supplement__required"
                  >
                    Обязательно
                  </span>
                </h3>
                

                <div class="modal-product-add__content solo-add" style="margin-top: 1rem;">
                  <ModalsSupplementsProduct
                    v-for="(product, i) in products"
                    :key="i"
                    :item="product"
                    :supplement="supplement"
                    :quantity="productSupplements[0].quantity"
                    :max="+productSupplements[0].quantity_max || 10"
                    :min="+productSupplements[0].quantity_min"
                    :remains="countRemains"
                    @select="selectProduct"
                    @increment="incrementSingleSupplement"
                    @decrement="decrementSingleSupplement"
                  />
                </div>

              </div>
          </div>

        </div>

        <div
          v-if="productAcf.uglevod_product_nutr || productAcf.fat_product_nutr || productAcf.protein_product_nutr || productAcf.kkal_product_nutr"
          class="modal-product__structure modal-product-structure"
        >
          <p class="modal-product-structure__title">
            Пищевая ценность на 100г
          </p>
          <div class="modal-product-structure__cols">
            <div
              v-if="productAcf.uglevod_product_nutr"
              class="modal-product-structure__col"
            >
              <p class="modal-product-structure__value">
                {{ roundNumber(productAcf.uglevod_product_nutr) }} г
              </p>
              <p class="modal-product-structure__label">
                Углеводы
              </p>
            </div>
            <div
              v-if="productAcf.fat_product_nutr"
              class="modal-product-structure__col"
            >
              <p class="modal-product-structure__value">
                {{ roundNumber(productAcf.fat_product_nutr) }} г
              </p>
              <p class="modal-product-structure__label">
                Жиры
              </p>
            </div>
            <div
              v-if="productAcf.protein_product_nutr"
              class="modal-product-structure__col"
            >
              <p class="modal-product-structure__value">
                {{ roundNumber(productAcf.protein_product_nutr) }} г
              </p>
              <p class="modal-product-structure__label">
                Белки
              </p>
            </div>
            <div
              v-if="productAcf.kkal_product_nutr"
              class="modal-product-structure__col"
            >
              <p class="modal-product-structure__value">
                {{ roundNumber(productAcf.kkal_product_nutr) }}
              </p>
              <p class="modal-product-structure__label">
                Ккал
              </p>
            </div>
          </div>
        </div>

        <div class="modal-product__footer" v-if="!isMobileOrTablet">
          <div
              class="modal-product__footer-line"
              v-if="!isMobileOrTablet"
          >
            <p
              v-if="isCountable && productWeight"
              class="modal-product-weight"
            >
              <span>
                Вес
              </span>
              <span>
                {{ productWeight }} {{ product.measure_unit }}
              </span>
            </p>
            <p
              v-if="isCountable && productVolume"
              class="modal-product-weight"
            >
              <span>
                Объём
              </span>
              <span>
                {{ productVolume }} {{ product.measure_unit }}
              </span>
            </p>
            <p
              v-if="!isCountable"
              class="modal-product-weight"
            >
              <span>
               {{ product.portion_nat_size }} {{ product.measure_unit }}
              </span>

              <span>
                {{ (+productPrice).toLocaleString() }} ₽
              </span>
            </p>
            <p
                v-if="isManageStock && facade.show_stock_value"
                class="modal-product-weight w1">
                <span>
                  В наличии
                </span>
                      <span
                          v-if="inStock"
                      >
                  {{ inStock }} {{ productMeasureUnit }}
                </span>
            </p>
            <p
                v-else-if="!isManageStock && facade.show_stock_value"
                class="modal-product-weight w2">
              <span>
                В наличии
              </span>
            </p>
          </div>

          <div class="modal-product__buttons">
            <CommonPriceBlock
            :product="product"
            class="price-block"
            :regular-price="+productRegularPrice"
            :price="+productPrice"
            is-reverse
            is-big
            isModal
            />

            <CommonNotification v-model:modelValue="notificationVisible" :message="notificationMessage" />

            <CommonAddButton
              :currentItem="product"
              :item="currentProductInCart.item"
              :pricesForVariation="[+productPrice, +productRegularPrice]"
              product-type="simple"
              :buttonLabel="props.isOpenedFromCart ? 'Изменить' : null"
              :disabled="disalbeState"
              @increment="increment()"
              @decrement="decrement()"
              @add="addToCart()"
              @pointerdown="handlePointerDown"
              @maximumReached="maximumReached"
              class="modal-product__button"
            />
          </div>
        </div>
      </div>
    </div>

    <ModalsProductElse
      v-if="elseArray.length"
      :related="elseArray"
    />

    <div class="modal-product__overlay"></div>

    <Teleport :to="teleportTo" v-if="isMobileOrTablet && teleportTo && (+activeProductModalSlide === +props.item.id || props.isNoSlider)">
      <div class="modal-product__footer teleported" :id="`modal-product-footer-${props.item.id}`" v-if="isMobileOrTablet">
        <div class="modal-product__buttons">
          <CommonPriceBlock
          :product="product"
          class="price-block"
          :regular-price="+productRegularPrice"
          :price="+productPrice"
          is-reverse
          is-big
          isModal
          />

          <CommonNotification v-model:modelValue="notificationVisible" :message="notificationMessage" />

          <CommonAddButton
            :item="currentProductInCart.item"
            :currentItem="product"
            product-type="simple"
            :buttonLabel="props.isOpenedFromCart ? 'Изменить' : null"
            :disabled="disalbeState"
            @increment="increment()"
            @decrement="decrement()"
            @add="addToCart()"
            @pointerdown="handlePointerDown"
            @maximumReached="maximumReached"
            class="modal-product__button"
          />
        </div>
      </div>
    </Teleport>
  </div>  


  <!-- 
    <button v-else type="submit" :disabled="disabled" :class="[
    'add-button',
    {
      'add-button--reverse': productType === 'simple',
      'add-button--small': isSmall,
      'add-button--app': isAppStyle,
    },
  ]" @click.stop.prevent="click()">
    <small v-if="+props.currentItem.regular_price > +props.currentItem.price">
      {{ (+props.currentItem.regular_price).toLocaleString() }} ₽
    </small>
    
    <span> {{ (+props.currentItem.price).toLocaleString() }} ₽ </span>
    <UIIcon name="cart" />
  </button>
   -->

  <ModalsSupplements
    v-if="isShowSupplementsModal"
    :item="currentSupplement"
    :selected="selectedSupplements[currentSupplementKey]"
    @submit="selectSupplemets"
    @close="closeSupplementsModal()"
  />
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: {},
  },
  isNoSlider: {
    type: Boolean,
    default: false,
  },
  cartProductSelectedSupplements: {
    type: Array,
    default: null,
  },
  isOpenedFromCart: {
    type: Boolean,
    default: false,
  }
})

const fixedButton = ref();
const modalBox = ref();
const teleportTo = ref();

const catalogStore = useCatalogStore()
const cart = useCartStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const commonStore = useCommonStore()
const facade = computed(() => commonStore.getFacade);

const isShowCatalogSupplements = computed(() => {
  switch (product.value.design_version) {
    case 1:
      return true;
      break;
    case 2:
      return false;
      break;
    default:
      return false;
      break;
  }
})

const { categories, selectedProduct, relatedItems, isProductFavorite, uncategorizedProducts, subCategories, currentSubCategoryId, elseProductOpened } = storeToRefs(catalogStore)
const { productInCart } = storeToRefs(cart)

const activeProductModalSlide = computed(() => commonStore.activeProductModalSlide)
const currentCategory = computed(() => catalogStore.currentCategory);

const currentSubCategory = computed(() =>
  subCategories?.value?.find((sub) => sub.id === currentSubCategoryId.value)
);

const currentSubSub = computed(() => {
  return currentSubCategory?.value?.subCategories?.find((sub) => sub.id === currentSubSubCatId.value)
})

currentSubCategoryId.value = Number(route.params.subcategory);
const currentSubSubCatId = ref(null);

const isImageLoaded = ref(false);

const productForSlider = ref();

const isShow = ref(true)
const isMobileOrTablet = computed(() => commonStore.isMobileOrTablet)
const isShowSupplementsModal = ref(false) // Модалка для добавок
const currentSupplement = ref(null) // выбранная категории добавок
const currentSupplementKey = ref(null) // ключ выбранной категории добавок
const selectedSupplements = ref({}) // Все выбранные добавки
const variations = ref([])
const variationIds = ref({})
const currentVariableIdx = ref([0, 0])
const currentVariableId = ref(null)
const isShowMoreDescription = ref(false);
const isHeightBigger = ref(false);

const headerTitle = ref('');

const supplement = ref([])
const isSingleSupplementSelected = ref(false);

const showNextSliderArrow = ref(true);
const showPrefSliderArrow = ref(true);

const productsForSlider = ref();
const currentIdForSlide = ref();
const initialScrollY = ref()

const toggledSupplements = ref([])

const startX = ref();
const startY = ref();
const swipeElement = ref();
const MIN_SWIPE_DISTANCE = 100;
const FADE_DURATION = 500;

const notificationVisible = ref(false);
const notificationMessage = ref('');

// Computed

const supplementsPrice = computed(() => {
  const obj = selectedSupplements.value
  let sum = 0
  for (const key in obj) {
    sum += obj[key].reduce((acc, item) => {
      acc += item.count * item.price
      return acc
    }, 0)
  }

  return sum
})

const product = ref(props.item)

const parentProduct = ref();

const isAnySupplementsRequired = computed(() => {
  return productSupplements.value.some(item => item.supplement_required === 'yes');
})

const products = computed(() => {

  const products = productSupplements.value[0].products || []

  return products.map(item => {
    return uncategorizedProducts.value.find(ingredient => +ingredient.id === +item)
  }).filter(item => item)
})

const productTitle = ref(product.value.name)

const quantityMax = computed(() => {
  return +(productSupplements.value[0].quantity_max || 0)
})

const quantityMin = computed(() => {
  return +(productSupplements.value[0].quantity_min || 0)
})

const countRemains = computed(() => {
  if (quantityMax.value) {
    return quantityMax.value - countSelected.value
  }

  return null
})

const countSelected = computed(() => {
  return supplement.value.reduce((acc, item) => {
    acc += item.count

    return acc
  }, 0)
})

const title = commonStore?.titleDescription?.name || ''
// useHead({
//   title: [`${currentCategory.value?.name } - ${product?.value?.name}`],
// })
const currentVariable = computed(() => {
  if (currentVariableId.value && product.value.product_variations_data.length) {
    return product.value.product_variations_data.find(item => item.id === currentVariableId.value)
  }

  return null
})

const productType = computed(() => {
  return product.value.type
})

const productDescription = computed(() => {
  if (currentVariable.value) {
    return currentVariable.value.description
  }

  return product.value.description
})

const productImage = computed(() => {
  let image = product.value?.images[0] || ''
  if (currentVariable.value) {
    image = currentVariable.value.image
  }

  return imageSize(image, 'large')
})

const productPrice = computed(() => {
  let add_to_basket_once = product.value.add_to_basket_once || 1;
  let price = + parseInt((+add_to_basket_once * +product.value.price) * 100) / 100
  if (currentVariable.value) {
    price = +currentVariable.value.price
  }

  return +supplementsPrice.value + price
})

const productRegularPrice = computed(() => {
  let add_to_basket_once = product.value.add_to_basket_once || 1;
  let regular_price = + parseInt((+add_to_basket_once * +product.value.regular_price) * 100) / 100

  if (currentVariable.value) {
    regular_price = +currentVariable.value.regular_price
  }

  return +supplementsPrice.value + regular_price
})

const discount = computed(() => {
  if (+productPrice.value !== +productRegularPrice.value) {
    return parseInt(Math.round( (100 - (productPrice.value / productRegularPrice.value * 100)) ) * 100) / 100
  }

  return 0
})

const elseArray = computed(() => {
  return relatedItems.value(product.value.cross_sell_ids)
})

const isCountable = computed(() => {
  return product.value?.countable || false
})

// Вес продукта
const productWeight = computed(() => {
  return product.value?.weight || 0
})

const productVolume = computed(() => {
  return product.value?.volume || 0;
})

// Кол-во
const productQuantity = computed(() => {
  return product.value?.stock_quantity || 0
})

const productBasePortionSize = computed(() => {
  return product.value?.base_portion_size || 1
})
//Учитывать ли остатки
const isManageStock = computed(() => {
  return !!product.value.manage_stock === true;
})
// В наличии
const inStock = computed(() => {
  return productQuantity.value / productBasePortionSize.value
})

const productMeasureUnit = computed(() => {
  return product.value?.measure_unit || ''
})

const productSubMeasureUnit = computed(() => {
  return product.value?.sub_measure_unit || ''
})

const productAcf = computed(() => {
  return product.value?.acf || {}
})

const badges = computed(() => {
  return productAcf.value['product-badge'] || []
})

const productAttributes = computed(() => {
  let attributes = product.value?.attributes || []

  let decodedAttributes = '';

  try {
    decodedAttributes = attributes.map(attribute => {
      let decodedOptions = attribute.options.map(option => {
        return decodeURIComponent(option);
      });
  
      return { ...attribute, options: decodedOptions };
    });

  } catch (e) {
    console.log(e);
  }

  return decodedAttributes;
});

// Добавки к блюду
const productSupplements = computed(() => {
  let temp = productAcf.value['supplements'] || []

  return temp.filter(item => item.products?.length > 0)
})

const supplementsArray = computed(() => {
  const obj = selectedSupplements.value
  const supplements = []
  for (const key in obj) {
    obj[key].forEach(item => {
      supplements.push(item)
    })
  }

  return supplements
})

const currentProductInCart = computed(() => {
  return productInCart.value(+product.value.id, supplementsArray.value, currentVariableId.value)
})

const isButtonDisabled = computed(() => {
  if (productSupplements.value.length) {
    const isset = productSupplements.value.find((item, i) => {
      if (item.supplement_required === 'yes' && !selectedSupplements.value[i]?.length) {
        return true
      }
      return false
    })

    return !!isset
  }

  return false
})

const currentBrand = computed(() => {
  const slug = route?.params?.slug;

  let pickup = commonStore.allSettings?.shipping_methods?.find(item => item.id === 'local_pickup')?.pickup_locations;

  let current = pickup?.find(item => item.name === slug);

  return current
})

const menu = computed(() => {
  if (currentBrand.value) {
    let temp = catalogStore.filteredCatalog.map(item => {
      const products = item.products.filter(product => {
        return product.locations.find(location => location.id === currentBrand.value.warehouse_id)
      })
  
      return {
        ...item,
        products
      }
    }).filter(item => item.products?.length && item.id !== 16 && item.id !== 140)
  
  
    return temp.map(item => !item.parent
      ?
      {
        ...item, subCategories: temp
          .filter(cat => +cat.parent === +item.id)
      }
      :
      item
    ).filter(item => !+item.parent && item?.id !== 383 && item?.id !== 117)
  }
})

// <!-- Methods -->
const getProductsForModal = () => {
  let products = undefined;

  // if (currentSubCategory.value) {
  //   if (currentSubSub.value) {
  //     let subIds = currentSubCategory.value.subCategories.map(item => item.id)
  //     let currentSubSubId = subIds.find(id => parentProduct.value.categories.includes(id))

  //     let currentSubSub = currentSubCategory.value.subCategories.find(item => +item.id === +currentSubSubId)

  //     headerTitle.value = currentSubSub.name;

  //     products = currentSubSub.products;
  //   }
  //   else {
  //     headerTitle.value = currentSubCategory.value.name;
  //     products = currentSubCategory.value.products;
  //   }
  // }
  // else {
  //   headerTitle.value = currentCategory?.value?.name;
  //   products = currentCategory?.value?.products;
  // }

  if (products == undefined) {
    let urlCurrentCat = getSecondToLastParam(catalogStore.selectedProductUrl);
  
    let current = catalogStore.filteredCatalog.find(item => item.slug === urlCurrentCat);

    headerTitle.value = current.name;

    products = current.products;
  }

  productsForSlider.value = products;

  return products;
}

function getSecondToLastParam(url) {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

const toggleSupplementsCatalog = (index) => {
  if (toggledSupplements.value.includes(index)) {

    let idx = toggledSupplements.value.findIndex(item => +item === +index);

    toggledSupplements.value.splice(idx, 1);
  }
  else {
    toggledSupplements.value.push(index);
  }
}

const toggleFavorite = () => {
  const productId = +product.value.id

  if (isProductFavorite.value(productId)) {
    catalogStore.removeFromFavorite(productId)
  } else {
    catalogStore.addToFavorite(productId)
  }
}

const disalbeState = ref(isButtonDisabled || (isAnySupplementsRequired && !isSingleSupplementSelected))

const handlePointerDown = (isMaxReached = false) => {
  nextTick(() => {
    if (disalbeState.value) {
      notificationMessage.value = 'Добавьте ингредиенты';
      notificationVisible.value = false;
      setTimeout(() => {
        notificationVisible.value = true; 
      }, 0); 
    }
  })
}

const maximumReached = (isMaxReached = false) => {
  if (isMaxReached) {
    notificationMessage.value = 'В наличии больше нет';
    notificationVisible.value = false;
    setTimeout(() => {
      notificationVisible.value = true; 
    }, 0); 
  }
}

const roundNumber = (number) => {
  let rounded = (+number).toFixed(1);

  if (rounded.endsWith('.0')) {
    rounded = rounded.slice(0, -2);
  }

  return rounded;
}

const addToCart = () => {
  if (isButtonDisabled.value && (!isSingleSupplementSelected.value && isAnySupplementsRequired)) {
    return false
  }

  const obj = {
    ...product.value,
    supplements: supplementsArray.value
  }

  if (currentVariable.value) {
    obj.variation_id = currentVariableId.value
    let product_variations_data = obj?.product_variations_data.find(item => item.id === obj.variation_id) || null
    obj.variations_data = product_variations_data;
    obj.variations_data = product_variations_data;
    obj.price = product_variations_data?.price || obj.price;
    obj.regular_price = product_variations_data?.regular_price || obj.regular_price;
  }

  console.log(obj);

  if (props.isOpenedFromCart) {
    let index = cart.cart.findIndex(item => +item.id === +props.item.id);

    cart.removeFromCart(index);
  }

  cart.addToCart(obj)
}

const increment = () => {
  cart.incrementItem(currentProductInCart.value.idx)
}

const decrement = () => {
  cart.decrementItem(currentProductInCart.value.idx)
}

const selectProduct = (obj) => {
  const data = {
    id: +obj.id,
    count: 1,
    price: +obj.price,
    name: obj.name,
    image: obj?.images ? obj?.images[0] : null,
  }

  if (productSupplements.value[0].type === 'radio') {
    supplement.value = []

    supplement.value.push(data)
  } else {
    const isset = supplement.value.find((item, i) => {
      if (+item.id === +obj.id) {
        supplement.value.splice(i, 1)
        return true
      }
      return false
    })

    if (!isset) {
      supplement.value.push(data)
    }
  }
  
  currentSupplementKey.value = data.id;

  selectedSupplements.value = [supplement.value];
}

watchEffect(() => {
  isSingleSupplementSelected.value = supplement.value.length > 0;

  if (elseProductOpened.value) {
    let modalBox = document.querySelector('.modal__box');
    modalBox?.scrollTo({ top: 0, behavior: 'smooth' });
  }
})

watch(() => selectedProduct.value(), () => {
  if (parentProduct.value.type == 'group_variable') {
    let varIds = variations.value.map(item => item.product)

    if (varIds.includes(selectedProduct.value().id)) {
      product.value = selectedProduct.value();
      emits('variableChanged');
    }
  }

})

watch(() => route.query, () => {
  let products = getProductsForModal();

  productsForSlider.value = products;

  currentIdForSlide.value = +route.query.product_id;

  if (productType.value === 'variable') {
    currentVariableIdx.value = new Array(product.value.attributes.length).fill(0)
  } else if (productType.value === 'group_variable' ) {
    const variationsArray = product.value.variations

    if (variationsArray.length) {
      variations.value = variationsArray

      let activeId = variationsArray.find(item => item.default)?.product || null
      if (!activeId) {
        activeId = variationsArray[0].product
      }

      catalogStore.setVariation(activeId)
    }
  }
  else {
    variations.value = [];
  }
})

const incrementSingleSupplement = (id) => {
  supplement.value.find(item => {
    if (+item.id === +id) {
      item.count++
      return true
    }

    return false
  })
}

const decrementSingleSupplement = (id) => {
  supplement.value.find((item, i) => {
    if (+item.id === +id) {
      if (item.count > 1) {
        item.count--
      } else {
        supplement.value.splice(i, 1)
        isSingleSupplementSelected.value = false;
      }
      return true
    }

    return false
  })
}

// Открыть модалку для выбора добавок
const openSupplementsModal = (item, key) => {
  currentSupplement.value = item
  currentSupplementKey.value = key
  isShowSupplementsModal.value = true
}

// Закрыть модалку для выбора добавок
const closeSupplementsModal = () => {
  isShowSupplementsModal.value = false
  currentSupplement.value = null
  currentSupplementKey.value = null
}

// Подтвердить выбор добавок и закрыть модалку выбора
const selectSupplemets = (data) => {
  selectedSupplements.value[currentSupplementKey.value] = data

  closeSupplementsModal()
}

const setVariation = (id) => {
  catalogStore.setProduct(id)
}

const setCurrentVariableIdx = (value, position) => {
  currentVariableIdx.value[position] = value

  const id = currentVariableIdx.value.join('')
  currentVariableId.value = variationIds.value[id]

  emits('variableChanged');
}

const emits = defineEmits(['close', 'variableChanged'])

const closeModal = () => {
  router.push({ query: {} });
  catalogStore.setProduct(null);
  isShow.value = false

  if (elseProductOpened.value) {
    catalogStore.elseProductOpened = false;
  }

  catalogStore.isOpenedFromCart = false;
  catalogStore.cartProductSelectedSupplements = null;

  emits('close')
}

const close = () => {
  catalogStore.setProduct(null)
  document.body.classList.remove('overflow-hidden')
  router.push({ query: {} });
}

const setVariationIds = () => {
  const attributes = productAttributes.value
  const attributesLength = attributes.length

  if (attributesLength) {
    const obj = {}
    const variations = product.value.variations || []

    const firstArray = attributes[0].options

    if (attributesLength === 1) {
      firstArray.forEach((_, i) => {
        obj[i] = variations[i]
      })
    } else if (attributesLength === 2) {
      const secondArray = attributes[1].options

      const newArray = firstArray.flatMap((_, i) => secondArray.map((_, i2) => i + '' + i2))

      newArray.forEach((item, i) => {
        obj[item] = variations[i]
      })
    }

    variationIds.value = obj
  }
}

onMounted(() => {
  parentProduct.value = props.item;
  currentSubSubCatId.value = +route.params.subcat

  if (props.isNoSlider) {
    useHead({
      title: product.value.seo_data.seo_title,
    })
  }

  if (props.isOpenedFromCart && props.cartProductSelectedSupplements?.length > 0) {
    if (productSupplements.value.length === 1) {
      supplement.value = []

      for (let i = 0; i < props.cartProductSelectedSupplements.length; i++) {
        supplement.value.push(props.cartProductSelectedSupplements[i])

        selectedSupplements.value = [supplement.value]
      }
    }
    else {
      for (let i = 0; i < props.cartProductSelectedSupplements.length; i++) {
        selectedSupplements.value[i] = [props.cartProductSelectedSupplements[i]]
      }
    }
  }

  if (productType.value === 'variable') {
    currentVariableIdx.value = new Array(product.value.attributes.length).fill(0)

    const id = currentVariableIdx.value.join('')
    currentVariableId.value = variationIds.value[id]

  } else if (productType.value === 'group_variable' ) {
    const variationsArray = product.value.variations

    if (variationsArray.length) {
      variations.value = variationsArray

      let activeId = variationsArray.find(item => item.default)?.product || null
      if (!activeId) {
        activeId = variationsArray[0].product
      }

      setVariation(activeId)
    }
  }

  nextTick(() => {
    if (elseProductOpened.value) {
      let modalBox = document.querySelector('.modal__box');

      modalBox?.scrollTo({top: 0, behavior: 'smooth'});
    }

    let products = getProductsForModal();

    productsForSlider.value = products;

    currentIdForSlide.value = +route.query.product_id;

    swipeElement.value = document.querySelector('.modal-product');

    const description = document.querySelector('#modal-product__description-text');
    const descriptionBlock = document.querySelector('.modal-product__description');


    let currentSlide = document.querySelector(`#product-modal__slide-${props.item.id}`);
    let currentProduct = document.querySelector(`#modal-product-${props.item.id}`);

    let isIosChrome = (platform() === 'iOS' || platform() === 'Mac') ? 30 : 0;
    
    if (currentSlide && isMobileOrTablet.value) {
      // currentSlide.style.height = `${currentProduct.offsetHeight + 20 + isIosChrome}px`;
    }

    if (isMobileOrTablet.value) {
      modalBox.value = document.querySelector('.modal__box');
  
      teleportTo.value = '.modal__box';
    }


    if (description.offsetHeight < 280) {
      descriptionBlock.style.height = `${description.offsetHeight}px`;
      isHeightBigger.value = false;
    }
    else {
      isHeightBigger.value = true;
    }
  })
})

setVariationIds()
</script>

<style lang="scss" scoped>
.modal-product {
  position: relative;

  width: 100vw;
  max-width: 1070px;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  z-index: 900;

  padding: 0 10px;

  background: var(--grayBg);

  margin-top: 15px;
  
  @include mq($bp-small) {
    margin-top: 0;
    
    min-height: auto;

    padding: 0;
    
    background: var(--grayBg);
    border-radius: 40px;
  }

  &__close {
    display: none;

    position: absolute;
    top: 30px;
    right: 40px;

    padding: 10px;

    z-index: 10;

    @include mq($bp-small) {
      display: block;
    }

    ::v-deep(.ui-icon) svg {
      width: 24px;
      height: 24px;

      path {
        fill: var(--grayText);
      }
    }
  }

  &__main {
    display: grid;
    grid-gap: 30px;

    // padding: 20px;

    background: var(--white);
    border-radius: 40px 40px 0 0;

    @include mq($bp-small) {
      grid-template-columns: 440px 1fr;
      grid-gap: 38px;

      padding: 30px;

      border-radius: 40px;
    }

    @include maq($bp-medium) {
      grid-template-columns: 300px 1fr;
    }

    @include maq($bp-small) {
      grid-template-columns: none;
      height: max-content;
    }
  }

  &__image {
    position: relative;

    width: 100%;
    // height: 460px;

    border-radius: 40px;
    overflow: hidden;

    @include mq($bp-small) {
      height: 440px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__discount {
    position: absolute;
    top: 20px;
    left: 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 86px;
    height: 39px;

    @include text_big;
    font-weight: 600;

    // background: var(--white);
    background: var(--grayBg);
    border-radius: 20px;
  }

  &__favorite {
    position: absolute;
    top: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 80px;
    height: 80px;

    padding: 20px;

    ::v-deep(.ui-icon) svg {
      width: 40px;
      height: 40px;
      stroke: var(--orange);
    }

    &--active {
      ::v-deep(.ui-icon) svg path {
        fill: var(--orange);
      } 
    }
  }

  &__characteristics {
    position: absolute;
    bottom: 20px;
    left: 20px;

    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  &__characteristic {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 40px;
    height: 40px;
    
    margin-left: -13px;

    background: var(--white);
    border-radius: 50%;
    box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.05);

    &:last-child {
      margin-left: 0;
    }

    .ui-icon {
      width: 24px;
      height: 24px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    
    grid-gap: 20px;

    padding: 0 20px 40px;

    height: max-content;

    @include mq($bp-small) {
      height: 100%;
      padding: 0;
    }
  }

  &__header {
    max-width: 450px;

    display: flex;
    flex-direction: column;

    grid-gap: 10px;
  }

  &__title {
    @include h2;
    font-style: normal;

    @include maq($bp-small-medium) {
      font-size: 23px;
      line-height: 26px;
    }
  }

  &__description {
    @include text_normal;
    font-weight: 600;
    color: #454545;
    
    position: relative;
    z-index: 1;


    overflow: hidden;
    transition: height 0.2s ease-out;

    &.show {
      height: 100%;
      padding-bottom: 20px;
    }

    &.hide {
      padding-bottom: 20px;
    }
      

    &-text {
      max-height: 280px;
      overflow: hidden;
      transition: max-height 0.2s ease-out;

      &.show {
        max-height: 100%;
      }

      ::v-deep h3 {
        margin-top: 15px;
        margin-bottom: 15px;
      }
      ::v-deep p {
        font-weight: 400;
      }
      ::v-deep ul {
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
  
    &-more {
      position: relative;
      width: 100%;
      bottom: -15px;
      font-size: 16px;
      font-weight: 400;
      color: #414040c4;
      z-index: 5000;

      &.hide {
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: -30px;

          width: 100%;
          height: 20px; 

          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.718) 54.17%, rgba(255, 255, 255, 1) 100%);
          z-index: 1; 
        }
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;

    position: absolute;
    left: 0;
    right: 0;

    padding: 20px;

    background: var(--white);
    // border-radius: 40px 40px 0 0;
    border-top: 1px solid var(--grayBg);
    box-shadow: 0px -2px 80px 0px rgba(0, 0, 0, 0.20);

    z-index: 100;

    @include mq($bp-small) {
      position: relative;

      margin: auto 0 0;
      padding: 20px 0 0 0;

      background: none;
      box-shadow: none;
    }

    @include maq($bp-small) {
      &.teleported {
        position: fixed;
        bottom: 0;
        width: 100vw;
        z-index: 1000;
      }
    }
  }

  &__footer-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

  &__buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__button {
    max-width: 240px;

    z-index: 1000;

    @include maq($bp-super-small){
     max-width: 160px;
    }
  }

  &__overlay {
    padding-top: 90px;

    background: var(--white);

    @include mq($bp-small) {
      display: none;
    }
  }
}

.modal-product-attributes {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  grid-gap: 10px;

  &--char {
    grid-gap: 0 !important;
  }

  &__line {
    width: 100%;

    display: flex;
    align-items: center;
    grid-gap: 2px;
    flex-wrap: wrap;

    padding: 3px;

    border-radius: 117px;
    background: var(--grayBg);

    &--char {
      justify-content: space-between !important;
      width: calc(100% - 25px) !important;
      gap: 30px;

      background: transparent;

      border-radius: 0;

      font-size: 15px;

      &.gray {
        background: #f8f8f8;
      }

      & h4 {
        font-weight: 600;
        text-transform: uppercase;
      }
    }

    @include mq($bp-small) {
      width: auto;
    }

    @include maq($bp-small) {
      justify-content: space-around;
    }
  }

  &__button {
    flex: 0 0 33%;

    padding: 8px 25px;

    @include text_normal;
    font-weight: 600;

    background: var(--grayBg);
    color: var(--black);
    border-radius: 40px;
    border: 0;
    font-weight: 600;

    transition: background-color 0.3s;

    @include mq($bp-small) {
      flex: 0 0 auto;
    }

    @include maq($bp-small) {
      flex: unset;
      flex-grow: 1;
      padding: 10px 10px;

    }

    &.active {
      background: var(--white);
      color: var(--black);
    }
  }
}

.modal-product-weight {
  display: flex;
  align-items: center;

  
  span {
    display: flex;
    align-items: center;
    
    @include text_mini;
    color: var(--grayText);
    
    &:after {
      content: '';
      width: 3px;
      height: 3px;
      
      margin: 0 10px;
      
      background: var(--grayText);
      border-radius: 50%;
      opacity: 0.3;
    }
    
    &:last-child {
      &:after {
        display: none;
      }
    }
  }

  &.uncountable {
    span {
      font-size: 14px;
    }
  }
}

.modal-product-add {
  display: flex;
  flex-direction: column;
  grid-gap: 10px;

  &__title {
    @include text_large;
    font-weight: 700;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px 10px;

    @include mq($bp-small) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.modal-product-add-item {
  position: relative;

  display: flex;
  flex-direction: column;

  background: var(--white);
  border-radius: 20px;
  outline: 1px solid var(--grayBg);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

  overflow: hidden;

  cursor: pointer;

  &.active {
    outline-width: 2px;
    outline-color: var(--yellowDark);
  }

  &__selected {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 6px 15px;

    @include text_mini;
    font-weight: 600;
    color: var(--orange);

    background: var(--yellowLightSecondary);

    width: 100%;

    @include maq(400px) {
      font-size: 11px;
    }

    span {
      display: flex;
      align-items: center;

      &:after {
        content: '';
        display: block;
        width: 3px;
        height: 3px;

        margin: 0 6px;

        @include maq(400px) {
          margin: 0 4px;
        }

        background: var(--grayText);
        border-radius: 50%;
        opacity: 0.3;
      }

      &:last-child {
        &:after {
          display: none;
        }
      }
    }
  }

  &__required {
    position: absolute;
    top: 0;
    left: 0;

    padding: 6px 15px;

    @include text_mini;
    font-weight: 600;
    color: var(--orange);

    background: var(--orangeLight);
    border-radius: 0 0 20px 0;
  }

  &__image {
    width: 100%;
    height: 120px;

    border: 1px solid var(--grayBg);
    border-radius: 20px;

    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 50px;

    padding: 8px;

    // @include overflow-multi-text(2);
    @include text_small;
    font-weight: 600;
    text-align: center;

    overflow: hidden;

    &-one-supplement {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;

      &__title {
        font-weight: 600;
        font-size: 18px;
      }

      &__required {
        padding: 6px 15px;
        max-width: 100px;
        width: 100%;

        border-radius: 15px;

        @include text_mini;
        text-align: center;
        font-weight: 600;
        color: var(--orange);

        background: var(--orangeLight);
      }
    }
  }
}

.modal-product-structure {
  display: flex;
  flex-direction: column;
  grid-gap: 20px;

  &__title {
    @include text_big;
    font-weight: 600;
    color: var(--grayText);
  }

  &__cols {
    display: flex;
    align-items: flex-start;
  }

  &__col {
    flex: 0 0 25%;

    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    grid-gap: 5px;

    padding: 0;

    @include mq($bp-small) {
      padding: 0 26px;
    }

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
      
      &:after {
        display: none;
      }
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;

      width: 1px;
      height: 41px;

      margin: auto;

      background: var(--grayText)2;
    }
  }

  &__value {
    @include text_large;
    font-weight: 700;
    white-space: nowrap;
  }

  &__label {
    @include text_small;
    font-weight: 500;
    color: var(--grayText);
  }
}

.supplements-catalog {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    display: flex;
    gap: 10px;
    max-width: 300px;
    width: 100%;

    font-weight: 500;
    font-size: 17px;
  }

  &__arrow {
    
    &.opened {
      transform: rotate(90deg);
    }

    &:hover {
      cursor: pointer;
    }
    
    :deep svg path {
      fill: var(--grayText);
    }
  }

  &__content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease;

    &.opened {
      max-height: 500px;
    }
  }

}

.solo-add {
  & > div {
    box-shadow: none;
    margin-bottom: 20px;
  }
}

.price-block {
  display: flex;
  flex-direction: row-reverse !important;
  align-items: center !important;
  gap: 20px;
}
</style>