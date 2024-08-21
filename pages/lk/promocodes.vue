<template>
    <div class="promocodes">
        <div class="promocodes__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>МОИ ПРОМОКОДЫ</h3>
        </div>

        <div class="promocodes__blocks" v-if="!isLoading">
            <PagesPromocodesBlock v-for="(promo, index) in promocodes" 
            :key="index"
            :item="promo"
            @qrSelected="openQr" />
        </div>

        <UILoader class="promocodes__loader" v-else is-big />

        <CommonBottomSheet :isModalMap="true" :isQr="true" v-if="isQrOpened" @closeModal="isQrOpened=false">
            <div class="modal">
                <div class="modal__header">
                    <h3 class="modal__title">Отсканируйте код</h3>

                    <p class="modal__subTitle">Чтобы воспользоваться промокодом</p>
                </div>

                <img :src="qrImg" class="modal__qr-image" alt="">

                <div class="modal__footer">
                    <h4>{{ modalData.title }}</h4>
                    <p>{{ modalData.code }}</p>
                </div>
            </div>
        </CommonBottomSheet>
    </div>
</template>

<script setup>
const isQrOpened = ref(false);

const userStore = useUserStore()
const config = useRuntimeConfig();

const isLoading = ref(false)
const promocodes = ref([])

const qrImg = ref('');

const modalData = ref();

const openQr = (data) => {
    if (isQrOpened.value) {
        isQrOpened.value = false;

        setTimeout(() => {
            modalData.value = data
            qrImg.value = data.qrcode
            isQrOpened.value = true;
        }, 1);

        return;
    }

    modalData.value = data
    qrImg.value = data.qrcode
    isQrOpened.value = true;
}

const getPromocodes = async () => {
  isLoading.value = true

  const data = await userStore.getPromocodes(config);

  isLoading.value = false

  promocodes.value = data?.value.filter(item => !item.for_gift) || []
}

watchEffect(() => {
    getPromocodes();
})
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

    &__loader {
        width: 100%;
        margin: auto;
        margin-top: 40px;
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