<template>
    <div class="methods">
        <h3 class="methods__title">Всего: 5 940 рублей</h3>

        <div class="methods__buttons">
            <div class="methods__spb">
                <p class="methods__name">Оплатить через спб</p>
                <img src="@/assets/images/spb.png" alt="">
            </div>

            <div class="methods__add-card">
                <p class="methods__name">Добавить карту</p>

                <UIIcon name="card" />
            </div>

            <div class="methods__another">
                <p class="methods__name">Другие способы оплаты</p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.methods {
    position: relative;

    background: #EBEBEB33;

    border: 1px solid #FFFFFF0D;
    border-radius: 12px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 24px;

    gap: 24px;

    font-family: 'Overpass';

    &__title {
        text-transform: uppercase;
        font-family: 'Oswald';
    }

    &__buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;

        gap: 8px;

        & > div {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 100%;
            padding: 9px;
            border-radius: 8px;

            gap: 8px;
        }
    }

    &__spb {
        background: var(--purple);
    }

    &__add-card {
        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;
    }

    &__another {
        border: 1px solid #FFFFFF4D;
    }
}
</style>