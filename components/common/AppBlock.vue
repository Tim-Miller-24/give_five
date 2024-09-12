<template>
  <div class="app-block" :class="{'pb40': !'index'.includes(route.name)}" v-if="infoBlock && infoBlock.footer_infoblock_app_exists">
    <div class="container">
      <div class="app-block__main__w">
        <div class="app-block__main">
          <div class="app-block__img">
            <img :data-src="imageSize(infoBlock.footer_infoblock_image, 'large')" v-lazy-load
            :src="imageSize(infoBlock.footer_infoblock_image, 'large')"
            loading="lazy"
            alt="" />
          </div>
          <div class="app-block__content">
            <SectionTitle :level="2" :title="infoBlock.footer_infoblock_title" />
            <div class="app-block__content-box">
              <div class="app-block__info">
                <ul class="app-block__services">
                  <li v-for="(item, i) in infoBlock.footer_infoblock_list" :key="'app-services-item-' + i">
                    {{ item }}
                  </li>
                </ul>
                <ul class="app-block__links">
                  <li class="app-block__link">
                    <a :href="infoBlock.footer_infoblock_app_link_ios" target="_blank">
                      <div class="app-blockItem__img">
                        <img src="~/assets/images/apple_white.png" alt="apple" />
                      </div>
                      <div class="app-blockItem__content">
                        <span>Загрузите в</span>
                        <p>App Store</p>
                      </div>
                    </a>
                  </li>
                  <li class="app-block__link">
                    <a :href="infoBlock.footer_infoblock_app_link_android" target="_blank">
                      <div class="app-blockItem__img">
                        <img src="~/assets/images/google_white.png" alt="google" />
                      </div>
                      <div class="app-blockItem__content">
                        <span>Доступно в</span>
                        <p>Google Play</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="qr-block" v-if="!isMobileOrTablet">
                <div class="qr-block__img">
                  <img :data-src="imageSize(infoBlock.footer_infoblock_qr_code_image, 'large')" v-lazy-load 
                  :src="imageSize(infoBlock.footer_infoblock_image, 'large')"
                  loading="lazy"
                  alt="" />
                </div>
                <p>
                  Наведите камеру телефона и перейдите по ссылке, чтобы установить
                  приложение
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SectionTitle from "../UI/SectionTitle.vue";
import imageSize from '@/utils/imageSize'

const route = useRoute();

const commonStore = useCommonStore();

const isMobileOrTablet = computed(() => commonStore.isMobileOrTablet)

const infoBlock = computed(() => commonStore.footerInfoblock);

onMounted(() => {
 // console.log(infoBlock.value.footer_infoblock_qr_code_image);
})
</script>

<style lang="scss" scoped>
.pb40 {
  padding-bottom: 40px;
}
ul {
  list-style-type: none !important;
  padding-inline-start: 0px !important;
}
p {
  margin-block-start: 0 !important;
  margin-block-end: 0 !important;
}
.app-block__main__w {
  @include bp($point_2) {
    padding: 0;
  }
}
.app-block__main {
  background-color: var(--grayBg2);
  border-radius: 40px;

  display: flex;
  align-items: end;
  justify-content: center;

  gap: 40px;

  margin-left: 90px;
  margin-right: 90px;

  @include maq($bp-big) {
    margin-left: 40px;
    margin-right: 40px;
  }

  @include bp($point_2) {
    margin: 0;
    padding: 40px 20px 0 20px;
    flex-direction: column;

    gap: 0;
  }

  @include maq(420px) {
   margin-left: -20px;
   margin-right: -20px; 
  }
}

.app-block__content {
  padding-top: 70px;
  padding-right: 50px;
  padding-bottom: 50px;
  flex: 1;

  @include maq($bp-big) {
    padding-right: 30px;
  }

  @include bp($point_2) {
    padding: 0;
    order: 0;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;

    & > .app-block__content-box {
      display: flex;
      justify-content: space-between;
    }
  }
}

.app-block__links {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 80px;
  @include bp($point_2) {
    flex-direction: column;
    order: 0;
    margin: 32px 0 45px 0;
    align-items: flex-start;
  }
}
.app-block__link {
  max-width: 190px;
  width: 100%;

  @include maq(415px) {

  }

  .app-blockItem__img {
    @include bp($point_2) {
      order: 0;
      width: 22px;
      height: 22px;
      @include flex-center;
    }
  }
  .app-blockItem__content {
    @include bp($point_2) {
      order: 1;
      margin-top: -8px;
    }
  }
  a {
    background-color: var(--blackText3);
    display: flex;
    align-items: center;
    color: var(--white);
    padding: 8px 20px;
    border-radius: 14px;
    @include bp($point_2) {
      padding: 8px 20px;
    }

    @include maq($bp-super-small) {
      padding: 8px 15px;
    }
    span {
      font-size: 12px;
      @include bp($point_2) {
        font-size: 10px;
        display: inline-block;
      }

      @include maq($bp-super-small) {
        font-size: 9px;
      }
    }

    p {
      font-weight: 600;
      line-height: 110%;
      @include bp($point_2) {
        font-size: 12px;
        margin-top: -2px;
      }

      @include maq($bp-super-small) {
        font-size: 10px;
      }
    }
  }
}

.app-blockItem__img {
  margin-right: 15px;
  @include bp($point_2) {
    order: 2;
  }
}

.app-block__services {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  grid-gap: 12px 30px;
  max-width: 450px;
  padding: 24px 0 40px 0;
  font-weight: 500;
  @include bp($point_2) {
    display: inline-flex;
    flex-direction: column;
    order: 1;
    margin: 32px 0 45px 0;
    padding: 0;
    gap: 8px;
  }
  li {
    position: relative;
    padding-left: 13px;
    @include bp($point_2) {
      font-size: 14px;
    }

    @include maq($bp-super-small) {
      font-size: 12px;
    }
    &:before {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      width: 5px;
      height: 5px;
      content: "";
      background-color: var(--blackText3);
      opacity: 0.3;
      border-radius: 100%;
    }
  }
}

.qr-block {
  display: flex;
  align-items: flex-end;
  @include bp($point_2) {
    order: 2;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // width: 100%;
  }
  p {
    padding-bottom: 20px;
    color: var(--grayText);
    max-width: 316px;
    font-weight: 500;
    @include bp($point_2) {
      font-size: 14px;
      text-align: center;
      padding-bottom: 40px;
    }
  }
}

.qr-block__img {
  margin-right: 20px;
  max-width: 180px;
  @include bp($point_2) {
    margin: 0 0 20px 0;
    max-width: 180px;
  }
  
  & > img {
    height: auto;
  }
}

.app-block__img {
  flex: 1;

  display: flex;
  align-items: end;

  @include bp($point_2) {
    order: 2;
    overflow: hidden;
    justify-content: center;
    width: 100%;
  }

  @include maq(420px) {
    
  }

  & > img {
    padding-top: 80px;
    padding-left: 70px;
    object-fit: cover;

    min-height: 500px;

    @include maq($bp-big) {
      padding-top: 0;
      min-height: 400px;
    }
    @include bp($point_2) {
      padding-left: 0;
    }
    @include maq(420px) {
      border-bottom-left-radius: 40px;
      border-bottom-right-radius: 40px;
    }
  }
}

.app-block__info {
  @include bp($point_2) {
    display: flex;
    gap: 20px;
  }

  @include maq($bp-super-small) {
    justify-content: space-between;
    gap: 10px;
  }
}
</style>
