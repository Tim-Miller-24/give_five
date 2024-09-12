<template>
  <ModalsOverlay
      :is-show="isShow"
      @close="emits('close')"
  >
    <form
        class="modal-bonuses"
        @submit.prevent="submit()"
    >
      <div class="modal-bonuses__header">
        <p class="modal-bonuses__title">
          Укажите количество бонусов для списания
        </p>

        <button
            href="#"
            rel="nofollow"
            class="modal-bonuses__close"
            @click.prevent="closeModal()"
        >
          <UIIcon name="close" />
        </button>
      </div>

      <div class="modal-bonuses__lines">
        <div class="modal-bonuses__line">
          <p class="modal-bonuses__label">
            Ваш бонусный баланс:
          </p>
          <p class="modal-bonuses__value">
            {{ getUserBonus }}
            <UIIcon name="bonuses" />
          </p>
        </div>
        <div class="modal-bonuses__line">
          <p class="modal-bonuses__label">
            Доступно для списания:
          </p>
          <p class="modal-bonuses__value">
            {{ getAvailableBonus }}
            <UIIcon name="bonuses" />
          </p>
        </div>
      </div>

      <div class="modal-bonuses__input">
        <input
            type="number"
            :placeholder="`${getAvailableBonus} баллов`"
            :max="`${getAvailableBonus}`"
            class="modal-bonuses__input-area"
            v-model="bonus.bonus"
        >
        <span
            v-if="bonus.error"
            class="modal-bonuses__input__error"
        >
            {{ bonus.error }}
          </span>
        <p class="modal-bonuses__note">
          1 бонус = 1 рубль
        </p>
      </div>

      <UIButton
          type="submit"
          color="yellow"
          class="modal-bonuses__button"
      >
        Продолжить
      </UIButton>
    </form>
  </ModalsOverlay>
</template>

<script setup>

const isShow = ref(true)

const emits = defineEmits(['close', 'submit'])

const userStore = useUserStore()
const cartStore = useCartStore()
const getUserBonus = computed(() => userStore.getUserBonus)
const getUserUsedBonuses = computed(() => userStore.getUserUsedBonuses)
//бонусы доступные к списыванию (% от тотала в корзине)
const getAvailableBonus = computed(() => {
  let cartPart = Math.floor(cartStore.cartItemsPrice * (userStore.getMaxPercent / 100))
  return cartPart <= getUserBonus.value ? cartPart : getUserBonus.value;
} )

//const bonusesRemain = computed(() => )

const bonus = reactive({
  bonus: 0,
  error: ''
})
const closeModal = () => {
  isShow.value = false
}

const submit = () => {
  if (!bonus.bonus || bonus.bonus === 0) {
    bonus.error = 'Введите бонус!'
    return false
  }
  if (bonus.bonus > getAvailableBonus.value) {
    bonus.error = 'Введенный бонус превышает доступное для списания количество!'
    return false
  }
  console.log("bonus entered:",bonus.bonus)
  cartStore.setBonus(bonus.bonus)
  userStore.setAppliedBonus(bonus.bonus)
  closeModal()
}
watch(() => bonus.bonus, () => {
  bonus.error = ''
})
</script>

<style lang="scss" scoped>
.modal-bonuses {
  width: 100vw;
  min-height: 100vh;

  display: grid;
  grid-gap: 40px;

  padding: 20px;

  background: var(--white);

  @include mq($bp-small) {
    min-height: auto;
    max-width: 450px;

    padding: 50px 60px;

    border-radius: 40px;
  }

  @include maq($bp-small) {
    padding-top: 30px;
    display: flex;
    flex-direction: column;
  }

  &__close {
    ::v-deep(.ui-icon) svg {
      width: 24px;
      height: 24px;

      path {
        fill: var(--blackText);
      }
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__title {
    @include text_large;
    font-weight: 700;
  }

  &__lines {
    display: grid;
    grid-gap: 6px;
  }

  &__line {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__label {
    @include text_normal;
    font-weight: 500;
    color: var(--black);
  }

  &__value {
    display: flex;
    align-items: center;
    grid-gap: 10px;

    @include text_large;
    font-weight: 700;

    ::v-deep(.ui-icon) svg path {
      fill: var(--yellow);
    }
  }

  &__input {
    display: grid;
    position: relative;
    grid-gap: 10px;
    &__error {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;

      @include text_mini;
      color: var(--red);
    }
  }

  &__input-area {
    width: 100%;
    height: 48px;

    padding: 12px 16px;

    @include text_normal;
    font-weight: 500;

    background: var(--grayBg);
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

  &__note {
    text-align: center;
    @include text_mini;
    color: var(--grayText);
  }

  &__button {
    font-weight: 500;
  }
}
</style>
