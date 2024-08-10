<template>
    <div class="block">
        <div class="block__header">
            <h4 class="block__title">Личный кабинет</h4>
            <p class="block__subTitle">Войдите в личный кабинет для доступа к</p>
        </div>

        <div class="block__icons">
            <div class="block__item">
                <UIIcon name="buy-crypto" />
                <p class="block__name">Бонусам</p>
            </div>
            <div class="block__item">
                <UIIcon name="ticket-discount" />
                <p class="block__name">Промокодам</p>
            </div>
            <div class="block__item">
                <UIIcon name="wi-fi" class="wifi" />
                <p class="block__name">Wi-Fi</p>
            </div>
            <div class="block__item">
                <UIIcon name="book" />
                <p class="block__name">Меню</p>
            </div>
        </div>

        <UIButton class="block__button" color="gray2" @click="navigateTo('/lk')">Войти в личный кабинет</UIButton>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.block {
    position: relative;

    background: #EBEBEB33;
    border: 1px solid #FFFFFF0D;

    border-radius: 12px;

    padding: 24px;

    font-family: 'Overpass';

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    gap: 24px;

    &__header {
        display: flex;
        flex-direction: column;
        width: 100%;

        gap: 8px;
    }

    &__title {
        width: 100%;

        font-family: "Oswald";
        text-transform: uppercase;
        font-size: 500px;
        font-size: 16px;

        text-align: center;
    }

    &__subTitle {
        font-family: 'Overpass';
        font-size: 12px;
        font-weight: 400;

        text-align: center;

    }

    &__icons {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    &__item {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        gap: 8px;

        :deep(.ui-icon) svg path {
            fill: var(--white);

            height: 25px;
        }
        :deep(.ui-icon) {
            height: 25px;
        }
        :deep(.ui-icon) svg {
            height: 25px;
        }
    }

    &__name {
        font-family: 'Overpass';
        font-size: 12px;
        font-weight: 400;
        text-align: center;
    }

    &__button {
        width: 100%;
    }
}

.wifi {
    :deep svg path {
        fill: none !important;
    }
}
</style>