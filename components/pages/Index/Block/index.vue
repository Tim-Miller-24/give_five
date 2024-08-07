<template>
    <div class="block">
        <NuxtLink class="block__box" to="/feedback" style="padding: 20px;">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">ОТЗЫВЫ</h3>
                    <p class="block__subTitle">Рейтинг 4.9</p>
                </div>

                <UIIcon name="heart" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
        <NuxtLink class="block__box" style="padding: 20px;">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">МЕНЮ</h3>
                    <p class="block__subTitle">100+ блюд</p>
                </div>

                <UIIcon name="book" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
    </div>
    <div class="block block--1">
        <NuxtLink class="block__box" to="/bonuses">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">БОНУСЫ</h3>
                    <p class="block__subTitle">250 бонусов</p>
                </div>

                <UIIcon name="buy-crypto" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
    </div>
    <div class="block block--1-5">
        <NuxtLink class="block__box box-1" to="/promocodes">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">ПРОМОКОДЫ</h3>
                    <p class="block__subTitle">Ввести промокд</p>
                </div>

                <UIIcon name="ticket-discount" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
        <NuxtLink to="/wifi" class="block__box box-2">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">WI-FI</h3>
                </div>

                <UIIcon name="wifi" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
    </div>
    <div class="block block--1">
        <div class="block__box" style="padding: 20px;">
            <div class="block__info block__info--waiter">

                <div class="waiter">
                    <img src="@/assets/images/woman.png" alt="">
    
                    <div class="block__info-text">
                        <h3 class="block__title">ЕЛИЗАВЕТА</h3>
                        <p class="block__subTitle">Ваш официант</p>
                    </div>
                </div>

                <div class="block__buttons">
                    <button class="call"><p>ПОЗВАТЬ ОФИЦИАНТА</p></button>
                    <button class="tea"><NuxtLink to="/tea">Оставить чаевые</NuxtLink></button>
                </div>
            </div>
            <div class="block__icons"></div>
        </div>
    </div>
    <div class="block block--1">
        <NuxtLink class="block__box" to="/payments">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">ОПЛАТА СЧЁТА</h3>
                    <p class="block__subTitle">5590 рублей</p>
                </div>

                <UIIcon name="receipt-item" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
    </div>
    <div class="block">
        <NuxtLink class="block__box">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">КОЛЕСО ФОРТУНЫ</h3>
                </div>

                <UIIcon name="share" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
        <NuxtLink class="block__box" to="/present">
            <div class="block__info">
                <div class="block__info-text">
                    <h3 class="block__title">ПОДАРОК ДРУГУ</h3>
                </div>

                <UIIcon name="emoji-happy" />
            </div>
            <div class="block__icons"></div>
        </NuxtLink>
    </div>
</template>

<style scoped lang="scss">
.ui-icon {
    background: #FFFFFF4D;
    border: 1px solid #FFFFFF4D;

    min-width: 45px;
    min-height: 45px;

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

    &--1 {
        grid-template-columns: repeat(1, 1fr);
    }
    
    &--1-5 {
        display: flex;

        .block__box {
            &:first-child {
                flex: 0 0 63%;
            }
            &:last-child {
                flex: 1;
            }
        }

    }

    &__box {
        background: #EBEBEB33;
        border: 1px solid #FFFFFF0D;

       &:first-child {
        margin-left: -10px;
       }
       &:last-child {
        margin-right: -10px;
       }

        padding: 32px 20px;
        
        backdrop-filter: blur(10px);

        border-radius: 16px;

        display: flex;
    }

    &__info {
        display: flex;

        width: 100%;

        justify-content: space-between;

        &-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &--waiter {
            display: flex;
            flex-direction: column;
        }

        & > .waiter {
            display: flex;
            gap: 16px;
        }
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

        color: #bbbcbc;
    }

    &__buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;

        margin-top: 16px;

        & > button {
            padding: 8px 25px;

            border-radius: 8px;

            color: var(--white);

            font-weight: 500;

            border: 1px solid #FFFFFF0D;
        }

        & > .call {
            background: var(--purple);
        }

        & > .tea {
            
        }
    }
}
</style>