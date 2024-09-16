<template>
  <div>
    <div class="index-catalog__title">
      <NuxtLink to="/">
        <UIIcon class="ui-icon" name="arrow-left" />
      </NuxtLink>
      <h3>На главную</h3>
    </div>
    <main class="index">
      <PagesIndexMenu v-if="isTemplates === 'lending_cat' || isTemplates === 'lending'" />
      <!-- <CategoriesPage v-else-if="isTemplates === 'cat1' || isTemplates === 'cat2' || isTemplates === 'cat12'" /> -->
      <section id="seo-14" class="kd-seo">
        <h1 class="ttl"><span>{{ h1Title }}</span></h1>
        <div class="txt" v-if="h1Text" v-html="h1Text"></div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useFavicon } from "@vueuse/core";

const route = useRoute();
const { slug } = route.params;


const catalogStore = useCatalogStore();
const commonStore = useCommonStore();

const { currentCategoryId, currentSubCategoryId, catalog, productSlug, slugProduct } = storeToRefs(catalogStore);
currentCategoryId.value = 0;

currentSubCategoryId.value = 0;
const isTemplates = computed(() => commonStore.facade?.catalog_front);

if (slug) {
  productSlug.value = slug;
}

const title = commonStore?.titleDescription?.name ?? "";
const description = commonStore?.titleDescription?.description ?? "";

const h1Title = computed(() => commonStore.allSettings?.seo?.home_h1 || '');
const h1Text = computed(() => commonStore.allSettings?.seo?.home_h1_text || '');

const LogoFavicon = computed(() => commonStore.allSettings?.logo?.gr_favicon_site?.favicon_png || '')

const appName = ref(title);

provide("main", { appName });
useSeoMeta({
  title: commonStore.allSettings?.seo?.name || `${appName.value} - ${title}`,
  ogTitle: commonStore.allSettings?.seo?.name || `${appName.value} - ${title}`,
  description: commonStore.allSettings?.seo?.description || '',
  keywords: commonStore.allSettings?.seo?.keywords || '',
  ogDescription: commonStore.allSettings?.seo?.description || '',
  ogImage: commonStore.allSettings?.seo?.seo_keywords || '',
  link: [{ rel: "icon", type: "image/x-icon", href: `${commonStore.allSettings?.logo?.gr_favicon_site?.favicon_png || ''}` }]
})

useFavicon(LogoFavicon.value, {
  rel: 'icon'
})
</script>

<style lang="scss" scoped>
.kd-seo {
  width: 100%;
  padding: 2rem 1rem;
  background: var(--mainBg);

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1.4;
    color: inherit;
    text-rendering: optimizeLegibility;
  }

  ::v-deep h2 {
    font-size: 1.25rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1.4;
    color: inherit;
    text-rendering: optimizeLegibility;
  }

  ::v-deep p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }

  ::v-deep ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
}

.index-catalog {
  position: relative;

  &__title {
    display: flex;

    align-items: center;

    position: relative;

    &>h3 {
      font-size: 20px;
      color: var(--white);

      position: absolute;

      text-transform: uppercase;

      text-wrap: nowrap;

      top: 2px;
      left: 50%;

      transform: translateX(-50%);
    }

    .ui-icon {
      background: #FFFFFF4D;
      border: 1px solid #FFFFFF4D;

      min-width: 35px;
      min-height: 35px;

      border-radius: 50%;

      display: flex;
      align-items: center;
      justify-content: center;

      :deep svg path {
        fill: var(--white);
      }
    }
  }
}

.index {
  padding: 0px 0 60px;
  padding: 20px 0;
  background: var(--mainBg);

  &__banners,
  &__brands {
    margin-bottom: 30px;

    @include mq($bp-small) {
      margin-bottom: 60px;
    }
  }
}
</style>