<template>
    <div class="qr">
        <img :data-src="image" alt="" v-lazy-load>

        <h3 class="qr__title">Мы будем рады поделиться <br> wi-fi с вами</h3>
    </div>
</template>

<script lang="ts" setup>
const commonStore = useCommonStore();

const image = computed(() => commonStore.dai5.wifi_qr);
</script>

<style lang="scss" scoped>
.qr {
    margin-top: 16px;
    margin-bottom: 16px;

    position: relative;
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    background: #EBEBEB33;
    
    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    padding: 32px 20px;

    color: var(--white);

    &__title {
        margin-top: 24px;

        font-size: 14px;
        font-weight: 600;

        font-family: 'Overpass';
        text-align: center;
    }

}
</style>