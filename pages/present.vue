<template>
    <div class="present">
        <div class="present__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>Подарок другу</h3>
        </div>

        <div class="present__items">
            <PagesPresentItem />

            <PagesPresentItem />

            <PagesPresentItem />
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.sharing {
    position: relative;
    display: flex;
    flex-direction: column;

    gap: 24px;

    font-family: 'Overpass';
    text-align: center;

    &__title {
        text-transform: uppercase;
        font-family: 'Oswald';
        font-weight: 500px;
        font-size: 20px;
    }

    &__subTitle {
        font-size: 12px;
        font-weight: 400;
    }

    &__block {
        background: #EBEBEB33;

        border-radius: 8px;
        padding: 16px;

        font-size: 14px;
    }

    &__button {
        margin-top: 16px;

        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        padding: 9px;
        border-radius: 8px;

        font-size: 14px;

        gap: 8px;

        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;

        &:deep(.ui-icon) {
            background: none;
            border: none;
            min-height: 24px;
            min-width: 24px;
        }
    }

    &__apps {
        display: flex;
        justify-content: space-between;
    }

    &__image-box {
        width: 48px;
        height: 48px;

        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 8px;

        font-size: 14px;

        gap: 8px;

        background: #FFFFFF4D;
        border: 1.5px solid #FFFFFF4D;
    }
}
.present {
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

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
    }
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
</style>