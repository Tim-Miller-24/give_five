<template>
    <div class="order" v-if="+route.params.id !== +props.order.id" :class="[{ 'order--collapsed': isCollapsed }, `order--${props.index}`]">
        <div class="order__header" v-if="!isMobileOrTablet && !isCollapsed">
            <h3 class="order__title">
                Заказ № {{ props.order.id }}
            </h3>

            <div class="order__buttons">
                <UIButton color="yellow" class="button-watch" @click="submitRate"
                    v-if="props.order.status === 'completed' && !rated"
                    :is-loading="isLoading"
                    :disabled="starsRate === 0"
                    >
                    <span> Оценить </span>
                </UIButton>

                <UIButton color="yellow" class="button-watch" @click="openOrder" v-else>
                    <span> Открыть </span>
                </UIButton>

                <UIButton class="button-close" @click="close" v-if="rated || props.order.status === 'cancelled'">
                    <UIIcon name="close-black" />
                </UIButton>
            </div>
        </div>

        <div class="order__info" v-if="!isCollapsed">
            <div class="order__info-box">
                <div class="order__info-box_header">
                    <div class="order__status">
                        <UIIcon v-if="iconName?.length > 0" :name="iconName" class="status-icon" />
                        <span style="padding-top: 2px;"> {{ status }} </span>
                    </div>

                    <div class="modal-rate__stars-box" v-if="props.order.status === 'completed' && !isMobileOrTablet">
                        <button v-if="!rated" class="modal-rate__stars-box--star" :class="{ 'active': button.selected }"
                            v-for="button in rateButtons" @click="rate(button.id)">
                            <UIIcon name="star" />
                        </button>
                        <span v-else>Спасибо!</span>
                    </div>
                    <span class="order__time" style="padding-top: 4px;" v-else-if="!isMobileOrTablet && props.order.status !== 'cancelled'">
                        к {{ deliveryFinishTime }}
                    </span>
                    <!-- <h3 class="order__title" style="padding-top: 4px;"  v-else>
                        Заказ № {{ props.order.id }}
                    </h3> -->
                </div>

                <PagesOrderInfoProgressBlock v-if="isMobileOrTablet" :order="props.order" :deliveryType="delivery_type"
                    :isModal="true" />

            </div>
            <div class="order__buttons" v-if="isMobileOrTablet">
                <UIButton color="yellow" class="button-watch" @click="openOrder">
                    <span v-if="props.order.status === 'completed' && !rated"
                    :is-loading="isLoading"
                    :disabled="starsRate === 0"
                    >
                        Оценить
                    </span>
                    <span v-else> Открыть </span>
                </UIButton>
                <UIButton class="button-close" @click="close">
                    <UIIcon name="close-black" />
                </UIButton>
            </div>
        </div>

        <PagesOrderInfoProgressBlock v-if="!isMobileOrTablet && !isCollapsed" :order="props.order"
            :deliveryType="delivery_type" :isModal="true" />

        <UIButton v-if="!isMobileOrTablet" class="button-toggle" :class="{ 'toggled': isCollapsed }" @click="toggleCollapse">
            <UIIcon name="arrow" />
        </UIButton>
        <div class="order__status" v-if="isCollapsed && !isMobileOrTablet">
            <UIIcon name="clock" class="status-icon status-icon-clock" :class="props.order.status" />
        </div>
        <div class="status-dot" :class="props.order.status" v-if="isCollapsed"></div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';

const commonStore = useCommonStore();
const catalogStore = useCatalogStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();

const allSettings = computed(() => commonStore.allSettings);
const isMobileOrTablet = computed(() => commonStore.isMobileOrTablet)
const showTime = computed(() => commonStore.appSettings?.checkout_show_delivery_time ?? true)

const rated = ref(false);

const delivery_name = ref('');

const delivery_key = ref('');

const delivery_type = ref('');

const status = ref('');

const iconName = ref('');

const rateButtons = reactive([]);

const starsRate = ref(0);

const isRateButtonDisabled = ref(false);

const isLoading = ref(false);

const props = defineProps({
    order: {
        type: Object,
        default: {},
    },
    index: {
        type: Number,
        default: 0,
    }
})

const clientUrl = computed(() => {
    let temp = config.public.BASE_URL

    return temp.replace('https://', '');
})

const userId = computed(() => {
    if (userStore.user) {
        return userStore.user?.id || userStore.user?.ID;
    }
    else {
        return props.order.customer_id;
    }
})


const deliveryFinishTime = computed(() => {
    if (showTime.value) {
        return (props.order.meta_data.find(data => data.key === 'must_be_delivered')?.value)?.split(' ')[1] || '';
    }
    else {
        return (props.order.meta_data.find(data => data.key === 'must_be_delivered')?.value)
    }
})

onMounted(() => {
    const { $pusher } = useNuxtApp();

    const channel = $pusher.subscribe(`${clientUrl.value}_client_${userId.value}_chanel`);

    channel.bind('UpdateOrderEvent', function (data) {
        updateOrderStatus(data)
    });

    for (let i = 0; i < 5; i++) {
        //@ts-ignore
        rateButtons.push({ id: i, selected: false });
    }

    console.log(route.params.id);
    console.log(props.order.id);

    setVars();
})

const setVars = () => {
    try {
        delivery_name.value = props.order?.shipping_lines.length ? props.order?.shipping_lines[0]['method_title'] : ''

        delivery_key.value = props.order?.shipping_lines.length ? props.order?.shipping_lines[0]['method_id'] : '';

        delivery_type.value = delivery_key.value === 'flat_rate' ? 'delivery' : 'pickup';

        //@ts-ignore
        status.value = allSettings.value?.order_status_map[delivery_type.value][props.order.status] || allSettings.value?.order_statuses_all[props.order.status] || props.order.status;
    }
    catch (err) {
        console.error('*****Get order error', err)
    }

    switch (status.value) {
        case 'Ожидание оплаты':
            iconName.value = 'clock';
            break;
        case 'Обработка':
            iconName.value = 'pencil';
            break;
        case 'Изготавливается':
            iconName.value = 'cooking';
            break;
        case 'Готов':
            iconName.value = 'lounge';
            break;
        case 'Ожидает выдачи':
            iconName.value = 'lounge';
            break;
        case 'Курьер выехал':
            iconName.value = 'delivery';
            break;
        case 'Выполнен':
            iconName.value = 'pickup';
            break;

        default:
            break;
    }
}

const updateOrderStatus = (data) => {
    if (+data?.order.id !== +props.order.id) return;

    let currentOrder = catalogStore.activeOrders.find(item => +item.id === +data?.order.id);

    currentOrder.status = data?.order.status;

    catalogStore.updateActiveOrder(currentOrder);

    setVars();
}

const openOrder = () => {
    router.push(`/order/${props.order.id}`);
}

const rate = (id: number) => {
    for (let i = 0; i < 5; i++) {
        if (i <= id) {
            //@ts-ignore
            rateButtons[i].selected = true;
        }
        else {
            //@ts-ignore
            rateButtons[i].selected = false;
        }
    }

    starsRate.value = id + 1;

    isRateButtonDisabled.value = false;
}

const isCollapsed = ref(false);

function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
}

const submitRate = async () => {
    isLoading.value = true;

    await $fetch(`${config.public.BASE_URL}/wp-json/systeminfo/v1/rateorder?order=${props.order?.id}&rate=${starsRate.value}`);

    rated.value = true;
    isLoading.value = false;
    
}

const close = () => {
    catalogStore.removeActiveOrder(props.order);
}

</script>

<style lang="scss" scoped>
.status-icon-clock {
    position: absolute;

    width: 25px !important;
    height: 25px !important;

    top: 50%;
    left: 28px;

    transform: translate(0, -50%);

    &.processing {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #50ADCA !important;

        }
    }

    &.pending {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #EC2525 !important;

        }
    }

    &.making {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #F2A32C !important;

        }
    }

    &.done {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #FF8C21 !important;

        }
    }

    &.kurier {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #AD00FF !important;

        }
    }

    &.wc-completed,
    &.completed {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #089B43 !important;

        }
    }

    &.cancelled {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #EC2525 !important;

        }
    }

    &.wait-stock {
        ::v-deep svg {
            width: 25px !important;
            height: 25px !important;
        }
        ::v-deep svg path {
            fill: #969696 !important;

        }
    }
}

.button-toggle {
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translate(0, -50%);

    min-width: auto;
    padding: 0;
    width: 24px;
    height: 24px;

    ::v-deep(.ui-icon) {
        width: 24px;
        height: 24px;
    }

    ::v-deep(.ui-icon) svg {
        width: 24px;
        height: 24px;
    }

    &.toggled {
        transform: translate(0, -50%) rotate(-180deg);
    }

}

.order {
    position: relative;

    width: 352px;
    height: 112px;
    right: 0;
    border-radius: 14px;
    border: 1px solid var(--grayText2);
    background: var(--white);
    box-shadow: 0px 0px 50px 0px #00000014;

    padding: 16px 32px;

    transition: right 0.3s ease;

    @include mq($bp-small) {
    position: fixed;
    right: 15px;
    z-index: 10;

        @for $i from 0 through 10 {
            &--#{$i} {
            top: calc(100px * ($i + 1) + 20px * $i);
            }
        }
    }


    &--collapsed {
        right: -290px;

        .order__info {
            display: none;
        }
    }

    @include maq($bp-small) {
        border: none;
        background: var(--blackText3);
        width: 100%;
        height: 56px;
        border-radius: 14px;

        padding: 12px 32px;
    }

    @include maq($bp-small-medium) {
        padding: 12px 25px;
    }

    &__header {
        display: flex;
        align-items: center;

        justify-content: space-between;
    }

    &__title {
        font-size: 13px;
        color: var(--grayText);
    }


    &__buttons {
        display: flex;
        align-items: center;

        gap: 8px;

        &>.button-watch {
            padding: 7px 20px;
            height: 32px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 12px;

            @include maq($bp-small) {
                color: var(--black)
            }
        }

        &>.button-close {
            min-width: auto;
            padding: 0;
            width: 18px;
            height: 18px;

            ::v-deep(.ui-icon) {
                width: 18px;
                height: 18px;
            }

            ::v-deep(.ui-icon) svg {
                width: 18px;
                height: 18px;
            }

            ::v-deep(.ui-icon) path {
                fill: var(--grayText);
            }
        }
    }

    &__info {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;

        &-box {
            display: flex;
            justify-content: space-between;
            width: 100%;

            &_header {
                justify-content: space-between;
                display: flex;

                @include mq($bp-small) {
                    width: 100%;
                }
            }

            @include maq($bp-small) {
                width: 70%;
                flex-direction: column;
            }
        }

        @include maq($bp-small) {
            margin-top: 0;
            gap: 20px;
            color: var(--white)
        }
    }

    &__status {
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;

        @include maq($bp-small) {
            & > span {
                @include overflow-text();
                width: 100%;
            }
        }

        &>.status-icon {
            height: 16px;
            width: 17px;

            margin-right: 3px;

            ::v-deep svg {
                height: 16px;
                width: 17px;
            }

            ::v-deep svg path {
                fill: var(--black);

                @include maq($bp-small) {
                    fill: var(--white)
                }
            }
        }
    }

    &__time {
        font-size: 13px;
        font-weight: 600;
        color: var(--grayText);
    }
}

.modal-rate__stars-box {
    display: flex;
    justify-content: center;

    ::v-deep(.ui-icon) svg {
        width: 20px;
        height: 20px;

        & path {
            fill: #D9D9D9;
        }
    }

    &--star.active ::v-deep(.ui-icon) svg path {
        fill: #FEDE59;
    }
}
</style>