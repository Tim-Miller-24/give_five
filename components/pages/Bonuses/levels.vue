<template>
    <div class="levels">
        <div class="levels__stage">
            <div class="left">
                <p>1</p>
                <div style="color: var(--grayText);">Уровень</div>
            </div>
            <div class="right">
                <p> 
                    <span>400</span>
                    <UIIcon class="icon" name="icon-coin" />
                </p>
                <div style="color: var(--grayText);">Бонусов</div>
            </div>
        </div>

        <div class="levels__progress-block">
            <span class="current-level"> {{ price1.toLocaleString() }} руб. </span>
            <span class="for-next-level"> {{ price2.toLocaleString() }} руб. </span>
            <div class="levels__progress-bar" :style="`width: 65%`" />
        </div>

        <div class="levels__info">
            <p>Осталось купить на 2 980 ₽, <br> чтобы получить 2 уровень</p>
            <UIIcon class="info-circle" name="info-circle" />
        </div>
    </div>
</template>

<script setup>
// временная заглушка
const price1 = 1300;
const price2 = 2000;
</script>

<style lang="scss">
.icon svg path {
    fill: var(--white);
}

.levels {
    position: relative;
    z-index: 15;

    display: flex;
    flex-direction: column;

    gap: 16px;

    color: var(--white);

    &__stage {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;

        font-family: 'Overpass';

        &>div {
            background: #EBEBEB33;
            border: 1px solid #FFFFFF0D;

            padding: 12px 16px;

            backdrop-filter: blur(10px);

            border-radius: 16px;
        }

        & > .right p {
            display: flex;
            gap: 5px;
        }
    }

    &__progress-block {
        width: 100%;
        height: 35px;

        border-radius: 20px;

        position: relative;

        background: #EBEBEB33;
    }

    &__progress-bar {
        height: 35px;

        border-radius: 20px;

        background: var(--purple2);
    }

    &__info {
        position: relative;
        z-index: 15;

        font-family: 'Overpass';

        & > .info-circle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);

            & svg path {
                fill: var(--white);
            }
        }
    }
}

.current-level {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    font-family: 'Overpass';

    left: 15px;
}

.for-next-level {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    font-family: 'Overpass';

    right: 15px;
}
</style>