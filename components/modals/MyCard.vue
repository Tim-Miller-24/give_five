<template>
  <ModalsOverlay
    :is-show="isShow"
    @close="emits('close')"
  >
    <div class="modal-my-card">
      <div class="modal-my-card__header">
        <p class="modal-my-card__title">
          Ваша карта
        </p>

        <a
          href="#"
          rel="nofollow"
          class="modal-my-card__close"
          @click.prevent="closeModal()"
        >
          <UIIcon name="close" />
        </a>
      </div>

      <div class="modal-my-card__main">
        <img :data-src="qrCode" v-lazy-load alt="" :src="qrCode" loading="lazy">
      </div>

      <UIButton
        color="yellow"
        class="modal-my-card__button"
        @click="closeModal()"
      >
        Готово
      </UIButton>
    </div>
  </ModalsOverlay>
</template>

<script setup>
const props = defineProps({
  qrCode: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['close'])

const isShow = ref(true)

const closeModal = () => {
  isShow.value = false
}
</script>

<style lang="scss" scoped>
.modal-my-card {
  width: 100vw;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  grid-gap: 50px;

  padding: 20px;

  background: var(--white);
  
  @include mq($bp-small) {
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
    font-weight: bold;
  }

  &__main {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__button {
    font-weight: 500;
  }
}
</style>