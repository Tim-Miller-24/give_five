<template>
    <div class="active-order" v-if="activeOrders?.length > 0">
        <ModalsActiveOrderVariant v-if="!isMobileOrTablet" v-for="(item, i) in activeOrders" :key="i" :order="item" :index="i" />
        <ModalsActiveOrderVariant v-else :order="activeOrders[activeOrders.length - 1]" :index="(activeOrders.length - 1)" />
    </div>
</template>

<script lang="ts" setup>
const catalogStore = useCatalogStore();
const commonStore = useCommonStore();

const { isMobileOrTablet } = storeToRefs(commonStore);

const activeOrders = computed(() => catalogStore.activeOrders);

</script>

<style lang="scss" scoped>
.active-order {
    display: flex;
    flex-direction: column;
    gap: 10px;

    @include maq($bp-small) {
        position: fixed;
        z-index: 10;

        gap: 5px;

        top: auto;
        bottom: 20px;
        width: calc(100% - 40px);
        left: 50%;
        right: auto;
        transform: translateX(-50%);
    }
}
</style>