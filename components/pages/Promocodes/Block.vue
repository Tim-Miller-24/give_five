<template>
    <div class="block">
        <div class="block__header">
            <h3 class="block__title">10% на доставку</h3>
    
            <p class="block__subTitle">Скидка 10% на доставку от 3 000 рублей</p>
        </div>

        <div class="block__buttons">
            <div class="block__button" @click="emits('qrSelected')">
                <p>QR код</p>

                <UIIcon class="ui-icon" name="scan-barcode" />
            </div>
            <div class="block__button">
                <p>Ссылка</p>

                <UIIcon class="ui-icon" name="link" />
            </div>
        </div>
    </div>

</template>

<script setup>
const emits = defineEmits(['qrSelected'])
</script>

<style lang="scss" scoped>
:deep(.ui-icon) svg path {
    fill: var(--white);
}
.block {
    position: relative;
    display: flex;
    flex-direction: column;

    justify-content: center;

    background: #EBEBEB33;

    gap: 16px;

    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    padding: 16px;

    color: var(--white);
    font-family: 'Overpass';

    &__title {
        display: flex;
        font-size: 14px;
        font-weight: 600;
    }

    &__subTitle {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        color: var(--grayText);
    }

    &__buttons {
        display: flex;
        gap: 10px;
    }

    &__button {
        display: flex;
        justify-content: space-between;
        align-items: center;

        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;
        border-radius: 8px;
        padding: 9px;
        width: 50%;

        &>p {
            padding-top: 2px;
            font-weight: 600;
            font-size: 14px;
            font-family: 'Overpass';
        }
    }
}
</style>