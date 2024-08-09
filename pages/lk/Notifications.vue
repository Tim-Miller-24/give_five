<template>
    <div class="notifications">
        <div class="notifications__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>уведомления</h3>
        </div>

        <div class="notifications__content" v-if="!isLoading">
            <div class="notifications__buttons">
                <UIButton color="gray" @click="selectedButton = 'all'" :class="[{ 'active': selectedButton === 'all' }, {'alone': !isShowOrderFilter && !isShowPromoFilter && !isShowImportantFilter}]">
                    Все
                </UIButton>

                <UIButton v-if="isShowOrderFilter" color="gray" @click="selectedButton = 'order'"
                    :class="{ 'active': selectedButton === 'order' }">
                    Заказы
                </UIButton>
                <UIButton v-if="isShowPromoFilter" color="gray" @click="selectedButton = 'promo'"
                    :class="{ 'active': selectedButton === 'promo' }">
                    Акции
                </UIButton>
                <UIButton v-if="isShowImportantFilter" color="gray" @click="selectedButton = 'important'"
                    :class="{ 'active': selectedButton === 'important' }">
                    Важное
                </UIButton>
            </div>

            <div class="notifications__box">
                <div class="notifications__day-block" v-for="(group, index) in groupedHistory"
                :key="index">
                    <h4 class="notifications__day-title" v-if="filterGroupByType(group, selectedButton)?.length > 0">{{ formatDate(group[0].date_added) }}</h4>
                    
                    <PagesLkNotificationsCard v-for="(card, index) in filterGroupByType(group, selectedButton)" :key="index"
                    :item="card" />
                </div>
            </div>
        </div>

        <UILoader class="notifications__loader" v-else is-big />

    </div>
</template>

<script setup lang="ts">

const userStore = useUserStore()
const config = useRuntimeConfig();

const groupedHistory = ref([]);

const isLoading = ref(false)

const selectedButton = ref('all');

const isShowOrderFilter = computed(() => groupedHistory.value.some(day => day.some(group => group.type === 'promo')))

const isShowPromoFilter = computed(() => groupedHistory.value.some(day => day.some(group => group.type === 'promo')))

const isShowImportantFilter = computed(() => groupedHistory.value.some(day => day.some(group => group.type === 'important')))

const filterGroupByType = (group: object, selectedType: string) => {
    if (selectedType === 'all') {
        return group;
    }
    return group.filter(item => item.type === selectedType);
}

async function getHistory() {
    isLoading.value = true;

    let history = await userStore.getHistory(userStore.token, config);

    if (history) {
        //@ts-ignore
        const groupedData = history.value.reduce((acc, obj) => {
            const key = obj.date_added.split(' ')[0];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});

        isLoading.value = false;

        groupedHistory.value = Object.values(groupedData) || [];

        console.log(groupedHistory.value);
    }
}

watchEffect(() => {
    getHistory();
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

            &.alone {
                max-width: 80px;
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

    &__loader {
        width: 100%;
        margin: auto;
        margin-top: 40px;
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