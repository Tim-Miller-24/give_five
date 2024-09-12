<template>
  <div class="modal-product-else-item" @click="openProduct()">
    <div class="modal-product-else-item__image">
      <img
        v-lazy-load
        :data-src="itemImage"
        :key="props.item.id"
        alt=""
        :src="itemImage"
        loading="lazy"
      >
      <p
        v-if="discount"
        class="modal-product-else-item__discount"
      >
        -{{ discount }}%
      </p>
    </div>
    <div class="modal-product-else-item__content">
      <p class="modal-product-else-item__title">
        {{ item.name }}
      </p>

      <CommonPriceBlock
        :regular-price="itemRegularPrice"
        :price="itemPrice"
        is-reverse
        :product="props.item"
      />

      <CommonAddButton
        :item="currentProductInCart.item"
        :currentItem="props.item"
        :product-type="productType"
        is-small
        @increment="increment()"
        @decrement="decrement()"
        @add="addToCart()"
        @click="openProduct()"
        class="modal-product-else-item__button"
      />
    </div>
  </div>
</template>

<script setup>
import { useCatalogStore } from '@/store/catalog'
import { useCartStore } from '@/store/cart'

const catalog = useCatalogStore()
const cart = useCartStore()

const { productInCart } = storeToRefs(cart)

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

// <!-- Computed -->
// Тип продукта
const productType = computed(() => {
  return props.item?.type
})

const currentProductInCart = computed(() => {
  if (productType.value === 'simple') {
    return productInCart.value(+props.item.id)
  }

  return {
    idx: null
  }
})

const itemImage = computed(() => {
  return props.item?.images[0] || ''
})

const itemPrice = computed(() => {
  return +props.item.price
})

const itemRegularPrice = computed(() => {
  return +props.item.regular_price
})

const discount = computed(() => {
  if (itemPrice.value !== itemRegularPrice.value) {
    return 100 - (itemPrice.value / itemRegularPrice.value * 100)
  }

  return 0
})

// <!-- Methods -->
const openProduct = () => {
  catalog.elseProductOpened = true;
  catalog.setProduct(+props.item.id)
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
.modal-product-else-item {
  display: flex;
  align-items: center;
  grid-gap: 20px;

  width: 310px;

  padding: 5px;

  background: var(--white);
  border-radius: 20px;

  &:hover {
    cursor: pointer;
  }

  &__image {
    position: relative;
    flex: 0 0 auto;

    width: 140px;
    height: 100px;

    border: 1px solid var(--grayBg);
    border-radius: 20px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__discount {
    position: absolute;
    top: 8px;
    left: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 47px;
    height: 19px;

    @include extra_small;
    font-weight: 600;

    background: var(--grayBg);
    border-radius: 16px;
  }

  &__content {
    flex: 1 1 auto;
    display: grid;
  }

  &__title {
    margin-bottom: 9px;

    @include overflow-text;
    @include text_normal;
    font-weight: 600;
  }

  &__button {
    // width: 135px;

    margin-top: 15px;

    // font-weight: 500;
  }
}
</style>