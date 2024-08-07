<template>
    <div class="wheel">
        <div class="wheel__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>Колесо фортуны</h3>
        </div>


    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.wheel {
    position: relative;

    padding-bottom: 40px;

    &__title {
        display: flex;

        align-items: center;

        position: relative;

        &>h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            text-transform: uppercase;

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