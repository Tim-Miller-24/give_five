<template>
    <div class="user">
        <div class="user__icon">
            <UIIcon name="user-square" />
        </div>

        <div class="user__text">
            <h3 class="user__name">Иванов Виктор</h3>

            <p class="user__phone">+7 999 649 53 25</p>
        </div>


        <button class="user__back-btn">Выйти</button>
    </div>
</template>

<script></script>

<style lang="scss">
.user {
    margin-top: 16px;
    position: relative;

    background: #EBEBEB33;
    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    color: var(--white);

    padding: 24px;

    font-family: 'Overpass';

    text-align: center;

    gap: 24px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__name {
        font-size: 14px;
        font-weight: 600;
    }

    &__phone {
        font-weight: 600;
        font-size: 14px;
    }

    &__back-btn {
        padding: 12px 52px;
        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;
        border-radius: 8px;
    }
}
</style>