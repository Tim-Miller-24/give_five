<template>
    <div class="bonuses">
        <div class="bonuses__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>БОНУСЫ</h3>
        </div>

        <div class="bonuses__content">
            <PagesBonusesQr />

            <PagesBonusesLevels />

            <PagesBonusesHistory />
        </div>

    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.bonuses {
    padding-bottom: 40px;

    position: relative;

    &__content {
        background: #EBEBEB33;

        margin-top: 16px;
        
        border-radius: 16px;

        padding: 16px;
    }

    &__title {
        display: flex;

        align-items: center;

        position: relative;

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