<template>
    <div class="feedback">
        <div class="feedback__title">
            <NuxtLink to="/"><UIIcon class="ui-icon" name="arrow-left"/></NuxtLink>
            <h3>ОТЗЫВЫ</h3>
        </div>

        <div class="feedback__content">
            <PagesFeedBackRating />
    
            <PagesFeedBackBlock />
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.feedback {
    position: relative;

    &__title {
        display: flex;

        align-items: center;

        position: relative;

        & > h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
    }

    &__content {
        display: flex;
        flex-direction: column;

        gap: 16px;

        margin-top: 16px;
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