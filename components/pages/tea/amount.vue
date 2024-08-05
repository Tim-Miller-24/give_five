<template>
    <div class="amount">
        <h3 class="amount__title">Чаевые</h3>

        <div class="amount__buttons">
            <button class="amount__button" style="width: 80%;">
                <p class="amount__percent">0%</p>
            </button>
            <button class="amount__button active">
                <p class="amount__percent">10%</p>
                <p class="amount__sum">540 руб.</p>
            </button>
            <button class="amount__button">
                <p class="amount__percent">15%</p>
                <p class="amount__sum">810 руб.</p>
            </button>
            <button class="amount__button">
                <p class="amount__percent">20%</p>
                <p class="amount__sum">1080 руб.</p>
            </button>
        </div>
        
        <div class="amount__another-sum">
            <button>Другая сумма</button>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.amount {
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

    &__percent {
        padding-top: 5px;
        font-size: 14px;
        line-height: 12.2px;
    }

    &__sum {
        font-size: 12px;
        font-weight: 400;
        line-height: 10.6px;
        color: #d0cecc;
    }

    &__buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        gap: 8px;

        &>button {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            border-radius: 8px;

            height: 52px;
            width: 100%;

            gap: 8px;

            background: #FFFFFF4D;
            border: 1px solid #FFFFFF4D;

            &.active {
                background: var(--white);
                color: var(--black);

                & > p.amount__sum {
                    color: #8c8c8c !important;
                }
            }
        }
    }

    &__another-sum {
        margin-top: -16px;

        width: 100%;

        & > button {
            width: 100%;

            border: 1px solid #FFFFFF4D;
            padding: 8px;
            border-radius: 8px;
        }
    }
}
</style>