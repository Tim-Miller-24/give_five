<template>
  <form
    :class="[
      'promocode-block',
      {
        'promocode-block--cart' : inCart,
        'promocode-block--error' : promocodeResult.status === 'error',
        'promocode-block--success' : promocodeResult.status === 'success'
      }
    ]"
    @submit.prevent="onSubmit()"
  >
    <span class="promocode-block__icon">
      <UIIcon name="promocode" />
    </span>
    <input
      v-model.trim="promocode"
      type="text"
      placeholder="Промокод"
      :disabled="isLoading || !!promocodeResult.status"
      class="promocode-block__input"
    >

    <div class="promocode-block__actions">
      <button
        v-if="promocodeResult.status"
        class="promocode-block__action"
        @click.prevent.stop="onReset()"
      >
        Сбросить
      </button>
      <button
        v-else
        :disabled="isLoading"
        type="submit"
        class="promocode-block__action"
      >
        {{ isLoading ? 'Применяем...' : 'Применить' }}
      </button>
    </div>

    <span
      v-if="promocodeResult.status"
      class="promocode-block__status">
      {{ promocodeResult.message }}
    </span>
  </form>
</template>

<script setup>
const cartStore = useCartStore()
const catalogStore = useCatalogStore();
const chooseDiscountStore = useChooseDiscountStore()
const userStore = useUserStore();
const commonStore = useCommonStore();

const config = useRuntimeConfig()

const { cartItems, needApplyPromocode } = storeToRefs(cartStore)

const { deliveryType, selectedLocation } = storeToRefs(commonStore)

defineProps({
  inCart: {
    type: Boolean,
    default: false,
  },
})


const promocode = ref('')

const promocodeResult = reactive({
  status: null, // null | error | success
  message: '',
})

const isLoading = ref(false);

//const wentToPromoCondition = ref(false)
// <!-- Computed -->
const promocodeObj = computed(() => cartStore.promocode);

watch(() => promocodeObj.value, () => {
  const promocode = promocodeObj.value
  console.log("promocode WATCH: ",promocode);

  if (promocode?.amount > 0 && promocode?.value && promocode?.type) {
    console.log('here');
    promocodeResult.message = 'Промокод успешно применён'
    promocodeResult.status = 'success'
    isLoading.value = false
    cartStore.setNeedApplyPromocode(false)
    cartStore.getOnlyCoupons();
    //wentToPromoCondition.value = false
  }

  if (promocode?.type === 'free_gift') {
    // cartStore.addDiscountProduct({
    //   id: promocode.productId,
    //   idx: (cartStore.cartItems.length - 1)
    // })

    // chooseDiscountStore.setSelectedDiscountValue(productId, true);
    // chooseDiscountStore.applyDiscount();
    // console.log('next2');

    let giftItem = catalogStore.getProductById(promocode.productId);

    giftItem.price = 0;

    cartStore.addToCart(giftItem, true);

    cartStore.getOnlyCoupons(true);
  }
})
// <!-- Methods -->
const onReset = () => {
  promocode.value = ''
  promocodeResult.status = null
  promocodeResult.message = ''
  
  let indexInCart = cartItems.value.findIndex(item => item.id === promocodeObj.value.productId);
  console.log(indexInCart);
  cartStore.removeFromCart(indexInCart, true);
  
  cartStore.setPromocode(null)

  let selectedPromocodes = chooseDiscountStore.discountItems.filter((item) => {
    return [cartStore.defaultImages.promoPercent, cartStore.defaultImages.promoFixed].includes(item.image) && item.isSelected
  })

  console.log('__selectedPromocodes', selectedPromocodes)
  
  if (selectedPromocodes.length > 0) {
    const autoCouponLength = cartStore.getAutoCoupons.length + 1
    chooseDiscountStore.clearSelected()
    cartStore.setDiscountBlock({
      header: "Вам доступны скидка или подарок!",
      description: "Вам доступны " + autoCouponLength + " скидки или подарка. Выберите 1 из предложенных вариантов",
      buttonColor: "yellow",//"#ffce00",
      buttonText: "Выбрать",
      image: cartStore.defaultImages.giftImg
    })
  }
}

const onSubmit = async () => {
  if (isLoading.value) {
    return false
  }

  isLoading.value = true

  const obj = {}

  // let delivTemp = '';

  // if (deliveryType.value === 'delivery') {
  //   delivTemp = 'flat_rate';
  // }
  // else if (deliveryType.value === 'pickup') {
  //   delivTemp = 'local_pickup'
  // }
  // else if (deliveryType.value === 'lounge') {
  //   delivTemp = 'wcso_booking'
  // }

  obj.delivery_type = deliveryType.value;
  obj.coupon_code = promocode.value;
  obj.take_date = getDate();

  obj.time_from = "00:01";
  obj.time_to = "23:59";

  obj.meta_data = [{
    key: 'stock_id',
    value: selectedLocation.value.warehouse_id
  }];

  obj.line_items = cartItems.value.map(item => {
    return {
      product_id: item.id,
      quantity: item.count,
    }
  })

  obj.customer_id = userStore?.user?.ID || 1;

//   {
//   "delivery_type": "flat_rate",
//   "coupon_code": "tsarskaya10",
//   "take_date": "21.08.2024",
//   "time_from": "13:46",
//   "time_to": "17:56",
//   "meta_data": [
//     {
//       "key": "stock_id",
//       "value": "222"
//     }
//   ],
//   "customer_id": "1"
// }

  const { data, error } = await useFetch(`${config.public.BASE_URL}/wp-json/api/flutter_woo/coupon`, {
    method: 'POST',
    body: obj
  })

  let status = null;
  let message = '';

  if (error?.value) {
    message = error?.value?.data?.message || 'Не удалось применить промокод'

    status = 'error'
  } 
  else {
    const coupon = data?.value?.coupon || {}
    const couponDiscount = data?.value?.discount || 0;

    const commonStore = useCommonStore()
    const settings = commonStore.promoSettings
    const isPromoCodeAddedToDiscounts = chooseDiscountStore.discountItems.filter((item) => {
      return [cartStore.defaultImages.promoPercent, cartStore.defaultImages.promoFixed].includes(item.image)
    }).length !== 0

    // if (! settings?.coupons_and_auto_coupons_summing && coupon && ! needApplyPromocode.value /*&& ! isPromoCodeAddedToDiscounts*/) {
    //   console.log("returned coupon:",coupon)
    //   if (! isPromoCodeAddedToDiscounts) {
    //     chooseDiscountStore.addDiscount({
    //       id: Date.now(),
    //       name: obj.coupon_code,
    //       image: coupon.discount_type === 'percent' ? cartStore.defaultImages.promoPercent : cartStore.defaultImages.promoFixed,
    //       amount: coupon.amount,
    //       description: "Скидка " + coupon.amount + (coupon.discount_type === 'percent' ? '%' : 'р'),
    //       discountType: coupon.discount_type,
    //       isSelected: false,
    //       product: null
    //     }, true)
    //     chooseDiscountStore.clearSelected()
    //   }
    //   //isLoading.value = false
    //   //wentToPromoCondition.value = true
    //   onReset()
    //   if (cartStore.isShowCartModal)
    //     chooseDiscountStore.toggleChooseDiscountModal(true, 'cart')
    //   else {
    //     cartStore.setNeedOpenChooseDiscountModal(true)
    //   }
    //   return false
    // }
    // else {

      message = 'Промокод успешно применён'
      status = 'success'

      let gift_product = coupon.meta_data.find(item => item.key === '_wc_free_gift_coupon_data')?.value || null;

      let product_id = null;

      if (gift_product) {
        product_id = Object.values(gift_product)[0]?.product_id;
      }

      cartStore.setPromocode({
        value: promocode.value,
        type: coupon.discount_type,
        amount: parseFloat(coupon.amount),
        discount: couponDiscount,
        productId: product_id,
      })
      cartStore.setNeedApplyPromocode(false)

      if (coupon.discount_type !== 'free_gift') {
        cartStore.getOnlyCoupons();
      }

      //wentToPromoCondition.value = false
    // }
  }

  promocodeResult.status = status
  promocodeResult.message = message

  isLoading.value = false
}

const setDefault = () => {
  if (promocodeObj.value) {
    promocode.value = promocodeObj.value.value

    promocodeResult.message = 'Промокод успешно применён'
    promocodeResult.status = 'success'

    // onSubmit()
  }
}

setDefault()
</script>

<style lang="scss" scoped>
.promocode-block {
  position: relative;

  width: 100%;

  &--error {
    .promocode-block {
      &__input {
        border-color: var(--red);
      }

      &__actions {
        &:before {
          background: var(--orangeLight);
        }
      }

      &__action, &__status {
        color: var(--red);
      }
    }
  }

  &--success {
    .promocode-block {
      &__input {
        border-color: var(--green);
      }

      &__actions {
        &:before {
          background: var(--greenLight);
        }
      }

      &__action, &__status {
        color: var(--green);
      }
    }
  }

  &--cart {
    .promocode-block {
      &__status {
        top: 100%;

        @include text_mini;
        font-weight: 500;
      }
    }
  }

  &__icon {
    position: absolute;
    top: 12px;
    left: 16px;
    bottom: 12px;

    z-index: 1;
  }

  &__input {
    width: 100%;
    height: 48px;

    padding: 12px 16px 12px 52px;

    @include text_normal;
    font-weight: 500;

    background: var(--grayBg2);
    border: 1px solid var(--grayBg2);
    border-radius: 14px;

    &::-webkit-input-placeholder {
      color: var(--grayText);
    }
    &:-moz-placeholder {
      color: var(--grayText);
      opacity:  1;
    }
    &::-moz-placeholder {
      color: var(--grayText);
      opacity:  1;
    }
    &:-ms-input-placeholder {
      color: var(--grayText);
    }
    &::-ms-input-placeholder {
      color: var(--grayText);
    }
    &::placeholder {
      color: var(--grayText);
    }
  }

  &__actions {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    padding-right: 4px;

    &:before {
      content: '';

      display: block;

      width: 2px;
      height: 20px;

      background: rgba(0, 0, 0, 0.3);
      border-radius: 20px;
    }
  }

  &__action {
    height: 100%;

    padding: 0 16px;

    @include text_normal;
    font-weight: 500;
    color: var(--grayText);

    background: none;
    border: none;
  }

  &__status {
    position: absolute;
    top: calc(100% + 4px);
    left: 16px;

    @include text_small;
    font-weight: 500;
  }
}
</style>