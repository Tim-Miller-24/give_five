<template>
    <div class="chat">
        <div class="chat__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>чат с компанией</h3>
        </div>

        <div class="chat__box">

        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.chat {
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

            text-wrap: nowrap;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
    }

    &__box {
        margin-top: 16px;
        background: #EBEBEB33;
        padding: 16px;
        border-radius: 12px;
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