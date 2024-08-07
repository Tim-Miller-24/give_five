<template>
    <div class="payments">
        <div class="payments__title">
            <NuxtLink to="/lk">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>История оплаты</h3>
        </div>

        <div class="payments__content">
            <PagesLkPaymentsHistoryItem :active="true" />
            <PagesLkPaymentsHistoryItem />
            <PagesLkPaymentsHistoryItem />
            <PagesLkPaymentsHistoryItem />
            <PagesLkPaymentsHistoryItem />
        </div>

    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.payments {
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

    &__content {
        margin-top: 16px;

        display: flex;
        flex-direction: column;
        gap: 16px;
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