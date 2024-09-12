<template>
  <UICounter v-if="!!item" :count="countLabel" @increment="increment()" @decrement="decrement()"
    :class="['add-button add-button--counter active', { 'add-button--small': isSmall, 'conuter--app': isAppStyle }]" :product="props.currentItem" />

  <button v-else type="submit" :disabled="disabled" :class="[
    'add-button',
    {
      'add-button--reverse': productType === 'simple' || isAppStyle,
      'add-button--small': isSmall,
      'add-button--app': isAppStyle,
    },
  ]" @click.stop.prevent="click()"> 

    <template v-if="(isProductWithSupplements && editedPrice > 0 && +startPrice === +getPrice) && isAppStyle">
      от {{ (+editedPrice + +startPrice).toLocaleString() }} ₽
    </template>

    <template v-else-if="isProductGroupVariable && isAppStyle">
       от {{ +editedPrice.toLocaleString() }} ₽
    </template>

    <template v-else-if="isProductVariable && isAppStyle">
      от {{ +editedPrice.toLocaleString() }} ₽
    </template>
    
    <template v-else>
      <small v-if="+getRegularPrice > +getPrice && isAppStyle" style="padding-top: 2px;">
        {{ (+getRegularPrice).toLocaleString() }} ₽
      </small>
      <span v-if="isAppStyle"> {{ (+getPrice).toLocaleString() }} ₽ </span>
  
      <span v-if="props.buttonLabel && !isAppStyle"> {{ props.buttonLabel }} </span>
      <span v-else-if="!isAppStyle"> {{ buttonLabel }} </span>
    </template>



    <UIIcon :name="isAppStyle ? 'cart' : buttonIcon" />
  </button>
</template>

<script setup>
const commonStore = useCommonStore();
const catalogStore = useCatalogStore();

const isOrderingDisabled = computed(() => commonStore.getOrderDisability);

const isAppStyle = computed(() => commonStore?.cart_button_as_app || false);


const props = defineProps({
  item: {
    type: Object,
    default: null,
  },

  currentItem: {
    type: Object,
    default: null,
  },

  productType: {
    type: String,
    default: "",
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  isSmall: {
    type: Boolean,
    default: false,
  },

  buttonLabel: {
    type: String,
    default: "",
  },

  pricesForVariation: {
    type: Array,
    default: [],
  }
});

const productType = computed(() => {
  let type = props.productType;

  if (type === 'supplements') {
    if (props.currentItem && props.currentItem.acf.supplements) {
      if (props.currentItem.acf.supplements.some(supplement => {
        return supplement.products && supplement.products.length > 0;
      })) {
        return 'supplements'
      }
    }
    else {
      return 'simple'
    }
  }


  return type;
})

const isProductGroupVariable = computed(() => {
  return productType.value === 'group_variable'
})

const isProductVariable = computed(() => {
  return productType.value === 'variable'
})

const emits = defineEmits(["increment", "decrement", "click", "add"]);

// <!-- Computed -->
const isProductWithSupplements = computed(() => {
  return props.currentItem.acf.supplements && props.currentItem.acf.supplements?.length > 0 && props.currentItem.acf.supplements.some(block => block.products && block.products.length > 0); 
})

const productSupplements = computed(() => props.currentItem.acf.supplements)

const editedPrice = computed(() => {
  if (isProductGroupVariable.value) {
    let defaultProduct = props.currentItem.variations.find(item => item.default === true);
    return catalogStore.getProductById(defaultProduct.product)?.price;
  }
  else if (isProductVariable.value) {
    let pricesMap = props.currentItem.product_variations_data.map(item => item.price)
    
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

const countLabel = computed(() => {
  if (props.item) {
    //let add_to_basket_once = props.item.add_to_basket_once || 1
    let portion_nat_size = props.item.portion_nat_size || 1;
    //величина добавляемых за раз порций товара зависит от параметров portion_nat_size и add_to_basket_once
    // const value = parseInt((( +add_to_basket_once * +props.item.portion_nat_size) * +props.item.count) * 100) / 100
    const value = +parseInt(+portion_nat_size * +props.item.count * 100) / 100;
    return `${value} ${props.item.measure_unit}`;
  }

  return null;
});

const buttonLabel = computed(() => {
  switch (productType.value) {
    case "simple":
      return "В корзину";
    case "supplements":
      return "Собрать";
    case "extraProduct":
      return "Добавить";
    default:
      return "Выбрать";
  }
});

const buttonIcon = computed(() => {
  let icon = "arrow";

  if (productType.value === "simple" || productType.value === "extraProduct") {
    icon = "add";
  }

  return icon;
});

// <!-- Methods -->
const getPrice = computed(() => {
  if (props.currentItem) {
    if (props.pricesForVariation?.length > 0) {
      return props.pricesForVariation[0];
    }

    if (productType.value === 'variable') {
      let price_multiplier_for_customer = props.currentItem.price_multiplier_for_customer || 1;
      const value = parseInt((( +price_multiplier_for_customer) * +props.currentItem.product_variations_data[0].price) * 100) / 100
      return `${value}`
    }
    let price_multiplier_for_customer = props.currentItem.price_multiplier_for_customer || 1;
    const value = parseInt((( +price_multiplier_for_customer) * +props.currentItem.price) * 100) / 100
    return `${value}`
  }

  return null
})

const startPrice = getPrice.value;

const getRegularPrice = computed(() => {
  if (props.currentItem) {
    if (props.pricesForVariation?.length > 1) {
      return props.pricesForVariation[1];
    }

    if (productType.value === 'variable') {
      let price_multiplier_for_customer = props.currentItem.price_multiplier_for_customer || 1;
      const value = parseInt((( +price_multiplier_for_customer) * +props.currentItem.product_variations_data[0].regular_price) * 100) / 100
      return `${value}`
    }

    let price_multiplier_for_customer = props.currentItem.price_multiplier_for_customer || 1;
    const value = parseInt((( +price_multiplier_for_customer) * +props.currentItem.regular_price) * 100) / 100
    return `${value}`
  }

  return null
})
const click = () => {
  if (productType.value === "simple") {
    if (isOrderingDisabled.value) {
      commonStore.toggleShowPopupModal(true);
      return;
    }
    emits("add");
  } else {
    emits("click");
  }
};

const increment = () => {
  emits("increment");
};

const decrement = () => {
  emits("decrement");
};
</script>

<style lang="scss" scoped>
.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 10px;

  width: 100%;
  height: 48px;

  padding: 0;

  @include text_normal;
  font-weight: 500;

  background: var(--purple);
  border: 2px solid transparent;
  border-radius: 14px;

  white-space: nowrap;

  transition: border-color 0.3s, background-color 0.3s;

  @include mq($bp-small) {
    padding: 0 10px;
  }

  &:deep(.ui-icon svg path) {
    fill: var(--white);
  }

  &--reverse {
    flex-direction: row-reverse;
  }

  &--counter {
    justify-content: space-between;

    gap: 0px;

    &.conuter--app {
      // border-radius: 50px;
      // border-color: var(--red) !important;
    }
  }

  &--small {
    height: 32px;

    padding: 0;

    @include text_small;
    font-weight: 500;
  }

  &--app {
    // border: 2px solid var(--orangeSecondary);
    // border-radius: 50px;

    font-weight: 600;

    // &:hover:enabled,
    // &.active {
    //   background: var(--white);
    //   border-color: var(--orange) !important;
    // }
  }

  small {
    color: var(--orange);
    text-decoration: line-through;
    line-height: 18.5px;
  }

  &:hover:enabled,
  &.active {
    // background: var(--white);
    border-color: var(--yellowDark);
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
