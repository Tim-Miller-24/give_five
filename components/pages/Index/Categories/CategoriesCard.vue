<template>
  <NuxtLink class="categories_card" :to="categoryUrl">
    <div class="category__img">
      <UISectionTitle :level="3" :title="data.name" class="categories_card__title"
      :id="`category-title__id-${props.data.id}`" />
      <div v-if="!isLoaded" class="loader" :class="{'min-height': !isLoaded}"></div>
      <img 
      :data-src="cardImage" 
      :key="props.data.id"
      :class="{'min-height': !isLoaded}"
      v-lazy-load 
      @load="isLoaded = true"
      alt="category image"
      />
    </div>
  </NuxtLink>
</template>

<script setup>
const commonStore = useCommonStore();

const isLoaded = ref(false);

const props = defineProps({
  parentCategory: {
    type: Object,
    default: () => ({
      id: 0,
      name: "",
      img: "",
      slug: "slug"
    })
  },
  data: {
    type: Object,
    default: () => ({
      id: 0,
      name: "",
      img: "",
      slug: "slug"
    }),
  },
  isSubcategory: {
    default: false,
    type: Boolean,
  },
});

const route = useRoute();
const router = useRouter();

const pageType = computed(() => commonStore.facade?.catalog_front);

const cardImage = computed(() => {
  return props?.data?.dop_image_category_site 
  ? imageSize(props?.data?.dop_image_category_site, 'medium')
  : imageSize(props?.data?.img, 'medium')
})

onMounted(() => {
  isLoaded.value = true

  nextTick(() => {
    const element = document.getElementById(`category-title__id-${props.data.id}`);

    if (element) {
      if (props?.data?.color_text_category) {
        element.style.color = props?.data?.color_text_category;
      }
  
      element.style.display = props?.data?.visual_name_category ? 'block' : 'none';
    }
  })
})

const categoryUrl = computed(() => {
  if ((pageType.value === 'cat2' || pageType.value === 'cat1') && props.parentCategory?.slug !== undefined) {
    return `/menu/${props.parentCategory.slug}/${props.data.slug}`
  }

  return props.isSubcategory
  ? `/menu/${route.params.categorySlug}/${props.data.slug}` 
  : `menu/${props.data.slug}`;
});

</script>

<style lang="scss" scoped>
.min-height {
  min-height: 395px !important;

  @include maq($bp-bigger) {
    min-height: 290px !important;
  }
  @include maq($bp-big) {
    min-height: 260px !important;
  }
  @include maq($bp-medium) {
    min-height: 230px !important;
  }
  @include maq($bp-small) {
    min-height: 200px !important;
  }
  @include maq($bp-small-medium) {
    min-height: 170px !important;
  }
  @include maq($bp-super-small) {
    min-height: 140px;
  }
  @include maq($bp-extra-small) {
    min-height: 110px;
  }
}
.loader {
  width: 100%;
  position: absolute;
  background: linear-gradient(90deg, #f9f9f9, #e1e0e0, #f9f9f9);
  background-size: 200% 200%;
  animation: grey-shimmer 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

@keyframes grey-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.categories_card {
  background-color: black;
  border-radius: 20px;
  position: relative;
  height: 100%;
  overflow: hidden;

  @include bp($point_2) {
    border-radius: 20px;
  }

  @include maq($bp-super-small) {
    min-width: 150px;
  }

  &__title {
    z-index: 1;
    position: absolute;
    top: 10%;
    left: 10%;

    @include bp($point_2) {
      font-size: 20px;
    }
  }

  :hover {
    cursor: pointer;
  }
}

.category__img {
  position: relative;
  width: 100%;
  height: 212px;
  min-height: auto;
  z-index: 0;

  @include mq($bp-small) {
    height: auto;
  }

  @include maq($bp-small) {
    height: unset;
    min-height: 120px;
  }

  img {
    width: 100%;
    object-fit: cover;
    border-radius: 20px;

    @include bp($point_2) {
      border-radius: 20px;
    }
  }
}
</style>
