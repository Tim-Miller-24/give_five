<template>
    <div class="call">
        <div class="call__header">
            <h4 class="call__title">Связь с менеджером</h4>
            <p class="call__subTitle">Менеджер скоро свяжется с вами, чтобы уладить любые возникшие проблемы.</p>
        </div>

        <div class="call__messengers">
            <button class="call__wt">
                <UIIcon name="whatsapp" class="call__wt-icon" />
                <p>WhatsApp</p>
            </button>
            <button class="call__tg">
                <UIIcon name="telegram" class="call__tg-icon" />
                <p>Telegram</p>
            </button>
        </div>

        <UIButton color="purple" class="call__button"> Позвать менеджера </UIButton>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.call {
    position: relative;

    display: flex;
    flex-direction: column;

    background: #EBEBEB33;

    border: 1px solid #FFFFFF0D;

    border-radius: 16px;

    padding: 24px;

    // width: 100%;

    gap: 16px;

    font-family: 'Overpass';
    text-align: center;

    &__header {
        display: flex;
        flex-direction: column;

        gap: 8px;
    }

    &__title {
        font-size: 500px;
        font-size: 20px;
        text-transform: uppercase;

        font-family: 'Oswald';
    }

    &__subTitle {
        font-weight: 400;
        font-size: 12px;
    }

    &__messengers {
        display: flex;
        width: 100%;

        justify-content: space-between;
        gap: 8px;

        & button {
            display: flex;
            flex-grow: 1;
            gap: 8px;
            padding: 9px 14px;
            border-radius: 8px;
        }
    }

    &__wt {
        background: #25D366;
        color: var(--black);
    }

    &__tg {
        background: #2AACEF;
        color: var(--white);

        
    }

}

.call__tg-icon ::v-deep svg path {
    fill: var(--white) !important;
}
</style>