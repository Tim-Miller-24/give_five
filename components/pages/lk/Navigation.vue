<template>
    <div class="navigation">
        <NuxtLink to="/lk/Notifications" class="navigation__block">
            <UIIcon class="ui-icon" color="white" name="icon-notification" />

            <p class="navigation__name">Уведомления</p>

            <span class="navigation__notification">2</span>
        </NuxtLink>

        <NuxtLink class="navigation__block" to="/lk/Referals">
            <UIIcon class="ui-icon" color="white" name="ticket-discount" />

            <p class="navigation__name">Реферальная система</p>
        </NuxtLink>

        <NuxtLink class="navigation__block" to="/lk/promocodes">
            <UIIcon class="ui-icon" color="white" name="discount-circle" />

            <p class="navigation__name">Промокоды и акции</p>
        </NuxtLink>

        <NuxtLink class="navigation__block">
            <UIIcon class="ui-icon" color="white" name="buy-crypto" to="/lk/bonuses" />

            <p class="navigation__name">Бонусы</p>
        </NuxtLink>

        <NuxtLink class="navigation__block" to="/lk/PaymentsHistory">
            <UIIcon class="ui-icon" color="white" name="receipt-item" />

            <p class="navigation__name">История оплаты</p>
        </NuxtLink>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
:deep(.ui-icon) svg path {
    fill: var(--white) !important;
}

.ui-icon {
    :deep svg path {
        fill: var(--white) !important;
    }
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

        :deep(.ui-icon) svg path {
            fill: var(--white) !important;
        }
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