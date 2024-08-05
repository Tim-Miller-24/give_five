<template>
    <div class="composition">
        <div class="composition__header">
            <h3 class="composition__title">Всего 8 блюд</h3>
            <p class="composition__subTitle">Вы можете разделить счет или оплатить полностью онлайн</p>
        </div>

        <div class="composition__buttons">
            <UIRadio class="checkbox" id="allCehck" v-model="selectedOption" :defaultValue="'allCehck'">
                <div class="composition__allCheck">
                    <div class="text">
                        <h3>Весь счет</h3>
                        <p>5 400 руб.</p>
                    </div>

                    <button class="button" @click="emits('changeComposition')">Изменить</button>
                </div>
            </UIRadio>
            <UIRadio id="dontPay" v-model="selectedOption" :defaultValue="'dontPay'">
                <p class="checkbox-text">Не оплачивать счет</p>
            </UIRadio>
        </div>
    </div>
</template>

<script setup>
const selectedOption = ref(null);

const emits = defineEmits(['changeComposition'])
</script>

<style lang="scss" scoped>
.composition {
    position: relative;

    background: #EBEBEB33;

    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    font-family: 'Overpass';

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    gap: 24px;

    padding: 24px;

    text-align: center;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__title {
        font-family: "Oswald";
        text-transform: uppercase;
        font-size: 500px;
        font-size: 16px;
    }

    &__subTitle {
        font-size: 12px;
        font-weight: 400;
    }

    &__buttons {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__allCheck {
        display: flex;
        justify-content: space-between;
        width: 100%;

        &>.text {
            &>h3 {
                font-weight: 400;
                color: var(--grayText);
                font-size: 12px;
            }

            &>p {
                font-weight: 400;
                color: var(--white);
                font-size: 12px;
            }
        }

        &>.button {
            position: absolute;
            right: 0px;
            top: 0;

            background: #FFFFFF4D;
            border: 1px solid #FFFFFF4D;

            border-radius: 8px;
            padding: 8px 16px;

            font-size: 14px;
        }
    }
}
.checkbox-text {
    font-size: 12px !important;
    font-weight: 400 !important;
}
</style>