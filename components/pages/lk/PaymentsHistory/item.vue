<template>
    <div class="item">
        <UIIcon name="arrow-down" class="toggle-button" @click="toggleContent" :class="{ 'collapsed': !isOpen }" />

        <h3 class="item__date">4 апреля 2024</h3>

        <div :class="['item__content', { 'collapsed': !isOpen }]">
            <div class="item__content-header">
                <p class="item__title">Urban Oasis Grill</p>
                <p class="item__address">Москва, проспект Победы 35</p>
            </div>

            <div class="item__products">
                <div class="item__product">
                    <p class="item__product-name">Цезарь с курицей</p>
                    <p class="item__product-price">500 руб.</p>
                </div>
                <div class="item__product">
                    <p class="item__product-name">Цезарь с курицей</p>
                    <p class="item__product-price">500 руб.</p>
                </div>
                <div class="item__product">
                    <p class="item__product-name">Цезарь с курицей</p>
                    <p class="item__product-price">500 руб.</p>
                </div>
                <div class="item__product">
                    <p class="item__product-name">Цезарь с курицей</p>
                    <p class="item__product-price">500 руб.</p>
                </div>
            </div>
        </div>

        <p class="item__endPrice">5 940 рублей</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    }
})

const isOpen = ref(props.active);

const toggleContent = () => {
    isOpen.value = !isOpen.value;
};
</script>

<style lang="scss" scoped>
.item {
    position: relative;

    background: #EBEBEB33;

    border-radius: 8px;

    padding: 16px;

    font-family: 'Overpass';

    &__date {
        font-size: 12px;
        font-weight: 400;
    }

    &__content {
        margin-top: 8px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        margin-bottom: 8px;

        max-height: 1000px;

        // transition: max-height 0.5s ease; работает с задержкой

        &.collapsed {
            max-height: 0;
        }
    }

    &__title {
        font-weight: 600;
        font-size: 14px;
    }

    &__address {
        font-weight: 600;
        font-size: 14px;
    }

    &__products {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    &__product {
        font-size: 12px;
        font-weight: 400;

        display: flex;
        justify-content: space-between;
        width: 100%;

        padding-right: 30px;
    }


    &__endPrice {
        font-family: 'Oswald';
        font-size: 16px;
        font-weight: 500;
    }
}

.toggle-button {
    position: absolute;
    top: 16px;
    right: 16px;

    transform: rotate(-180deg);
    
    &.collapsed {
        transform: rotate(0);
    }

    :deep svg path {
        fill: var(--white);
    }
}
</style>