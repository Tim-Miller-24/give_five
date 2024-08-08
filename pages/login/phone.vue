<template>
    <div class="login">
        <div class="login__title">
            <NuxtLink to="/login">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>вход по телефону</h3>
        </div>

        <PagesLoginPhone style="z-index: 1000;" />

        <PagesLoginAgreements style="z-index: 500;" />
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.login {
    padding-bottom: 40px;

    position: relative;

    &__title {
        display: flex;

        align-items: center;

        position: relative;

        text-transform: uppercase;

        &>h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
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