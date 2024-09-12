<script setup>
import { useNuxtApp } from '#app';

const userStore = useUserStore()
const commonStore = useCommonStore();
const cartStore = useCartStore()
const catalogStore = useCatalogStore();

const config = useRuntimeConfig();

const order = ref(userStore.currentOrder);

const isShow = ref(true);

const allSettings = computed(() => commonStore.allSettings);

const delivery_name = ref('');

const delivery_key = ref('');

const delivery_type = ref('');

const status = ref('');

const starsRate = ref(null);

const comment = ref('');

const isShowCancelOrderModal = ref(false);

const { $pusher } = useNuxtApp();

const clientUrl = computed(() => {
  let temp = config.public.BASE_URL

  return temp.replace('https://', '');
})

const userId = computed(() => {
    if (userStore.user) {
        return userStore.user?.id || userStore.user?.ID;
    }
    else {
        return order.value.customer_id;
    }
})

onMounted(() => {
    try {
        delivery_name.value = order.value?.shipping_lines.length ? order.value?.shipping_lines[0]['method_title'] : ''

        delivery_key.value = order.value?.shipping_lines.length ? order.value?.shipping_lines[0]['method_id'] : '';

        delivery_type.value = delivery_key.value === 'flat_rate' ? 'delivery' : 'pickup';

        status.value = allSettings.value?.order_status_map[delivery_type.value][order.value.status] || allSettings.value?.order_statuses_all[order.value.status] || order.value.status;
    }
    catch (err) {
        console.error('*****Get order error', err)
    }

    formatDate();

    const channel = $pusher.subscribe(`${clientUrl.value}_client_${userId.value}_chanel`);
  
    channel.bind('UpdateOrderEvent', function (data) {
        updateOrderStatus(data)
    });

    starsRate.value = order.value.meta_data.find(stars => stars.key === 'rate_order')?.value
    comment.value = order.value.meta_data.find(stars => stars.key === 'rate_order_text')?.value
})

const updateOrderStatus = (data) => {
    if (+data?.order.id !== +order.value.id) return;

    let currentOrder = userStore.currentOrder;

    order.value.status = data?.order.status;
}

const formatDate = () => {
    let date = new Date(order.value.date_created);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    order.value.delivery_name = delivery_name.value;
    order.value.billing_gatetimecheckout = formattedTime;
}

const repeatOrder = () => {
    if (cartStore.cartItemsLength > 0) {
        commonStore.toggleShowAcceptModal(true)
        return;
    }

    for (let item of order.value.line_items.filter(item => +item.subtotal !== 0)) {
        cartStore.addToCart(catalogStore.getProductById(item.product_id));
    }

    navigateTo('/order');

    closeModal();
}

const rateOrder = () => {
    commonStore.toggleShowRateModal(true);
}

const closeModal = () => {
    commonStore.toggleShowOrderModal(false);
    document.body.classList.remove('overflow-hidden');
}

const acceptModal = async () => {
    if (isShowCancelOrderModal.value) {
        const config = useRuntimeConfig();

        const obj = {
            order_id: order.value.id,
            status: 'cancelled',
            token: userStore.token
        }

        const data = await $fetch(`${config.public.BASE_URL}/wp-json/customer/order/status`, {
            method: "POST",
            body: obj
        })  
        status.value = 'cancelled'

        closeModal();
    }
    else {
        cartStore.clearCart();
        repeatOrder();
        commonStore.toggleShowAcceptModal(false)
    }
}

function cancel() {
    isShowCancelOrderModal.value = true;
    commonStore.toggleShowAcceptModal(true);
}
</script>

<template>

    <ModalsOverlay @close="closeModal">

        <div class="page-order-info" v-if="order && !commonStore.isMobileOrTablet">
            <div class="container">
                <div class="page-order-info__header">
                    <div class="page-order-info__header-info">
                        <h1 class="page-order-info__title">
                            Заказ № {{ order.id }}
                        </h1>
                    </div>
                    <UIIcon @click="closeModal" :name="'close-black'" class="close-modal-btn" />
                </div>
                <div class="page-order-info__box">
                    <section class="page-order-info__section">
                        <div class="page-order-info__content">
                            <PagesOrderInfoProgressBlock :order="order" :deliveryType="delivery_type" />
                            <PagesOrderInfoAboutBlock @cancel="cancel" :status="status" :info="order.shipping" :order="order" />

                            <div v-if="starsRate">
                                <div class="rate">
                                    <p class="rate__mark"> Оценка: {{ starsRate }} </p>
                                    <span class="rate__star" v-for="i in 5" :key="i"
                                    :class="{'active' : i <= +starsRate}">
                                        <UIIcon name="star" />
                                    </span>
                                </div>

                                <p class="rate__comment"> {{ comment }} </p>
                            </div>
                        </div>


                        <div class="page-order-info-buttons">
                            <UIButton v-if="!starsRate && order.status === 'completed'"
                            class="page-order-info-buttons__button page-order-info-buttons__button--rate"
                                @click="rateOrder">
                                Оценить
                            </UIButton>
                            <UIButton class="page-order-info-buttons__button page-order-info-buttons__button--repeat"
                                @click="repeatOrder">
                                <UIIcon name="repeat" />
                                Повторить
                            </UIButton>
                        </div>

                    </section>

                    <div class="vertical__line"></div>

                    <aside class="page-order-info__aside page-order-info-aside">
                        <PagesOrderInfoComposition :items="order.line_items" :order="order"
                            class="page-order-info__composition" />
                    </aside>
                </div>
            </div>
        </div>

        <CommonBottomSheet v-else @closeModal="closeModal" :isOrder="true">
            <div class="page-order-info" v-if="order">
                <div class="container">
                    <div class="page-order-info__header">
                        <div class="page-order-info__header-info">
                            <h1 class="page-order-info__title">
                                Заказ № {{ order.id }}
                            </h1>
                        </div>
                        <UIIcon @click="closeModal" :name="'close-black'" class="close-modal-btn" />
                    </div>
                    <div class="page-order-info__box">
                        <section class="page-order-info__section">
                            <div class="page-order-info__content">
                                <PagesOrderInfoProgressBlock :order="order" :deliveryType="delivery_type" />

                                <PagesOrderInfoAboutBlock @cancel="cancel" :status="status" :info="order.shipping" :order="order"
                                    :styleClass="'page-order-info__about-block'" />
                            </div>


                        </section>

                        <div class="vertical__line"></div>

                        <aside class="page-order-info__aside page-order-info-aside">
                            <PagesOrderInfoComposition :items="order.line_items" :order="order"
                            class="page-order-info__composition" />

                            <div v-if="starsRate">
                                    <div class="rate">
                                        <p class="rate__mark"> Оценка: {{ starsRate }} </p>
                                        <span class="rate__star" v-for="i in 5" :key="i"
                                        :class="{'active' : i <= +starsRate}">
                                            <UIIcon name="star" />
                                        </span>
                                    </div>

                                    <p class="rate__comment">{{ comment }}</p>
                            </div>

                            <div class="page-order-info-buttons">
                                <UIButton v-if="!starsRate && order.status === 'completed'"
                                class="page-order-info-buttons__button page-order-info-buttons__button--rate"
                                    @click="rateOrder">
                                    Оценить
                                </UIButton>
                                <UIButton
                                    class="page-order-info-buttons__button page-order-info-buttons__button--repeat"
                                    @click="repeatOrder">
                                    <UIIcon name="repeat" />
                                    Повторить
                                </UIButton>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </CommonBottomSheet>

        <LazyModalsAccept v-if="commonStore.isShowAcceptModal" 
        :title="`${(!isShowCancelOrderModal ? 'В корнизе уже имеются товары' : 'Заказ уже обработан')}`"
        :text="`${(!isShowCancelOrderModal ? 'Желаете очистить корзину для повторения заказа?' : 'Желаете отменить заказ?')}`" 
        @cancel="isShowCancelOrderModal = false"
        @close="isShowCancelOrderModal = false"
        @accept="acceptModal" 
        />

        <LazyModalsOrderRate v-if="commonStore.isShowRateModal" :order="order" @closeModal="closeModal" />

    </ModalsOverlay>

</template>

<style lang="scss" scoped>
::v-deep(.modal__content) {
    @include mq($bp-small) {
        width: 90%;
    }
    @include mq($bp-bigger) {
        width: 80%;
    }
}

::v-deep(.modal-accept) {
    margin: auto;

    @include maq($bp-small) {
        width: 100%;
    }
}
.rate {
    display: flex;
    align-items: center;

    @include maq(699px) {
        margin-top: 30px;
    }

    &__mark {
        font-size: 16px;
        font-weight: 600;
        margin-right: 20px;
    }

    &__comment {
        font-size: 16px;
        max-width: 400px;
        width: 100%;
        overflow-wrap: break-word;
        overflow: hidden;
    }


    ::v-deep(.ui-icon) svg {
        width: 18px;
        height: 18px;

        & path {
            fill: #D9D9D9;
        }
    }

    &__star.active ::v-deep(.ui-icon) svg path {
        fill: #FEDE59;
    }
}
.close-modal-btn {
    width: 30px;
    height: 30px;

    &:hover {
        cursor: pointer;
    }
}

.vertical__line {
    height: 500px;
    width: 2px;
    background: #F5F4F2;

    @include maq($bp-medium) {
        height: 2px;
        width: 100%;
    }
}

.page-order-info {
    padding: 10px 0 60px;
    background: #ffffff;
    border-radius: 40px;

    @include mq($bp-medium) {
        padding: 60px 0;
    }

    @include maq(699px) {
        margin-top: 0;
        padding-bottom: 30px;
    }

    @include maq(400px) {
        margin-left: -15px;
        margin-right: -15px;
    }

    &__box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 40px;

        grid-gap: 50px;

        @include mq($bp-medium) {
            flex-direction: row;
            justify-content: space-around;
        }

        @include maq(699px) {
            padding: 0;
            gap: 30px;
        }
    }

    &__progress {
        @include maq(380px) {
            width: 90%;
        }
    }

    &__composition {
        box-shadow: none;
        padding: 0;
        background: #ffffff;
    }

    &__section {
        flex: 1 1 auto;

        display: flex;
        flex-direction: column;
        grid-gap: 60px;

        @include mq($bp-medium) {
            max-width: 767px;
        }

        @include maq($bp-medium) {
            width: 100%;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        grid-gap: 40px;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;
        margin-bottom: 50px;

        @include maq($bp-medium) {
            margin-top: 40px;
        }

        @include maq(699px) {
            margin-top: 0;
            padding: 0;
            margin-bottom: 40px;
        }
    }

    &__icon {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 40px;
        height: 40px;

        background: var(--green);
        border-radius: 50%;

        ::v-deep(.ui-icon) svg path {
            fill: var(--white);
        }
    }

    // &__about-block {
    //     @include maq(375px) {
    //         width: 90%;
    //     }
    // }

    &__header-info {
        display: flex;
        flex-direction: column;
        grid-gap: 12px;
    }

    &__title {
        font-weight: 700;
        font-size: 24px;
        color: var(--black);
    }

    &__order-number {
        @include text_large;
        font-weight: 700;
        color: var(--grayText);
    }

    &__aside {
        width: 30%;
        min-width: 300px;

        @include maq($bp-medium) {
            width: 100%;
        }
    }
}

.page-order-info-steps {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 33px;
}

.page-order-info-step {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    grid-gap: 6px;

    color: var(--grayText);

    &:before {
        content: '';
        position: absolute;
        top: 24px;
        right: calc(50% + 24px);

        width: 120px;

        border: 1px dashed var(--grayText);
    }

    &:first-child {
        &:before {
            display: none;
        }
    }

    &.active {
        color: var(--black);

        &:before {
            border-style: solid;
        }

        .page-order-info-step {
            &__number {
                border-color: var(--black);
            }
        }
    }

    &__number {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 48px;
        height: 48px;

        @include text_large;
        font-weight: 700;

        background: var(--white);
        border: 1px solid var(--grayText);
        border-radius: 50%;
        z-index: 1;
    }

    &__label {
        @include text_mini;
        font-weight: 600;
    }
}

.page-order-info-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    gap: 10px;

    @include maq(699px) {
        margin-top: 40px;
    }

    &__button {
        font-weight: 500;
        width: 100%;

        &--rate {
            border: 2px solid #FEDE59;

            &:hover {
                background: #fcfcee;
            }
        }

        &--repeat {
            background: #FEDE59;

            &:hover {
                background: #eed059;
            }
        }
    }
}
</style>
