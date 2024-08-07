<template>
    <div class="card">
        <div class="card__header">
            <h3 class="card__title">Сегодня, 4 июня 2024</h3>
            <span class="card__label" :class="props.item.type"> {{ label }} </span>
        </div>
        <div class="card__info">
            <h4>Внимание!</h4>
            <p>Завтра у вас закончится срок действия промокода “Скидка 10% на доставку”</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    item: {
        type: Object,
        default: {},
    }
})

const label = computed(() => {
    switch (props.item.type) {
        case 'order':
            return 'Заказ';
        case 'important':
            return 'Важное';
        case 'promotion':
            return 'Акции';
    }
})
</script>

<style lang="scss" scoped>
.card {
    position: relative;

    background: #EBEBEB33;

    padding: 16px;

    backdrop-filter: blur(10px);

    border-radius: 8px;

    font-family: 'Overpass';

    color: var(--grayText);

    display: flex;
    flex-direction: column;
    gap: 4px;

    &__header {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    &__title {
        font-size: 12px;
        font-weight: 400;
    }

    &__label {
        color: var(--white);
        border-radius: 4px;
        padding: 2px 6px;

        font-size: 12px;

        &.order {
            background: var(--darkBlue);
        }

        &.important {
            background: var(--purple4);
        }

        &.promotion {
            background: var(--orange);
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        &>h4 {
            color: var(--white);
            font-size: 14px;
        }

        & > p {
            font-size: 12px;
        }
    }
}
</style>