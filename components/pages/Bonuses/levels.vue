<template>
    <div class="levels-page">
        <div class="levels" v-if="!isLoading">
            <div class="levels__stage">
                <div class="left">
                    <p>{{ capitalizeFirstLetter(currentLevel?.name) }} </p>
                    <div style="color: var(--grayText);">Уровень</div>
                </div>
                <div class="right">
                    <p>
                        <span>{{ balance }}</span>
                        <UIIcon class="icon" name="icon-coin" />
                    </p>
                    <div style="color: var(--grayText);">
                        {{ declOfNum(balance, ['Бонус', 'Бонуса', 'Бонусов']) }}
                    </div>
                </div>
            </div>

            <div class="levels__progress-block">
                <span class="current-level"> {{ (+spentSum).toLocaleString() }} ₽ </span>
                <span class="for-next-level" v-if="nextLevel"> {{ (+nextLevel.value).toLocaleString() }} ₽ </span>
                <div class="levels__progress-bar" :style="`width: ${percentageToNextLevel}%`" />
            </div>

            <div class="levels__info">
                <p class="levels__next-text" v-if="nextLevel">
                    Вам осталось купить на <span> {{ (nextLevel.value - spentSum).toLocaleString() }} ₽</span>, чтобы
                    получить уровень {{ capitalizeFirstLetter(nextLevel?.name) }}
                </p>
                <p class="levels__next-text" v-else>
                    Вы достигли максимального уровня.
                </p>
                <UIIcon class="info-circle" name="info-circle" />
            </div>
        </div>

        <UILoader class="levels__loader" is-big v-else />
    </div>
</template>

<script lang="ts" setup>
import declOfNum from '@/utils/declOfNum'

const userStore = useUserStore()
const config = useRuntimeConfig();

const isLoading = ref(false)
const balance = ref(0)
const qrCode = ref('');

const cashbackGauge = ref(null);

const spentSum = ref(0);

// <!-- Computed -->
const user = computed(() => userStore.user)

const currentLevel = computed(() => {
    if (cashbackGauge.value) {
        return cashbackGauge.value.slice().reverse().find(level => spentSum.value >= level.value) || cashbackGauge.value[0];

    }
});

const nextLevel = computed(() => {
    if (cashbackGauge.value) {
        return cashbackGauge.value.find(level => spentSum.value < level.value) || null;
    }
});

const amountToNextLevel = computed(() => {
    return nextLevel.value ? nextLevel.value.value - spentSum.value : 0;
});

const percentageToNextLevel = computed(() => {
    if (spentSum.value && nextLevel.value) {
        return ((+spentSum.value * 100) / +nextLevel.value.value)
    }
    if (!nextLevel.value) {
        return 100;
    }

    return 0;
});

// <!-- Methods -->
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string[0].toUpperCase() + string.slice(1);
}

const getBalance = async () => {
    isLoading.value = true

    const data = await userStore.getBalance(config);

    isLoading.value = false

    const obj = data?.value || null

    if (obj) {
        cashbackGauge.value = obj.cashback_gauge;
        spentSum.value = obj.spent_sum || 0;
        balance.value = obj.points_balance
        qrCode.value = obj.qr_code;
    }
}

onMounted(() => {
    getBalance();
})
</script>

<style lang="scss" scoped>
:deep(.icon) svg path {
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

            padding: 12px 16px;

            backdrop-filter: blur(10px);

            border-radius: 16px;
        }

        &>.right p {
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
        border: 1px solid #FFFFFF0D;
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

        &>.info-circle {
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);

            &:deep svg path {
                fill: var(--white);
            }
        }
    }

    &__next-text {
        width: 90%;

        &>span {
            text-wrap: nowrap;
        }
    }

    &__loader {
        display: flex;
        align-items: center;
        justify-content: center;

        min-height: 100px;

        margin: auto;

        &:deep svg circle {
            stroke: var(--white) !important;
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