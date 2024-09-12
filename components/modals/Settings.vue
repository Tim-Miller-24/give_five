<template>
  <ModalsOverlay :is-show="isShow" @close="commonStore.toggleShowSettingsModal(false)">
    <div class="modal-settings">
      <div class="modal-settings__header">
        <p class="modal-settings__title">
          Настройки
        </p>

        <a href="#" rel="nofollow" class="modal-settings__close" @click.prevent="closeModal()">
          <UIIcon name="close" />
        </a>
      </div>

      <p class="modal-settings__description">
        Укажите страну проживания, используемые язык и валюту
      </p>

      <div class="modal-settings__form">
        <!-- <UISelect
          label="Регион"
          placeholder="Российская Федерация"
        /> -->
        
        <UISelect label="Язык" 
        type="lang" 
        :placeholder="language"
        >
          <div class="select__dropdown-item" 
            v-for="(lang, i) in languages" :key="i"
            :data-google-lang="lang.code" 
            @click="selectLanguage(lang.code)"
          >
            <img :src="`/images/lang/lang__${lang.code}.png`" :alt="lang.code" class="language__img">
            <p> {{ lang.text }} </p>
          </div>
        </UISelect>

        <!-- <UISelect
          label="Валюта"
          placeholder="Рубль"
        /> -->
      </div>
    </div>

    <div v-if="isShowLoader" class="modal-loader">
      <UILoader is-big class="loader" />
    </div>

  </ModalsOverlay>
</template>

<script setup lang="ts">
const commonStore = useCommonStore()

const { languages } = storeToRefs(commonStore)

const isShow = ref<boolean>(true);

const isShowLoader = ref<boolean>(false);

const language = ref<string>('Русский');

const closeModal = () => {
  isShow.value = false;
}

const selectLanguage = (lang: string) => {
  language.value = lang;

  isShowLoader.value = true;

  commonStore.localSettings.language = lang;
}
</script>

<style lang="scss" scoped>
:deep(.modal__content) {
  @include maq($bp-small) {
    height: 100%;
  }
}
:deep(.loader) {
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 1001;
}
.modal-loader {
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vw;
  
  z-index: 1000;

  background: #4545453c;
  backdrop-filter: blur(1px);
}
.modal-settings {
  width: 100vw;
  max-width: 450px;

  display: flex;
  flex-direction: column;

  padding: 50px 60px;

  background: var(--white);
  border-radius: 40px;

  @include maq($bp-small) {
    border-radius: 0;
    height: 100%;
    padding: 30px;
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
    align-items: center;
    justify-content: space-between;

    margin-bottom: 20px;
  }

  &__title {
    @include h2;
  }

  &__description {
    margin-bottom: 40px;

    @include text_big;
  }

  &__form {
    display: flex;
    flex-direction: column;
    grid-gap: 20px;
  }
}
</style>
