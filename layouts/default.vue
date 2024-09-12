<template>
    <div class="layout-default">
        <div class="container layout-content">
            <MainHeader :extra-class="headerExtraClass" />

            <slot />

            <LayoutFooter v-if="route.name === 'index'" />
        </div>

        <LazyModalsProduct v-if="catalogStore.isShowProductModal" />
    </div>
</template>

<script setup lang="ts">
const catalogStore = useCatalogStore();
const route = useRoute();

const headerExtraClass = computed(() => route.name === 'index' ? 'index' : '')
</script>

<style lang="scss" scoped>
.layout-default {
    padding-top: 110px;

    max-width: 768px;
    width: 100%;

    margin: auto;
}
</style>