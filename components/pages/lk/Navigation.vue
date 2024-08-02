<template>
    <div class="navigation">
        <div class="navigation__block">
            <UIIcon class="icon" name="icon-notification" />

            <p class="navigation__name">Уведомления</p>

            <span class="navigation__notification">2</span>
        </div>
        <div class="navigation__block">
            <UIIcon class="icon" name="ticket-discount" />

            <p class="navigation__name">Реферальная система</p>

            <!-- <span class="navigation__notification">2</span> -->
        </div>
        <div class="navigation__block">
            <UIIcon class="icon" name="discount-circle" />

            <p class="navigation__name">Промокоды и акции</p>

            <!-- <span class="navigation__notification">2</span> -->
        </div>
        <div class="navigation__block">
            <UIIcon class="icon" name="receipt-item" />

            <p class="navigation__name">История оплаты</p>

            <!-- <span class="navigation__notification">2</span> -->
        </div>
        <div class="navigation__block">
            <UIIcon class="icon" name="like-tag" />

            <p class="navigation__name">Промокоды и акции</p>

            <!-- <span class="navigation__notification">2</span> -->
        </div>
    </div>
</template>

<script setup></script>

<style lang="scss">
:deep(.icon) svg path {
    fill: var(--white);
}

.navigation {
    position: relative;
    display: flex;
    flex-direction: column;

    margin-top: 16px;

    gap: 4px;

    color: var(--white);

    font-family: 'Overpass';


    &__block {
        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;
        border-radius: 8px;

        position: relative;

        display: flex;
        gap: 16px;
        width: 100%;

        padding: 12px 16px;
    }

    &__name {
        margin-top: 3px;
        font-weight: 600;
        font-size: 14px;
    }

    &__notification {
        position: absolute;

        right: 15px;

        background: var(--purple);

        top: 50%;
        transform: translateY(-50%);

        padding: 6px 10px 2px 10px;
        border-radius: 8px;
    }
}
</style>