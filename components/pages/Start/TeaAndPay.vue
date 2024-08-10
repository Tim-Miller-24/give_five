<template>
    <div class="block">
        <h4 class="block__title">чаевые и оплата</h4>

        <div class="block__buttons">
            <UIButton color="purple" @click="navigateTo('/tea')"> Оставить чаевые </UIButton>
            <UIButton color="purple" @click="navigateTo('/payments')"> Оплатить счет онлайн </UIButton>
        </div>
    </div>
</template>

<script setup></script>

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

    &__title {
        width: 100%;

        font-family: "Oswald";
        text-transform: uppercase;
        font-size: 500px;
        font-size: 16px;

        text-align: center;

        margin-bottom: 24px;
    }

    &__buttons {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>