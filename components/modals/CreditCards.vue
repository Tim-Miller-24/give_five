<template>
  <ModalsOverlay
    :is-show="isShow"
    @close="cancel"
  >
    <div class="credit-card" v-if="!isMobileOrTablet">
      <div class="credit-card__header">
        <p class="credit-card__title">
          Выберите карту
        </p>

        <a
          href="#"
          rel="nofollow"
          class="credit-card__close"
          @click.prevent="closeModal()"
        >
          <UIIcon name="close" />
        </a>
      </div>

      <div class="credit-card__main" >
        
        <p class="credit-card__text">
          
        </p>

        <label class="radio" v-for="(item, index) in props.cards" :key="index">
          <input class="radio__input" type="radio" v-model="selectedCard" :id="item.token" :value="item.token" />

          <span class="radio__box"></span>

          <label class="radio__text" :for="item.token">
            <img :src="getCardImage(item.card_type)" class="radio__image" :key="index" alt="credit card">

            <span style="padding-top: 8px;"> •••• {{ item.last4 }} </span>
          </label>
        </label>
        <label class="radio">
          <input class="radio__input" type="radio" v-model="selectedCard" id="another-card" value="online" />

          <span class="radio__box"></span>

          <label class="radio__text" for="another-card">
            <img :src="getCardImage('test')" class="radio__image" alt="credit card">

            <span style="padding-top: 8px;"> Оплатить картой онлайн </span>
          </label>
        </label>
      </div>

      <div class="credit-card__buttons">
        <UIButton
          color="yellow-outline"
          class="credit-card__button"
          @click="cancel()"
        >
          Отменить
        </UIButton>

        <UIButton
          color="yellow"
          class="credit-card__button"
          @click="submit()"
        >
          Подтвердить
        </UIButton>
      </div>
    </div>

    <CommonBottomSheet :isOrder="true" v-else>
      <div class="credit-card">
      <div class="credit-card__header">
        <p class="credit-card__title">
          Выберите карту
        </p>

        <a
          href="#"
          rel="nofollow"
          class="credit-card__close"
          @click.prevent="closeModal()"
        >
          <UIIcon name="close" />
        </a>
      </div>

      <div class="credit-card__main" >
        
        <p class="credit-card__text">
          
        </p>

        <label class="radio" v-for="(item, index) in props.cards" :key="index">
          <input class="radio__input" type="radio" v-model="selectedCard" :id="item.token" :value="item.token" />

          <span class="radio__box"></span>

          <label class="radio__text" :for="item.token">
            <img :src="getCardImage(item.card_type)" class="radio__image" :key="index" alt="credit card">

            <span style="padding-top: 8px;"> •••• {{ item.last4 }} </span>
          </label>
        </label>
        <label class="radio">
          <input class="radio__input" type="radio" v-model="selectedCard" id="another-card" value="online" />

          <span class="radio__box"></span>

          <label class="radio__text" for="another-card">
            <img :src="getCardImage('test')" class="radio__image" alt="credit card">

            <span style="padding-top: 8px;"> Оплатить картой онлайн </span>
          </label>
        </label>
      </div>

      <div class="credit-card__buttons">
        <UIButton
          color="yellow-outline"
          class="credit-card__button"
          @click="cancel()"
        >
          Отменить
        </UIButton>

        <UIButton
          color="yellow"
          class="credit-card__button"
          @click="submit()"
        >
          Подтвердить
        </UIButton>
      </div>
    </div>
    </CommonBottomSheet>
  </ModalsOverlay>
</template>
  
<script setup>
import defaultCardLogo from '@/assets/images/default-card-logo.png';
import visaCardLogo from '@/assets/images/visa-logo.png';
import masterCardLogo from '@/assets/images/mastercard-logo.png';
import mirCardLogo from '@/assets/images/mir-logo.svg';

const userStore = useUserStore();
const commonStore = useCommonStore();

const isMobileOrTablet = commonStore.isMobileOrTablet

const selectedCard = ref(null);

const props = defineProps({
  cards: {
    type: Object,
    default: {},
  }
})
const isShow = ref(true);

const getCardImage = (type) => {
  if (type.toLowerCase() === 'mir') {
    return mirCardLogo;
  }
  else if (type.toLowerCase() === 'visa') {
    return visaCardLogo;
  }
  else if (type.toLowerCase() === 'mastercard') {
    return masterCardLogo;
  }
  else {
    return defaultCardLogo;
  }

}

const emits = defineEmits(['cancel', 'accept'])

const closeModal = () => {
  console.log(selectedCard.value);
  isShow.value = false;
}

const cancel = () => {
  emits('cancel');
  closeModal();
}

const submit = () => {
  userStore.selectedCard = selectedCard.value;

  emits('accept', selectedCard.value);

  closeModal();
}
</script>
  
<style lang="scss" scoped>
.radio {
  display: flex;
  align-items: center;
  grid-gap: 10px;
  cursor: pointer;

  margin-bottom: 10px;
  padding-bottom: 5px;

  border-bottom: 1px solid $yellowLightSecondary;

  &__input {
    display: none;

    &:checked + .radio__box {
      border-color: $yellow;

      &:after {
        opacity: 1;
      }
    }
  }

  &__text {
    color: $black;
    font-weight: 500;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;

    border: 2px solid $grayText2;
    border-radius: 50%;

    &:after {
      content: '';

      width: 16px;
      height: 16px;

      background: $yellow;
      border-radius: 50%;

      transition: opacity 0.3s;
      opacity: 0;
    }
  }

  &__image {
    width: 40px;
    height: 20px;
    object-fit: contain;
    margin-right: 15px;
  }
}
.credit-card {
  width: auto;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  grid-gap: 50px;

  padding: 20px;

  background: $white;

  @include mq($bp-small) {
    width: 100vw;
    min-height: auto;
    max-width: 450px;

    padding: 50px 60px;

    border-radius: 40px;
  }

  &__close {
    ::v-deep(.ui-icon) svg {
      width: 24px;
      height: 24px;

      path {
        fill: $blackText;
      }
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

  &__main {
    @include text_big;
    font-weight: 600;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    grid-gap: 12px;
  }

  &__button {
    font-weight: 500;
  }
}
</style>
  