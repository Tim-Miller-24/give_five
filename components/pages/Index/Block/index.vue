<template>
    <div class="block">
        <div class="block__box">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">ОТЗЫВЫ</h3>
                    <p class="block__subTitle">Рейтинг 4.9</p>
                </div>

                <UIIcon name="heart" />
            </div>
            <div class="block__icons"></div>
        </div>
        <div class="block__box">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">МЕНЮ</h3>
                    <p class="block__subTitle">100+ блюд</p>
                </div>

                <UIIcon name="book" />
            </div>
            <div class="block__icons"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.ui-icon {
    background: #FFFFFF4D;
    border: 1px solid #FFFFFF4D;

    width: 45px;
    height: 45px;

    border-radius: 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    :deep svg path {
        fill: var(--white);
    }
}
.block {
    z-index: 15;

    margin-top: 10px;

    width: 100%;

    position: relative;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    
    

    &__box {
        background: #EBEBEB33;
        border: 1px solid #FFFFFF0D;

       &:first-child {
        margin-left: -10px;
       }
       &:last-child {
        margin-right: -10px;
       }

        padding: 20px;
        
        backdrop-filter: blur(10px);

        border-radius: 16px;

        display: flex;
    }

    &__info {
        display: flex;

        width: 100%;

        justify-content: space-between;
    }

    &__title {
        font-size: 16px;
        font-weight: 500;

        color: var(--white);
    }

    &__subTitle {
        font-size: 12px;
        font-weight: 600;

        margin-top: 4px;

        font-family: 'Overpass';
    }
}
</style>