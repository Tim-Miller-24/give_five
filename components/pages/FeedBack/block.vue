<template>
    <div class="blocks">
        <div class="block">
            <div class="block__date">
                <p>4 апреля 2024</p>
                <div class="images">
                    <img src="@/assets/images/2gis.png" alt="">
                    <img src="@/assets/images/yandex.png" alt="">
                    <img src="@/assets/images/flamp.png" alt="">
                </div>
            </div>
            <div class="block__title">
                <h3>Urban Oasis Grill</h3>
                <h4>Москва, проспект Победы 35</h4>
            </div>
            <p class="block__desc">
                Большое спасибо за ароматный и бодрящий напиток в подарок.
            </p>
            <div class="block__images">
                <img src="@/assets/images/burger-1.png" alt="">
                <img src="@/assets/images/burger-2.png" alt="">
                <img src="@/assets/images/burger-3.png" alt="">
                <img src="@/assets/images/burger-4.png" alt="">
                <img src="@/assets/images/burger-5.png" alt="">
            </div>
        </div>
        <div class="block">
            <div class="block__date">
                <p>4 апреля 2024</p>
                <div class="images">
                    <img src="@/assets/images/2gis.png" alt="">
                </div>
            </div>
            <div class="block__title">
                <h3>Urban Oasis Grill</h3>
                <h4>Москва, проспект Победы 35</h4>
            </div>
            <p class="block__desc">
                Большое спасибо за ароматный и бодрящий напиток в подарок.
            </p>
            <div class="block__images">
                <img src="@/assets/images/burger-1.png" alt="">
                <img src="@/assets/images/burger-2.png" alt="">
                <img src="@/assets/images/burger-3.png" alt="">
                <img src="@/assets/images/burger-4.png" alt="">
                <img src="@/assets/images/burger-5.png" alt="">
            </div>
        </div>
        <div class="block">
            <div class="block__date">
                <p>4 апреля 2024</p>
                <div class="images">
                    <img src="@/assets/images/2gis.png" alt="">
                    <img src="@/assets/images/yandex.png" alt="">
                    <img src="@/assets/images/flamp.png" alt="">
                </div>
            </div>
            <div class="block__title">
                <h3>Urban Oasis Grill</h3>
                <h4>Москва, проспект Победы 35</h4>
            </div>
            <p class="block__desc">
                Большое спасибо за ароматный и бодрящий напиток в подарок.
            </p>
            <div class="block__images">
                <img src="@/assets/images/burger-1.png" alt="">
                <img src="@/assets/images/burger-2.png" alt="">
                <img src="@/assets/images/burger-3.png" alt="">
                <img src="@/assets/images/burger-4.png" alt="">
                <img src="@/assets/images/burger-5.png" alt="">
            </div>
        </div>
    </div>
</template>

<script></script>

<style lang="scss" scoped>
.blocks {
    display: flex;

    flex-direction: column;

    gap: 16px;

    padding-bottom: 24px;
}

.block {
    position: relative;
    z-index: 15;

    font-family: 'Overpass';
    color: var(--white);

    background: #EBEBEB33;
    border: 1px solid #FFFFFF0D;

    padding: 16px;

    backdrop-filter: blur(10px);

    border-radius: 16px;

    gap: 9px;

    display: flex;

    flex-direction: column;

    &__date {
        font-size: 12px;

        display: flex;

        width: 100%;

        justify-content: space-between;

        position: relative;

        & > .images {
            display: flex;
            gap: 10px;
            object-fit: cover;
            position: absolute;
            right: 0;
        }
    }

    &__title {
        line-height: 18px;
    }

    &__desc {
        font-size: 12px;
    }

    &__images {
        margin-top: 15px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        &>img {
            border-radius: 8px;
        }
    }
}
</style>