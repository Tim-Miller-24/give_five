<template>
    <div class="variant">
        <NuxtLink class="variant__block">
            <UIIcon class="ui-icon" color="white" name="sber" />

            <p class="variant__name">Войти по Сбер ID</p>
        </NuxtLink>

        <NuxtLink class="variant__block">
            <UIIcon class="ui-icon" color="white" name="vk" />

            <p class="variant__name">Войти через Вконтакте</p>
        </NuxtLink>

        <NuxtLink class="variant__block" to="/login/telegram">
            <UIIcon class="ui-icon" color="white" name="telegram" />

            <p class="variant__name">Вход через Telegram</p>
        </NuxtLink>

        <NuxtLink class="variant__block">
            <UIIcon class="ui-icon" color="white" name="google" />

            <p class="variant__name">Войти через Google</p>
        </NuxtLink>

        <NuxtLink class="variant__block">
            <UIIcon class="ui-icon" color="white" name="apple" />

            <p class="variant__name">Вход через Apple</p>
        </NuxtLink>

        <NuxtLink class="variant__block">
            <UIIcon class="ui-icon" color="white" name="ok" />

            <p class="variant__name">Вход через OK</p>
        </NuxtLink>

        <NuxtLink class="variant__block" to="/login/phone">
            <UIIcon class="ui-icon" color="white" name="call" />

            <p class="variant__name">Войти по телефону</p>
        </NuxtLink>

        <NuxtLink class="variant__block" to="/login/email">
            <UIIcon class="ui-icon" color="white" name="sms" />

            <p class="variant__name">Войти по E-mail</p>
        </NuxtLink>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
:deep(.ui-icon) svg path {
    fill: var(--white) !important;
}

.ui-icon {
    background: #FFFFFF1A;
    border-radius: 8px;

    padding: 0 16px;
    
    :deep svg path {
        fill: var(--white) !important;
    }
}

.variant {
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

        :deep(.ui-icon) svg path {
            fill: var(--white) !important;
        }
    }

    &__name {
        margin-top: 3px;
        font-weight: 600;
        font-size: 14px;

        padding: 12px 16px;
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