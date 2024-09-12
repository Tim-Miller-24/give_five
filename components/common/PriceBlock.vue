<template>
  <div :class="[
    'price-block',
    {
      'price-block--reverse': isReverse,
      'price-block--big': isBig,
    },
  ]">

    <template v-if="isProductWithSupplements && editedPrice > 0 && +startPrice === +props.price">
      от {{ (+editedPrice + +startPrice)?.toLocaleString() }} ₽
    </template>

    <template v-else-if="isProductGroupVariable">
      от {{ +editedPrice?.toLocaleString() }} ₽
    </template>

    <template v-else-if="isProductVariable && +startPrice === +props.price">
      от {{ +editedPrice?.toLocaleString() }} ₽
    </template>

    <template v-else-if="currentProductInCart?.item?.count > 0 && props.isModal && props.product.countable === false">
      {{ (props.price * currentProductInCart?.item?.count)?.toLocaleString() }} ₽
    </template>

    <template v-else>
      <small v-if="props.regularPrice && +props.regularPrice !== +props.price">
        {{ props.regularPrice?.toLocaleString() }} ₽
      </small>
      {{ props.price?.toLocaleString() }} ₽
    </template>
  </div>
</template>

<script setup>
const catalogStore = useCatalogStore();
const cartStore = useCartStore();

const { productInCart } = storeToRefs(cartStore)

const props = defineProps({
  regularPrice: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    default: 0,
  },

  isReverse: {
    type: Boolean,
    default: false,
  },

  isBig: {
    type: Boolean,
    default: false,
  },

  product: {
    type: Object,
    default: {},
  },

  isModal: {
    type: Boolean,
    default: false,
  }
})

const startPrice = props.price;

const currentProductInCart = computed(() => {
  if (props.product.type === 'simple') {
    return productInCart.value(+props.product.id)
  }
  else if (props.product.type === 'supplements') {
    let temp = false
    if (props.product.acf.supplements) {
      temp = props.product.acf.supplements.some(supplement => {
        return supplement.products && supplement.products.length > 0;
      })
    }

    if (!temp) return productInCart.value(+props.product.id);
  }
  
  return {
    idx: null,
    item: null,
  }
})

const isProductWithSupplements = computed(() => {
  return props.product.acf.supplements && props.product.acf.supplements?.length > 0 && props.product.acf.supplements.some(block => block.products && block.products.length > 0);
})

const isProductGroupVariable = computed(() => {
  return props.product.type === 'group_variable'
})

const isProductVariable = computed(() => {
  return props.product.type === 'variable'
})

const productSupplements = computed(() => props.product.acf.supplements)

const editedPrice = computed(() => {
  if (isProductGroupVariable.value) {
    let defaultProduct = props.product.variations.find(item => item.default === true);
    return catalogStore.getProductById(defaultProduct.product)?.price;
  }
  else if (isProductVariable.value) {
    let pricesMap = props.product.product_variations_data.map(item => item.price)
    
    let minPrice = Math.min(...pricesMap);

    return minPrice;
  }
  else if (isProductWithSupplements.value) {
    let newPrice = 0;


    productSupplements.value.forEach(supplement => {
      if (supplement.supplement_required === 'yes' || supplement.supplement_required === true) {
        const currentSupplementsIds = supplement.products;

        const supplementsProducts = [];

        currentSupplementsIds.forEach(id => {
          supplementsProducts.push(catalogStore.allProducts.find(item => +item.id === +id));
        })

        const cheapestProduct = supplementsProducts.reduce((min, product) => {
          if (product && product.price !== undefined) {
            return +product.price < +min.price ? product : min;
          }
          return min;
        }, { price: Infinity });

        const mitQuantity = +supplement.quantity_min || 1

        newPrice += +mitQuantity * +cheapestProduct?.price;
      }
    })

    return newPrice;
  }
  else {
    return false;
  }
})
</script>

<style lang="scss" scoped>
.price-block {
  display: flex;
  align-items: center;
  grid-gap: 6px;
  flex-wrap: wrap;

  color: var(--orange);

  @include text_normal;
  font-weight: 600;

  small {
    @include extra_small;
    color: var(--grayText);
    text-decoration: line-through;
    line-height: 18.5px;
  }

  &--reverse {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  &--big {
    grid-gap: 0px;

    @include h2;

    small {
      @include text_normal;
      font-weight: 500;
    }
  }
}

.modal-product {
  .price-block {
    align-items: flex-start;
    flex-direction: column;
  }

}
</style>