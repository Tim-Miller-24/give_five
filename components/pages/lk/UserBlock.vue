<template>
    <div class="user">
        <div class="user__icon">
            <UIIcon name="user-square" />
        </div>

        <div class="user__text">
            <h3 class="user__name"> {{ userStore.user?.display_name }} </h3>

            <p class="user__phone">+ {{ userStore.user?.phone }}</p>
        </div>


        <button class="user__back-btn" @click="logout">Выйти</button>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const logout = () => {
  navigateTo('/')

  userStore.setToken(null)
  userStore.setUser(null)
}
</script>

<style lang="scss" scoped>
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