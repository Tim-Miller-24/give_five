<template>
    <div class="thanks">
        <div class="thanks__header">
            <h4 class="thanks__title">Спасибо за ваш отзыв!</h4>
            <p class="thanks__subTitle">Отзывы клиентов позволяют улучшать качество нашего продукта и сервиса.</p>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.thanks {
    width: 100%;
    text-align: center;
    font-family: 'Overpass';

    display: flex;
    flex-direction: column;
    gap: 24px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__title {
        font-weight: 500;
        font-family: 'Oswald';
        font-size: 16px;

        text-transform: uppercase;
    }

    &__subTitle {
        font-size: 12px;
    }
}
</style>