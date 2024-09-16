<template>
  <ModalsOverlay
    :is-show="isShow"
    @close="close()"
  >
    <div class="slider-navigation" v-if="initialSlide !== undefined && initialSlide >= 0 && !elseProductOpened && !cartProductSelectedSupplements && !isGroupVariable">
      <div
        id="slider-arrow-product-modal--prev"
        class="index-menu__arrow index-menu__arrow--prev"
      >
        <UIIcon name="arrow" />
      </div>
      <div
        id="slider-arrow-product-modal--next"
        class="index-menu__arrow index-menu__arrow--next"
      >
        <UIIcon name="arrow" />
      </div>
    </div>

    <div class="modal-product-header">
      <button
        type="button"
        class="modal-product-header__close"
        @click.prevent="closeModal()"
      >
        <UIIcon name="arrow" />
      </button>

      <p class="modal-product-header__title">
        {{ headerTitle || 'Категория' }}
      </p>
    </div>

    <div class="content content-swiper">
      <ModalsProductSlide v-if="isGroupVariable" :isNoSlider="true" :item="product" @close="closeModal" />

      <ModalsProductSlide v-else-if="elseProductOpened" :isNoSlider="true" :isOpenedFromCart="isOpenedFromCart" :cartProductSelectedSupplements="cartProductSelectedSupplements" :item="product" @close="closeModal" />

      <Swiper v-else-if="initialSlide !== undefined && initialSlide >= 0 && !cartProductSelectedSupplements"
        :modules="[Navigation, Pagination]"
        pagination
        :slides-per-view="1"
        :spaceBetween="5"
        :navigation="{
          prevEl: `#slider-arrow-product-modal--prev`, 
          nextEl: `#slider-arrow-product-modal--next`, 
        }"
        :initialSlide="initialSlide"
        class="index-menu__slider modal-product-slider"
        id="modal-product-slider"
        @swiper="onSwiperInit"
        @slideChange="onSlideChange"
      >
  
        <SwiperSlide
          v-for="slide in productsForSlider"
          :key="slide.id"
          class="product-modal-slide index-menu__slide"
          :id="`product-modal__slide-${slide.id}`"
        >
          <ModalsProductSlide 
          :item="slide"
          @close="closeModal"
          @variableChanged="changeHeightForVariable"
          />
        </SwiperSlide>
  
      </Swiper>
      
      <ModalsProductSlide v-else :item="product" :isNoSlider="true" :isOpenedFromCart="isOpenedFromCart" :cartProductSelectedSupplements="cartProductSelectedSupplements" @close="closeModal" />
    </div>

  </ModalsOverlay>
</template>

<script setup>
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

const domSlider = ref();

const activeSlideId = ref();

const catalogStore = useCatalogStore()
const currentCategory = computed(() => catalogStore.currentCategory);
const cart = useCartStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const commonStore = useCommonStore()
const facade = computed(() => commonStore.getFacade);

const { categories, selectedProduct, relatedItems, isProductFavorite, uncategorizedProducts, subCategories, currentSubCategoryId, elseProductOpened, isOpenedFromCart, cartProductSelectedSupplements } = storeToRefs(catalogStore)
const { productInCart } = storeToRefs(cart)

const currentSubCategory = computed(() =>
  subCategories?.value?.find((sub) => sub.id === currentSubCategoryId.value)
);

const currentSubSub = computed(() => {
  return currentSubCategory?.value?.subCategories?.find((sub) => sub.id === currentSubSubCatId.value)
})

currentSubCategoryId.value = Number(route.params.subcategory);
const currentSubSubCatId = ref(null);

const swiperInstance = ref(null)
const productsForSlider = ref();

const isShow = ref(true)
const isMobileOrTablet = computed(() => commonStore.isMobileOrTablet)
const isShowSupplementsModal = ref(false) // Модалка для добавок
const currentSupplement = ref(null) // выбранная категории добавок
const currentSupplementKey = ref(null) // ключ выбранной категории добавок
const selectedSupplements = ref({}) // Все выбранные добавки
const variations = ref([])
const currentVariableIdx = ref([0, 0])
const isHeightBigger = ref(false);

const headerTitle = ref('');

const supplement = ref([])
const isSingleSupplementSelected = ref(false);
const currentIdForSlide = ref();
const swipeElement = ref();

const modalBox = ref(null);

const onSwiperInit = (swiper) => {
  domSlider.value = document.querySelector('.modal-product-slider');

  swiperInstance.value = swiper;

  let slide = swiper.slides[swiper.activeIndex];

  // if (isMobileOrTablet.value) {
  //   let addition = slide.children[0].offsetHeight > domSlider.value.offsetHeight ? (slide.children[0].offsetHeight - domSlider.value.offsetHeight) / 2 : 0

  //   domSlider.value.style.height = `${slide.children[0].offsetHeight + addition + 35}px`;
  // }

  activeSlideId.value = +slide.id.match(/\d+$/)[0];

  commonStore.activeProductModalSlide = activeSlideId.value;

  let currentProd = productsForSlider.value.find(item => item.id === activeSlideId.value)

  useHead({
    title: currentProd.seo_data.seo_title,
  })
};

const onSlideChange = (swiper) => {
  nextTick(() => {
    domSlider.value = document.querySelector('.modal-product-slider');
  
    let slide = swiper.slides[swiper.activeIndex];
  
    // console.log('dom slider height:' + domSlider.value.offsetHeight);
    // console.log('slide children height: ' + slide.children[0].offsetHeight);
    // console.log('slide height: ' + slide.offsetHeight);
  
    if (isMobileOrTablet.value) {
      let addition = slide.children[0].offsetHeight > domSlider.value.offsetHeight ? (slide.children[0].offsetHeight - domSlider.value.offsetHeight) / 2 : 0
  
      // domSlider.value.style.height = `${(slide.children[0].offsetHeight > slide.offsetHeight ? slide.children[0].offsetHeight : slide.offsetHeight) + addition}px`;

      domSlider.value.style.height = `${slide.children[0].offsetHeight + 50}px`;
    }
  
    // console.log(slide.children[0].offsetHeight);
    // console.log('----- dom slider after height:' + domSlider.value.offsetHeight);
  
    activeSlideId.value = +slide.id.match(/\d+$/)[0];
  
    commonStore.activeProductModalSlide = activeSlideId.value;
  
    let currentProd = productsForSlider.value.find(item => item.id === activeSlideId.value)
  
    window.history.replaceState(null, '', `/menu${currentProd.url}`);
  
    useHead({
      title: currentProd.seo_data.seo_title,
    })
  })
};

const changeHeightForVariable = () => {
  onSlideChange(swiperInstance.value);
}

const product = computed(() => {

  if (parentProduct.value?.id && parentProduct.value?.id !== undefined && parentProduct.value?.id !== selectedProduct.value().id) {
    return selectedProduct.value(parentProduct.value?.id);
  }

  return selectedProduct.value()
})

const parentProduct = ref();

const initialSlide = computed(() => {
  let temp = productsForSlider.value?.findIndex(item => item.id === currentIdForSlide.value);

  return temp;
})

const productType = computed(() => {
  return product.value.type
})
const isGroupVariable = ref(productType.value === 'group_variable');
// <!-- Methods -->
const getProductsForModal = () => {
  let products = undefined;

  // if (currentSubCategory.value) {
  //   if (currentSubSub.value) {
  //     let subIds = currentSubCategory.value.subCategories.map(item => item.id)
  //     let currentSubSubId = subIds.find(id => parentProduct.value.categories.includes(id))

  //     let currentSubSub = currentSubCategory.value.subCategories.find(item => +item.id === +currentSubSubId)

  //     headerTitle.value = currentSubSub.name;

  //     products = currentSubSub.products;
  //   }
  //   else {
  //     headerTitle.value = currentSubCategory.value.name;
  //     products = currentSubCategory.value.products;
  //   }
  // }
  // else {
  //   headerTitle.value = currentCategory?.value?.name;
  //   products = currentCategory?.value?.products;
  // }

  if (products == undefined) {
    let urlCurrentCat = getSecondToLastParam(catalogStore.selectedProductUrl);
  
    let current = catalogStore.filteredCatalog.find(item => item.slug === urlCurrentCat);


    headerTitle.value = current.name;

    products = current.products;
  }

  productsForSlider.value = products;

  return products;
}

function getSecondToLastParam(url) {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

watch(() => route.query, () => {
  currentIdForSlide.value = +selectedProduct.value().id;

  if (productType.value === 'variable') {
    currentVariableIdx.value = new Array(product.value.attributes.length).fill(0)
  } else if (productType.value === 'group_variable' ) {
    const variationsArray = product.value.variations

    if (variationsArray.length) {
      variations.value = variationsArray

      let activeId = variationsArray.find(item => item.default)?.product || null
      if (!activeId) {
        activeId = variationsArray[0].product
      }

      // catalogStore.setProduct(activeId)
    }
  }
  else {
    variations.value = [];
  }
})


const closeModal = () => {
  router.push({ query: {} });
  document.body.classList.remove('overflow-hidden')
  isShow.value = false

  catalogStore.selectedProductUrl = null;

  catalogStore.isOpenedFromCart = false;
  catalogStore.cartProductSelectedSupplements = null;


  if (elseProductOpened.value) {
    catalogStore.elseProductOpened = false;
  }
}

const close = () => {
  catalogStore.setProduct(null)
  document.body.classList.remove('overflow-hidden')
  router.push({ query: {} });

  useHead({
    title: commonStore.allSettings.seo.name,
  })

  catalogStore.selectedProductUrl = null;

  catalogStore.isOpenedFromCart = false;
  catalogStore.cartProductSelectedSupplements = null;

  if (elseProductOpened.value) {
    catalogStore.elseProductOpened = false;
  }
}

const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
}

onMounted(() => {
  parentProduct.value = product.value;
  currentSubSubCatId.value = +route.params.subcat

  if (productType.value === 'variable') {
    currentVariableIdx.value = new Array(product.value.attributes.length).fill(0)
  } else if (productType.value === 'group_variable' ) {
    const variationsArray = product.value.variations

    if (variationsArray.length) {
      variations.value = variationsArray

      let activeId = variationsArray.find(item => item.default)?.product || null
      if (!activeId) {
        activeId = variationsArray[0].product
      }

      // catalogStore.setProduct(activeId)
    }
  }

  nextTick(() => {
    modalBox.value = document.querySelector('.modal__box');
    
    let products = getProductsForModal();

    window.addEventListener('keydown', handleEscKey);

    if (modalBox.value && isMobileOrTablet.value) {
      modalBox.value.addEventListener('touchstart', handleTouchStart);
      modalBox.value.addEventListener('touchmove', handleTouchMove);
      modalBox.value.addEventListener('touchend', handleTouchEnd);
    }

    productsForSlider.value = products;

    currentIdForSlide.value = +parentProduct.value.id;

  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);

  if (modalBox.value && isMobileOrTablet.value) {
    modalBox.value.removeEventListener('touchstart', handleTouchStart);
    modalBox.value.removeEventListener('touchmove', handleTouchMove);
    modalBox.value.removeEventListener('touchend', handleTouchEnd);
  }
})

let startY = 0
let startX = 0
let movedY = 0
let movedX = 0
const minDistance = 100 
let isAtTop = false

const handleTouchStart = (event) => {
  startY = event.touches[0].clientY
  startX = event.touches[0].clientX
  isAtTop = modalBox.value.scrollTop === 0
}

const handleTouchMove = (event) => {
  if (!isAtTop) return

  movedY = event.touches[0].clientY - startY
  movedX = event.touches[0].clientX - startX
  if (Math.abs(movedX) > Math.abs(movedY)) {
    movedY = 0
    movedX = 0
    return
  }
  if (movedY > 0) {
    event.preventDefault() // предотвращаем стандартное поведение прокрутки
  } 
}

const handleTouchEnd = () => {
  if (!isAtTop) return

  if (movedY > minDistance) {
    closeModal()
  }
  movedY = 0
  movedX = 0
  isAtTop = false
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
}
.index-menu__slide {
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  margin: auto;
  max-width: 1070px;

  @include maq($bp-small) {
    max-width: none;
    max-height: none;

    overflow-y: hidden;
    margin: 0;

    width: 100vw !important;
    // height: min-content;
  }
}
.index-menu__slider {
  max-width: 1070px;
  overflow: hidden;

  @include maq($bp-small) {
    max-width: none;
    margin: 0;
    width: 100vw !important;
    // height: min-content;
  }
}
::v-deep(.swiper-pagination) {
  @include mq($bp-small) {
    display: none;
  }

  position: absolute;
  top: 0px;
  bottom: auto;
  left: 0px;
  right: 0px;
  z-index: 999;
  padding-right: 10px;
  padding-left: 10px;

  display: flex;
  width: 100%;
  justify-content: space-between; 

  .swiper-pagination-bullet {
    flex: 1;
    margin: 0 3px; 
    height: 3px; 
    border-radius: 0;
    background: var(--blue);

    &.swiper-pagination-bullet-active {
      background: var(--orange);
    }
  }
}
::v-deep(.modal__box) {
  transition: opacity 0.3s ease;

  &.transparent {
    opacity: 0.8; 
  }
}
::v-deep(.modal__content) {
  position: unset;
  @include maq($bp-small) {
    background: var(--grayBg);
  }
}

::v-deep(.modal__wrap) {
  position: relative;
  max-width: 1070px;
  width: 100%;
  margin: auto;
}

.slider-navigation {
  @include maq($bp-small) {
    display: none;
  }

  & > .index-menu__arrow {
    background: var(--white);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;

    &.swiper-button-disabled {
      display: none;
    }

    ::v-deep svg path {
      fill: var(--black);
    }
  }
  
  & > .index-menu__arrow--next {
    right: -30px;

    @include maq($bp-big) {
      right: 0;
    }
  }
  & > .index-menu__arrow--prev {
    left: -30px;

    @include maq($bp-big) {
      left: 0;
    }
  }
}

.modal-product-header {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--grayBg);

  padding: 16px 10px 40px;

  @include mq($bp-small) {
    display: none;
  }
  @include maq($bp-small) { 
    overflow-x: auto;
    padding-bottom: 25px;
  }

  &__close {
    position: fixed;
    left: 20px;
    top: 16px;
    
    width: 50px;
    height: 50px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--white);
    border-radius: 50%;
    box-shadow: 0px -2px 80px 0px rgba(0, 0, 0, 0.20);

    z-index: 10000;

    ::v-deep(.ui-icon) svg {
      width: 30px;
      height: 30px;
      transform: rotate(90deg);

      path {
        fill: var(--blackText3);
      }
    }
  }

  &__title {
    @include h2;
    text-align: center;

    @include maq($bp-small) {
      max-width: 530px;

      justify-content: center;
      text-align: center;
      overflow-x: auto;
      overflow-y: hidden;
    }

    @include maq(620px) {
      white-space: nowrap;
      text-wrap: nowrap;
      
      max-width: 400px;
    }
    @include maq(472px) {
      max-width: 340px;
    }
    @include maq(442px) {
      max-width: 340px;
    }
  }
}
</style>