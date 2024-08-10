<template>
    <div class="rating">
        <h3 class="rating__title">Расскажите о своем опыте!</h3>
        <p class="rating__subTitle">Расскажите о своем опыте! Оставьте отзыв. Ваши комментарии помогут нам стать лучше.
        </p>
        <div class="rating__stars">
            <img src="@/assets/images/star.png" v-for="i in 5" alt="">
        </div>
    </div>
</template>

<script></script>

<style lang="scss" scoped>
.rating {
    position: relative;
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    background: #EBEBEB33;
    
    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    padding: 32px 20px;

    color: var(--white);

    &__title {
        font-size: 16px;
        text-transform: uppercase;

        margin-bottom: 10px;
    }

    &__subTitle {
        font-size: 12px;
        font-family: 'Overpass';
        text-align: center;

        margin-bottom: 24px;
    }

    &__stars {
        display: flex;
        gap: 5px;

    }
}
</style>