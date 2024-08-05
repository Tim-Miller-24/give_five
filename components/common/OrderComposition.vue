<template>
    <div class="composition">
        <div class="composition__info">
            <h3 class="composition__title">Всего 8 блюд</h3>
            <p class="composition__title">5 400 руб.</p>
        </div>

        <div class="composition__content">
            <div class="composition__block">
                <div class="composition__block_header">
                    <UICheckbox class="checkbox">
                        Гость 1
                    </UICheckbox>
                    <p class="total__price">2700 руб.</p>
                </div>
                <ul class="composition__block_list">
                    <li>
                        <UICheckbox class="checkbox">
                            Грибной суп
                        </UICheckbox>
                        <p class="total__price">500 руб.</p>
                    </li>
                    <li>
                        <UICheckbox class="checkbox">
                            Сендвич с тунцом
                        </UICheckbox>
                        <p class="total__price">400 руб.</p>
                    </li>
                    <li>
                        <UICheckbox class="checkbox">
                            Томатный сок
                        </UICheckbox>
                        <p class="total__price">400 руб.</p>
                    </li>
                    <li>
                        <UICheckbox class="checkbox">
                            Зелный чай
                        </UICheckbox>
                        <p class="total__price">300 руб.</p>
                    </li>
                </ul>
            </div>

            <div class="composition__block">
                <div class="composition__block_header">
                    <UICheckbox class="checkbox">
                        Гость 1
                    </UICheckbox>
                    <p class="total__price">2700 руб.</p>
                </div>
                <ul class="composition__block_list">
                    <li>
                        <UICheckbox class="checkbox">
                            Грибной суп
                        </UICheckbox>
                        <p class="total__price">500 руб.</p>
                    </li>
                    <li>
                        <UICheckbox class="checkbox">
                            Сендвич с тунцом
                        </UICheckbox>
                        <p class="total__price">400 руб.</p>
                    </li>
                    <li>
                        <UICheckbox class="checkbox">
                            Томатный сок
                        </UICheckbox>
                        <p class="total__price">400 руб.</p>
                    </li>
                    <li>
                        <UICheckbox class="checkbox">
                            Зелный чай
                        </UICheckbox>
                        <p class="total__price">300 руб.</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="composition__info">
            <h3 class="composition__title">Вы выбрали блюд на:</h3>
            <p class="composition__title">3 100 руб.</p>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.composition {
    position: relative;

    font-family: 'Overpass';

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    gap: 24px;

    text-align: center;

    &__info {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    &__title {
        font-family: "Oswald";
        text-transform: uppercase;
        font-size: 500px;
        font-size: 16px;
    }

    &__content {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    &__block {
        background: #EBEBEB33;

        border-radius: 8px;

        padding: 16px;

        &_header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &_list {
            margin-top: 16px;

            padding-left: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;

            &>li {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }

}
</style>