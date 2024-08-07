<template>
    <div class="notifications">
        <div class="notifications__title">
            <NuxtLink to="/lk">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>уведомления</h3>
        </div>

        <div class="notifications__content">
            <div class="notifications__buttons">
                <UIButton color="gray" @click="selectedButton = 'all'"
                    :class="{ 'active': selectedButton === 'all' }">
                    Все
                </UIButton>

                <UIButton color="gray" @click="selectedButton = 'order'"
                    :class="{ 'active': selectedButton === 'order' }">
                    Заказы
                </UIButton>
                <UIButton color="gray" @click="selectedButton = 'promotion'"
                    :class="{ 'active': selectedButton === 'promotion' }">
                    Акции
                </UIButton>
                <UIButton color="gray" @click="selectedButton = 'important'"
                    :class="{ 'active': selectedButton === 'important' }">
                    Важное
                </UIButton>
            </div>

            <div class="notifications__box">
                <div class="notifications__day-block">
                    <h4 class="notifications__day-title">Сегодня, 4 июня 2024</h4>
                    <PagesLkNotificationsCard :item="temp" />
                </div>
                <div class="notifications__day-block">
                    <h4 class="notifications__day-title">Вчера, 3 июня 2024</h4>
                    <PagesLkNotificationsCard :item="temp3" />
                    <PagesLkNotificationsCard :item="temp2" />
                </div>
                <div class="notifications__day-block">
                    <h4 class="notifications__day-title">1 июня 2024</h4>
                    <PagesLkNotificationsCard :item="temp" />
                    <PagesLkNotificationsCard :item="temp3" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
const temp = {
    type: 'order'
}
const temp2 = {
    type: 'important'
}
const temp3 = {
    type: 'promotion'
}

const selectedButton = ref('all');

watch(() => selectedButton.value, () => {

})
</script>

<style lang="scss" scoped>
.notifications {
    position: relative;

    padding-bottom: 40px;

    &__title {
        display: flex;

        align-items: center;

        position: relative;

        &>h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            text-transform: uppercase;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
    }

    &__buttons {
        display: flex;
        width: 100%;
        gap: 10px;
        justify-content: space-between;

        &>* {
            padding: 5px;
            width: 100%;
            height: auto;
            min-width: auto;
            font-size: 14px;

            &.active {
                color: var(--black);
                background: #FFFFFFCC;
            }
        }
    }

    &__content {
        background: #EBEBEB33;

        margin-top: 16px;

        border: 1px solid #FFFFFF0D;
        border-radius: 8px;

        padding: 16px;
    }

    &__box {
        display: flex;
        flex-direction: column;
        gap: 14px;

        margin-top: 24px;
    }

    &__day-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__day-title {
        font-family: 'Overpass';
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        color: var(--grayText);
        margin-bottom: 8px;
    }
}

.ui-icon {
    background: #FFFFFF4D;
    border: 1px solid #FFFFFF4D;

    min-width: 35px;
    min-height: 35px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    :deep svg path {
        fill: var(--white);
    }
}
</style>