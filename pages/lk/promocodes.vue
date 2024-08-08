<template>
    <div class="promocodes">
        <div class="promocodes__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>МОИ ПРОМОКОДЫ</h3>
        </div>

        <div class="promocodes__blocks">
            <PagesPromocodesBlock @qrSelected="isQrOpened=true" />

            <PagesPromocodesBlock @qrSelected="isQrOpened=true" />

            <PagesPromocodesBlock @qrSelected="isQrOpened=true" />
        </div>


        <CommonBottomSheet :isModalMap="true" :isQr="true" v-if="isQrOpened" @closeModal="isQrOpened=false">
            <div class="modal">
                <div class="modal__header">
                    <h3 class="modal__title">Отсканируйте код</h3>

                    <p class="modal__subTitle">Чтобы воспользоваться промокодом</p>
                </div>

                <img src="@/assets/images/promo-qr.png" class="modal__qr-image" alt="">

                <div class="modal__footer">
                    <h4>10% на доставку</h4>
                    <p>Скидка 10% на доставку от 3 000 рублей</p>
                </div>
            </div>
        </CommonBottomSheet>
    </div>
</template>

<script setup>
const isQrOpened = ref(false)
</script>

<style lang="scss" scoped>
.promocodes {
    position: relative;
    
    &__title {
        display: flex;

        align-items: center;

        position: relative;

        &>h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
    }

    &__blocks {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
}

.modal {
    display: flex;
    flex-direction: column;

    color: var(--white);

    text-align: center;

    gap: 24px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__title {
        font-family: 'Oswald';
        font-size: 20px;
        font-weight: 500;
        line-height: 26px;
        text-transform: uppercase;
    }

    &__subTitle {
        font-family: 'Overpass';
        font-size: 12px;
        font-weight: 400;
        text-align: center;
    }

    &__qr-image {
        padding: 0 30px;
    }

    &__footer {
        display: flex;
        flex-direction: column;
        gap: 8px;

        &>h4 {
            font-family: 'Oswald';
            font-size: 16px;
            font-weight: 500;
            text-transform: uppercase;
        }

        &>p {
            font-family: 'Overpass';
            font-size: 14px;
            font-weight: 600;
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