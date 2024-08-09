<template>
    <div class="card">
        <div class="card__header">
            <h3 class="card__title"> {{ formatDate(props.item.date_added) }} </h3>
            <span class="card__label" :class="props.item.type"> {{ label }} </span>
        </div>
        <div class="card__info">
            <h4> {{ props.item.title }} </h4>
            <p> {{ props.item.text }} </p>
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
        case 'c':
            return 'Заказ';
        case 'important':
            return 'Важное';
        case 'promo':
            return 'Акции';
        default:
            return 'Уведомление'
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

        &.promo {
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