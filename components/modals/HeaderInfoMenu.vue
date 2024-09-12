<template>
  <ModalsOverlay :is-show="isShow" position="right" :offset="0" name="cart"
    @close="commonStore.toggleShowMobileMenu(false)">
    <div class="mobile-menu">
      <div class="mobile-menu__content">
        <div class="mobile-menu__header">
          <LayoutHeaderLogo class="header__logo"/>

          <div style="display: flex; align-items: center; gap: 15px;">
            <LayoutHeaderLang class="mobile-menu__lang" v-if="isMobileOrTablet" />
  
            <a class="mobile-menu__close" @click.prevent="closeModal()">
              <UIIcon name="close" />
            </a>
          </div>
        </div>

        <LayoutHeaderSearch
          v-if="isMobileOrTablet && userStore.isAuth"
          class="search"
        />

        <div v-if="!userStore.isAuth" class="mobile-menu-auth">
          <p class="mobile-menu-auth__title">
            Войдите в личный кабинет
          </p>
          <p class="mobile-menu-auth__description">
            Чтобы пользоваться бонусной системой и получать персональные предложения
          </p>
          <UIButton color="yellow" class="mobile-menu-auth__button"
            @click.prevent="commonStore.toggleShowAuthModal(true)">
            <UIIcon name="person" />
            Войти
          </UIButton>
        </div>

        <PagesLkUserBlock v-else is-mobile-menu />

        <LayoutHeaderSearch
          v-if="isMobileOrTablet && !userStore.isAuth"
          class="search"
          style="margin-bottom: 30px;"
        />

        <PagesLkNavigation v-if="userStore.isAuth" style="margin-bottom: 30px;" is-mobile-menu @click="close()" />

        <div class="info__col info__about-menu">
          <p class="info__about-menu_title">
            О компании
          </p>
          <ul class="info__menu info-menu">
            <li v-for="(item, i) in about" :key="i" class="info-menu__item">
              <NuxtLink
                  :to="item.link"
                  class="info-menu__link"
                  @click="close()"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>


      </div>

      <div class="info__col">
        <div class="mobile-menu__info">
          <a :href="`tel:${phone}`" target="_blank" class="mobile-menu__phone">
            {{phoneFormat(phone)}}
          </a>
          <p
              class="mobile-menu__time"
              v-if=TimeDay
          >
            <UIIcon name="clock" />
            {{TimeDay}}
          </p>
          <div class="info__block">
            <p class="info__title">
              Мы в социальных сетях
            </p>
            <div class="info__socials">
              <a v-if="Telegramm"
                :href="Telegramm"
                target="_blank"
                rel="nofollow"
                class="info-social"
              >
                <img src="@/assets/images/socials/tg.png" alt="">
              </a>
              <a v-if="WatsApp"
                :href="WatsApp"
                target="_blank"
                rel="nofollow"
                class="info-social"
              >
                <img src="@/assets/images/socials/wa.png" alt="">
              </a>
              <a v-if="InstLink"
                 :href="InstLink"
                 target="_blank"
                 rel="nofollow"
                 class="footer-social"
              >
                <img src="@/assets/images/socials/ig.png" alt="">
              </a>
              <a v-if="VkLink"
                 :href="VkLink"
                 target="_blank"
                 rel="nofollow"
                 class="footer-social"
              >
                <img src="@/assets/images/socials/vk.png" alt="">
              </a>
              <a v-if="FbkLink"
                 :href="FbkLink"
                 target="_blank"
                 rel="nofollow"
                 class="footer-social"
              >
                <img src="@/assets/images/socials/fb.png" alt="">
              </a>
            </div>
          </div>
          <div class="info__block">
            <p class="info__title">
              В приложении ещё удобнее
            </p>
            <div class="info__apps">
              <a href="/" target="_blank" rel="nofollow" class="info-app">
                <img src="@/assets/images/google.png" alt="Google App">
                <div class="info-app__content">
                  <p class="info-app__label">
                    Доступно в
                  </p>
                  <p class="info-app__value">
                    Google Play
                  </p>
                </div>
              </a>
              <a href="/" target="_blank" rel="nofollow" class="info-app">
                <img src="@/assets/images/apple.png" alt="Apple App">
                <div class="info-app__content">
                  <p class="info-app__label">
                    Загрузите в
                  </p>
                  <p class="info-app__value">
                    App Store
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </ModalsOverlay>
</template>

<script setup>
const catalogStore = useCatalogStore();
const commonStore = useCommonStore()

const { isMobileOrTablet, showTranslateButton } = storeToRefs(commonStore)

const appTitle = commonStore?.titleDescription?.name

const isShow = ref(true)
const config = useRuntimeConfig()

const userStore = useUserStore()

const emits = defineEmits(['close', 'auth'])

// Methods
const close = () => {
  document.body.classList.remove('overflow-hidden')

  commonStore.toggleShowMobileMenu(false);
}

const auth = () => {
  emits('auth')

  close()
}

const phone = computed(() => commonStore.getPhone)

const Telegramm = computed(() => commonStore.contacts["telegram-link"])
const WatsApp = computed(() => commonStore.contacts["whatsapp-link"])
const VkLink = computed(() => commonStore.contacts["vk-link"])
const FbkLink = computed(() => commonStore.contacts["fb-link"])
const InstLink = computed(() => commonStore.contacts["inst-link"])

const TimeDay = computed( () => commonStore.getWorkTime() )

const closeModal = () => {
  isShow.value = false
}

const about = ref([]);
const Menu = computed(() => commonStore.menu)

console.log(Menu.value);
if (Menu.value) {
  //TODO move to store
  Menu.value?.footer.forEach((item, i) => {
    let link = '/information';
    if(item.type_label == 'Страница')
      link+='/page'
    else
    if(item.type_label == 'Запись')
      link+='/post'
    else
      link+='/page';

    let url = new URL(item.url);
    link+= url.pathname

    about.value.push({
      link: link, name: item.title
    })
  })
}
</script>

<style lang="scss" scoped>
.search {
  width: calc(100% - 30px);
  margin: auto;
}
.ui-icon-person {
  ::v-deep svg path {
    fill: $white;
  }
}
.footer__bottom {
    display: none;
    align-items: center;
    justify-content: space-between;
    grid-gap: 10px;
    flex-wrap: wrap;
    margin-top: 30px;
    padding-top: 16px;

    color: #969696;

    border-top: 1px solid #D9D9D9;

    @include mq($bp-medium) {
      margin-top: 50px;
      padding-top: 22px;
    }

    @include maq($bp-small) {
      display: flex;
      margin-bottom: 70px;
    }

    .lf-copyright{
      display: flex;
      gap: 10px;
      flex-wrap: nowrap;
      align-items: center;
      @include text_normal;
    }
}

.mobile-menu {
  position: relative;

  width: 100vw;
  max-width: 512px;
  height: 100vh;

  display: flex;
  flex-direction: column;
  grid-gap: 20px;

  padding: 0 20px;

  background: var(--grayBg2);
  overflow-y: auto;
  z-index: 2000;

  &__content {
    flex: 1 1 auto;
    margin-top: 97px;
    display: flex;
    flex-direction: column;
    grid-gap: 20px;
  }

  &__header {
    width: 100vw;
    max-width: 512px;
    background: var(--grayBg2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;

    right: 0;

    z-index: 100;

    // @include mq($bp-small-medium) {
    //   width: 97%;
    // }
    
    // @include mq($bp-small) {
    //   width: 96%;
    // }

    // @include mq($bp-medium) {
    //   max-width: 470px;
    //   width: 100%;
    //   left: auto;
    //   right: 15px;
    //   padding: 20px 0px;
    // }
    
    position: fixed;
    margin: auto;

    padding: 20px 20px;
    
    border-bottom: 1px solid var(--grayText2);
    /* 
    $bp-extra-small: 320px;
$bp-super-small: 480px;
$bp-small-medium: 549px;
$bp-small: 767px;
$bp-medium: 991px;
    */
  }

  &__close {
    :hover {
      cursor: pointer;
    }

    ::v-deep(.ui-icon) svg {
      width: 30px;
      height: 30px;

      path {
        fill: #262626;
      }
    }
  }
  
  &__lang {

    &:deep(span) {
      background: var(--white);
      border-radius: 14px;
      padding: 12px 15px 12px 15px;

      color: var(--blackText);
    }
  }

  &__info {
    flex: 0 0 auto;

    display: flex;
    flex-direction: column;

    padding: 20px 0 40px 25px;
  }

  &__phone {
    @include text_large;
    font-weight: 700;

    margin-bottom: 10px;
  }

  &__time {
    display: flex;
    align-items: center;
    grid-gap: 10px;

    margin-bottom: 20px;

    @include text_normal;
    font-weight: 600;
    color: var(--grayText);
  }

  &__label {
    @include text_big;
    font-weight: 600;
    color: var(--grayText2);

    margin-bottom: 20px;
  }
}

.mobile-menu-logo {
  width: 134px;
  height: 30px;
}

.mobile-menu-auth {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 20px 30px;

  @include mq($bp-medium) {
    display: none;
  }

  background: var(--white);
  border-radius: 20px;

  &__title {
    margin-bottom: 6px;

    @include text_big;
    font-weight: 600;
  }

  &__description {
    margin-bottom: 16px;

    @include text_small;
    font-weight: 500;
  }

  &__button {
    font-weight: 500;
  }
}
</style>
<style lang="scss" scoped>
.info {
  padding: 40px 0;

  background: var(--grayBg2);

  @include mq($bp-medium) {
    padding: 70px 0 40px;
  }

  &__box {
    display: flex;
    flex-direction: column;
  }

  &__about-menu {
    margin-bottom: 40px;

    &_title {
      margin-bottom: 20px;
      margin-left: 30px;

      color: #000;

      @include text_big;

      font-size: 24px;
      font-weight: 700;

      @include mq($bp-medium) {
        @include text_large;
        font-weight: 700;
      }
    }
  }

  &__top {
    display: flex;
    flex-direction: column;
    grid-gap: 30px;
    position: relative;


    @include mq($bp-medium) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      grid-gap: 0;
    }
  }

  &__row {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    grid-gap: 30px;

    @include mq($bp-super-small) {
      flex-direction: row;
      justify-content: space-between;
    }

    @include mq($bp-medium) {
      grid-gap: 120px;
    }
  }

  &__col {
    display: flex;
    flex-direction: column;
  }

  &__phone {
    margin-bottom: 9px;

    @include text_large;
    font-weight: 700;

    @include mq($bp-medium) {
      @include h2;
    }
  }

  &__time {
    display: flex;
    align-items: center;
    grid-gap: 10px;

    color: var(--grayText);
    @include text_normal;
    font-weight: 600;

    @include mq($bp-medium) {
      @include text_big;

      padding-left: 4px;
    }
  }

  &__block {
    display: flex;
    flex-direction: column;

    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__title {
    margin-bottom: 20px;

    color: var(--grayText2);
    font-weight: 500;

    @include text_big;
    font-size: 20px;

    @include mq($bp-medium) {
      @include text_large;
      font-size: 20px;
      font-weight: 500;
    }
  }

  &__apps {
    display: flex;
    grid-gap: 20px;

    @include mq($bp-super-small) {
      flex-direction: row;
      align-items: flex-start;
      grid-gap: 30px;
    }

    @include maq(410px) {
      margin-left: -30px;
    }
  }

  &__socials {
    display: flex;
    align-items: center;
    grid-gap: 40px;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 30px;
    padding-top: 16px;

    border-top: 1px solid #D9D9D9;

    @include mq($bp-medium) {
      margin-top: 50px;
      padding-top: 22px;
    }

    .lf-copyright {
      display: flex;
      gap: 10px;
      flex-wrap: nowrap;
      align-items: center;
      @include text_normal;
    }
  }

  &__copy {
    color: var(--grayText);

    @include text_small;

    @include mq($bp-medium) {
      //@include text_big;
      @include text_normal;
    }
  }

  //&__to-top {
  //  flex: 0 0 auto;
  //
  //  display: flex;
  //  align-items: center;
  //  justify-content: center;
  //
  //  width: 44px;
  //  height: 44px;
  //  background: var(--orange);
  //  border-radius: 50%;
  //
  //  position: absolute;
  //  bottom: 70px;
  //  right: 15px;
  //
  //  .ui-icon {
  //    transform: rotate(-90deg);
  //    ::v-deep svg path{
  //      fill: var(--white);
  //    }
  //  }
  //}
}

.info-menu {
  display: grid;
  

  &--double {
    grid-template-columns: repeat(2, 1fr);
  }

  &__link {
    padding: 13px 5px 13px 30px;

    border-bottom: 1px solid #F5F4F2;

    &:hover {
      border-color: #F2A32C;
    }

    display: block;

    @include text_small;
    
    font-weight: 600;
    font-size: 16px;
  }
}

.info-app {
  display: flex;
  align-items: center;
  grid-gap: 15px;
  max-width: 177px;
  width: 100%;
  padding: 5px 20px;

  background: var(--white);
  border-radius: 14px;



  &__content {
    display: flex;
    flex-direction: column;
  }

  &__label {
    @include text_mini;
  }

  &__value {
    @include text_normal;
    font-weight: 600;

    white-space: nowrap;
  }
}
</style>