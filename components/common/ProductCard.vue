<template>
  <div
    :class="['index-menu-card', { 'index-menu-card--promo' : isPromo }]"
    @click.prevent="openProduct()"
  >
    <div class="index-menu-card__image" :class="[{'lovesushi': isLoveSushi}]">
      <div v-if="!isImageLoaded" class="loader" :class="{'min-height': !isImageLoaded}, {'lovesushi': isLoveSushi}"></div>

      <img
        :class="[{'min-height': !isImageLoaded}, {'lovesushi': isLoveSushi}]"
        :src="productImage"
        :data-src="productImage"
        :alt="item.name"
        :key="item.id"
        v-lazy-load
        loading="lazy"
        @load="isImageLoaded = true"
      >

      <span
        v-if="discount"
        class="index-menu-card__discount"
      >
        -{{ discount }}%
      </span>
      
      <button
        :class="['index-menu-card__favorite', { 'active' : isProductFavorite(+item.id) }]"
        @click.stop.prevent="toggleFavorite()"
      >
        <UIIcon name="heart" />
      </button>

      <div class="index-menu-card__types">
        <div v-if="badges.includes('halal')" class="index-menu-card-type">
          <UIIcon name="icon-halal" />
        </div>
        <div v-if="badges.includes('preorder')" class="index-menu-card-type">
          <UIIcon name="icon-hit" />
        </div>
        <div v-if="badges.includes('vegan')" class="index-menu-card-type">
          <UIIcon name="icon-vegan" />
        </div>
        <div v-if="badges.includes('spicy')" class="index-menu-card-type">
          <UIIcon name="icon-hot" />
        </div>
      </div>
    </div>

    <div class="index-menu-card__content">
      <p class="index-menu-card__name">
        {{ item.name }}
      </p>
      <div v-if="props.item.short_description" class="short-desc">
        <div v-html="props.item.short_description"></div>
      </div>

      <div
          class="index-menu-card__description"
          v-if="facade.show_stock_value && (productWeight || productVolume)"
      >
        <p
            v-if="!isManageStock"
            class="index-menu-card__info index-menu-card__info--gray">
          <span>
            В наличии
          </span>
        </p>
        <p
            v-else
            class="index-menu-card__info index-menu-card__info--gray">
          <span>
            В наличии
          </span>
          <span
            v-if="inStock"
          >
            {{ inStock }} {{ productMeasureUnit }}
          </span>
        </p>
      </div>

      <div class="index-menu-card__description index-menu-card__description_price"
      :class="{'no-weight': !(productWeight || productVolume || facade.show_stock_value || !isCountable)}"
      >
        <p
          v-if="isCountable && productWeight"
          class="index-menu-card__info"
        >
          <!-- <span v-if="isAppStyle">
            Вес
          </span> -->
          <span>
            {{ productWeight }} гр
          </span>
        </p>
        <p
          v-else-if="isCountable && productVolume"
          class="index-menu-card__info"
        >
          <!-- <span v-if="isAppStyle">
            Объём
          </span> -->
          <span>
            {{ productVolume }} мл
          </span>
        </p>
        <p
          v-else-if="!isCountable"
          class="index-menu-card__info"
        >
          <!-- <span v-if="isAppStyle">
            Вес
          </span> -->
          <span>
            {{ props.item.base_portion_size }} {{ props.item.sub_measure_unit }}
          </span>
        </p>
        <p
          v-else-if="facade.show_stock_value"
          class="index-menu-card__info"
        >
          <p
              v-if="!isManageStock"
              class="index-menu-card__info index-menu-card__info--gray">
            <span class="text">
              В наличии
            </span>
          </p>
          <p
              v-else
              class="index-menu-card__info index-menu-card__info--gray">
            <span class="text">
              В наличии
            </span>
            <span
              v-if="inStock"
            >
              {{ inStock }} {{ productMeasureUnit }}
            </span>
          </p>
        </p>

        <CommonPriceBlock v-if="catalog.isFullCatalogGot || facade.catalog_front !== 'cat2'"
          :regular-price="+getRegularPrice"
          :price="+getPrice"
          class="index-menu-card__price"
          :class="{'hidden': !(!isAppStyle || currentProductInCart.item)}"
          :product="item"
        />
      </div>

      <CommonAddButton
        :item="currentProductInCart.item"
        :currentItem="item"
        :product-type="productType"
        @increment="increment()"
        @decrement="decrement()"
        @add="addToCart()"
        @click="openProduct()"
        class="index-menu-card__button"
      />
    </div>
  </div>
</template>

<script setup>
const catalog = useCatalogStore()
const cart = useCartStore()
const userStore = useUserStore()
const commonStore = useCommonStore()
const config = useRuntimeConfig();

const router = useRouter()
const route = useRoute();

const { productInCart } = storeToRefs(cart)
const { isProductFavorite, baseUrl } = storeToRefs(catalog)
const facade = computed(() => commonStore.getFacade);
const isImageLoaded = ref(false);

const isAppStyle = computed(() => commonStore?.allSettings?.cart_button_as_app || false);

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  isPromo: {
    type: Boolean,
    default: false,
  },
  isHit: {
    type: Boolean,
    default: false,
  }
})


// <!-- Computed -->
const selectedProduct = computed(() => catalog.selectedProduct);
const isShowProductModal = computed(() => catalog.isShowProductModal);

const isLoveSushi = computed(() => (config.public.BASE_URL === 'https://люблюсуши.рф' || config.public.BASE_URL === 'https://xn--90aohb4am9a5bc.xn--p1ai'))

const productImage = computed(() => {
  const image = props.item?.images[0] || ''
  return imageSize(image, 'medium')
})

// console.log(catalog.getProductById(props.item?.id));
const discount = computed(() => {
  if (props.item?.regular_price && props.item?.price && +props.item.regular_price !== +props.item.price) {
    return parseInt(Math.round(100 - (props.item.price / props.item.regular_price * 100) ) * 100) / 100
  }
  
  if (productType.value === 'variable') {
    return parseInt(Math.round(100 - (+props.item.product_variations_data[0].price / +props.item.product_variations_data[0].regular_price * 100) ) * 100) / 100
  }

  return 0
})

//Цена
const getPrice = computed(() => {
  if (props.item) {
    if (productType.value === 'variable') {
      let price_multiplier_for_customer = props.item.price_multiplier_for_customer || 1;
      const value = parseInt((( +price_multiplier_for_customer) * +props.item.product_variations_data[0].price) * 100) / 100
      return `${value}`
    }
    let price_multiplier_for_customer = props.item.price_multiplier_for_customer || 1;
    const value = parseInt((( +price_multiplier_for_customer) * +props.item.price) * 100) / 100
    return `${value}`
  }

  return null
})

const getRegularPrice = computed(() => {
  if (props.item) {
    if (productType.value === 'variable') {
      let price_multiplier_for_customer = props.item.price_multiplier_for_customer || 1;
      const value = parseInt((( +price_multiplier_for_customer) * +props.item.product_variations_data[0].regular_price) * 100) / 100
      return `${value}`
    }

    let price_multiplier_for_customer = props.item.price_multiplier_for_customer || 1;
    const value = parseInt((( +price_multiplier_for_customer) * +props.item.regular_price) * 100) / 100
    return `${value}`
  }

  return null
})

// Тип продукта
const productType = computed(() => {
  return props.item?.type
})

const productWeight = computed(() => {
  return props.item?.weight || 0;
})

const productVolume = computed(() => {
  return props.item?.volume || 0;
})

const currentProductInCart = computed(() => {
  if (productType.value === 'simple') {
    return productInCart.value(+props.item.id)
  }

  else if (productType.value === 'supplements') {
    let temp = false

    if (props.item.acf.supplements) {
      temp = props.item.acf.supplements.some(supplement => {
        return supplement.products && supplement.products.length > 0;
      })
    }

    if (!temp) return productInCart.value(+props.item.id);
  }

  return {
    idx: null,
    item: null,
  }
})

const isCountable = computed(() => {
  return props.item?.countable || false
})
//Учитывать ли остатки
const isManageStock = computed(() => {
  return props.item?.manage_stock == true
})
// Кол-во
const productQuantity = computed(() => {
  return props.item?.stock_quantity || 0
})

const productBasePortionSize = computed(() => {
  return props.item?.base_portion_size || 1
})

// В наличии
const inStock = computed(() => {
  return productQuantity.value / productBasePortionSize.value
})

const productMeasureUnit = computed(() => {
  return props.item?.measure_unit || ''
})

const productSubMeasureUnit = computed(() => {
  return props.item?.sub_measure_unit || ''
})

const badges = computed(() => {
  return props.item?.acf['product-badge'] || []
})

const productUrl = computed(() => {
  // const filteredCategoryIds = props.item.categories.filter(id => id !== 16 && id !== 140);
  //
  // const matchingCategories = catalog.categories.filter(catalogCategory =>
  //   filteredCategoryIds.includes(catalogCategory.id)
  // );
  //
  // let newUrl = `/menu/${matchingCategories[0].slug}/${props.item.slug}`;
  //
  //
  // if (route.params.categorySlug) {
  //   newUrl = `/menu/${route.params.categorySlug}/${props.item.slug}`;
  // }
  //
  // nextTick(() => {
  //   if ((window?.location?.pathname)?.includes('menu')) {
  //     newUrl = `${route.params.categorySlug}/${props.item.slug}`;
  //   }
  // })

  //берём урл товара из поля url
  let newUrl = `/catalog/menu` + props.item?.url || '';

  nextTick(() => {
    if ((window?.location?.pathname)?.includes('menu')) {
      newUrl = `${route.params.categorySlug}/${props.item?.slug}`;
    }
  })

  return newUrl;
})

// <!-- Methods -->


const toggleFavorite = () => {
  const productId = +props.item.id

  if (isProductFavorite.value(productId)) {
    catalog.removeFromFavorite(productId)
  } else {
    catalog.addToFavorite(productId)
  }
}

const openProduct = () => {
  const productId = +props.item.id
  console.log(props.item.id);
  catalog.setProduct(productId);
  baseUrl.value = window.location.pathname;
  window.history.replaceState(null, '', productUrl.value);
  catalog.selectedProductUrl = productUrl.value;
}

const addToCart = () => {
  cart.addToCart(props.item)
}

const increment = () => {
  cart.incrementItem(currentProductInCart.value.idx)
}

const decrement = () => {
  cart.decrementItem(currentProductInCart.value.idx)
}
</script>

<style lang="scss" scoped>
.lovesushi {
  min-height: 230px !important;
  height: 230px !important;
  aspect-ratio: auto !important;
}
.count-dot {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 15px;
  color: #141414;
  opacity: 30%;

  @include maq($bp-super-small) {
    margin-left: 5px;
    margin-right: 5px;
    width: 3px !important;
    overflow: visible !important;
  }
}
.min-height {
  min-height: 272px;

  @include maq($bp-small) {
    min-height: auto;
  }
}
.loader {
  position: absolute;
  width: 100%;
  height: 330px;
  background: linear-gradient(90deg, #f9f9f9, #e1e0e0, #f9f9f9);
  background-size: 200% 200%;
  animation: grey-shimmer 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

@keyframes grey-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.index-menu-card {
  display: flex;
  flex-direction: column;

  justify-content: space-between;

  // background: var(--mainBg);
  border-radius: 20px;

  max-width: 324px;
  max-height: 507px;
  height: 100%;
  
  // @include maq($bp-super-small){
  //   min-width: 150px;
  // }
  &--promo {
    background: var(--yellowLightSecondary);
    color: var(--blackText);

    .index-menu-card {
      &__image {
        border-color: var(--yellow);
      }

      &__discount {
        background: var(--orange);
      }

      &__button {
        color: var(--white);
      }
    }
  }


  &__image {
    position: relative;
    width: 100%;
    height: 212px;
    min-height: auto;

    aspect-ratio: 1 / 1;

    border-radius: 20px;
    border: 1px solid var(--grayBg);
    overflow: hidden;

    cursor: pointer;

    &.ilovesushi {
      aspect-ratio: auto !important;
    }

    @include mq($bp-small) {
      height: auto;
    }

    @include maq($bp-small) {
      height: unset;
      min-height: 120px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;

    }
  }

  &__discount {
    position: absolute;
    top: 16px;
    left: 16px;

    padding: 4px 12px;

    @include text_mini;
    font-weight: 600;

    background: var(--grayBg);
    border-radius: 16px;
  }

  &__favorite {
    position: absolute;
    top: 0;
    right: 0;

    padding: 16px;

    ::v-deep(.ui-icon) svg path {
      stroke: var(--orange);
    }

    &.active {
      ::v-deep(.ui-icon) svg path {
        fill: var(--orange) !important;
      }
    }
  }

  &__price {

    &.hidden {
      visibility: hidden;
    }
  }

  &__types {
    position: absolute;
    left: 16px;
    bottom: 16px;

    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  &__content {
    flex-grow: 1;
    display: grid;
    padding: 16px 10px 10px;

    padding-bottom: 58px;

    position: relative;

    height: min-content;
  }

  &__button {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    width: unset !important;
  }

  &__name {
    margin-bottom: 16px;

    @include overflow-text;
    @include text_big;
    @include maq($bp-small) {
      @include text_small;
      font-weight: 500;
    }
    font-weight: 600;

    line-height: 1;

    max-height: 30px;
    cursor: pointer;
  }

  &__description {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 8px;

    &.no-weight {
      justify-content: end;
    }
  }

  &__info {
    // display: none;

    // @include mq($bp-small) {
      display: flex;
      align-items: center;

      @include text_mini;

      span {
        display: flex;
        align-items: center;

        @include maq($bp-super-small) {
          display: inline-block;
          width: 70px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        @include maq(420px) {
          width: 40px;
        }

        &:after {
          content: url('@/assets/svg/dot-middle.svg');
          display: flex;
          align-items: center;
          margin: 0 10px;
        }

        &:last-child {
          &:after {
            display: none;
          }
        }
      }
    // }

    &--gray {
      color: var(--grayText);

      & span.text {
        @include maq($bp-small) {
          display: none;
        }
      }
    }
  }

  &__counter {
    height: 48px;
  }
}

.index-menu-card-type {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  margin-left: -7px;

  background: var(--white);
  border-radius: 50%;
  box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-left: 0;
  }

  .ui-icon {
    width: 20px;
    height: 20px;
  }
}

.short-desc {
  white-space: wrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  font-size: 13px;
  margin-bottom: 8px;

  height: 36px;

  @include maq($bp-small) {
    font-size: 12px;
  }
}
</style>