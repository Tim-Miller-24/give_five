<template>
  <div class="app">
    <NuxtLayout name="default">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const commonStore = useCommonStore();
const catalogStore = useCatalogStore();

const route = useRoute();
const router = useRouter();

const { lounges, pickupLocations } = storeToRefs(commonStore);
const { isShowProductModal, baseUrl } = storeToRefs(catalogStore);

await commonStore.loadSettings();
catalogStore.getCatalog();

const setWindowStore = () => {
  // commonStore.isMobile = window.innerWidth < 700;

  commonStore.setIsMobileOrTablet(window.innerWidth < 700);
  commonStore.isTablet = window.innerWidth < 992 && window.innerWidth >= 768;

  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};

useHead({
    link: [
      { rel: "stylesheet", href:"https://unpkg.com/zuck.js/dist/zuck.css" }, 
      { rel: "stylesheet", href:"https://unpkg.com/zuck.js/dist/skins/snapgram.css" }
    ],
    meta: [
      { name: "title", content: 'Дай пять!'},
      { name: "description", content: 'Дай пять! Онлайн меню'},
      { name: "keywords", content: 'Дай пять!'},
    ],
  });


onMounted(() => {
  setWindowStore();
  
  if (!commonStore.selectedLocation) {
    useChangeLocation('pickup', pickupLocations.value('pickup')[0]);
  }

  commonStore.getDeliveryTimes();
})

watch(isShowProductModal, val => {
  if (!val) {
    if (baseUrl.value) {
      window.history.replaceState(null, '', baseUrl.value);
      return;
    } else {
      const pre = route.matched[0].path;
      const basePath = pre.split(':')[0];
      const uri = route.name === 'menu-categories-subcategory-product'
          ? `${route.params.categorySlug}/${route.params.subCategorySlug}` : `${route.params.categorySlug || ''}`;
      router.replace({path: `${basePath}${uri || ''}`});
    }
  }
});


commonStore.getPickups();

commonStore.getMenu();

commonStore.getBanners();

commonStore.getContacts();

</script>