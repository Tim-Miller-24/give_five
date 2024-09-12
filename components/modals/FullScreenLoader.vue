<template>
    <div v-if="false" class="modal-loader">
        <UILoader is-big class="loader" />
    </div>
</template>

<script setup lang="ts">
// вырубили за ненадопностью
const catalogStore = useCatalogStore();
const { isShowLoader } = storeToRefs(catalogStore);

</script>

<style lang="scss" scoped>
:deep(.loader) {
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 1001;
}
.modal-loader {
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  
  z-index: 1000;

  background: #4545453c;
  backdrop-filter: blur(1px);
}
</style>