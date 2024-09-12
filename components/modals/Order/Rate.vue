<script lang="ts" setup>
const commonStore = useCommonStore()
const config = useRuntimeConfig();

const isShow = ref(true);

const starsRate = ref(0);

const isRateButtonDisabled = ref(true);

const rateButtons = reactive([]);

const comment = ref('');

const props = defineProps({
    order: {
        type: Object,
        default: {},
    }
})

const emits = defineEmits(['closeModal', 'rated'])

onMounted(() => {
    for (let i = 0; i < 5; i++) {
        //@ts-ignore
        rateButtons.push({ id: i, selected: false });
    }
})

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

async function submit() {
    closeModal();
    
    await $fetch(`${config.public.BASE_URL}/wp-json/systeminfo/v1/rateorder?order=${props.order?.id}&rate=${starsRate.value}&text=${comment.value}`);

    emits('rated', starsRate.value)
    emits('closeModal');
}

const closeModal = () => {
    commonStore.toggleShowRateModal(false);
    isShow.value = false;
    document.body.classList.remove('overflow-hidden');
}
</script>

<template>
    <ModalsOverlay :is-show="isShow" @close="commonStore.toggleShowRateModal(false)">

        <div v-if="!commonStore.isMobileOrTablet" class="modal-rate">
            <div class="modal-rate__header">
                <p class="modal-rate__title">
                    Оцените заказ
                </p>

                <a href="#" rel="nofollow" class="modal-rate__close" @click.prevent="closeModal()">
                    <UIIcon name="close" />
                </a>
            </div>

            <div class="modal-rate__stars-box">
                <button class="modal-rate__stars-box--star" :class="{ 'active': button.selected }"
                    v-for="button in rateButtons" @click="rate(button.id)">
                    <UIIcon name="star" />
                </button>
            </div>

            <UITextarea v-model="comment" placeholder="Ваш комментарий" class="modal-rate__input"></UITextarea>

            <div class="modal-rate__buttons">
                <UIButton :disabled="isRateButtonDisabled" color="yellow" class="modal-rate__button" @click="submit">
                    Оценить
                </UIButton>
            </div>
        </div>

        <CommonBottomSheet v-else @closeModal="closeModal">
            <div class="modal-rate">
                <div class="modal-rate__header">
                    <p class="modal-rate__title">
                        Оцените заказ
                    </p>

                    <a href="#" rel="nofollow" class="modal-rate__close" @click.prevent="closeModal()">
                        <UIIcon name="close" />
                    </a>
                </div>

                <div class="modal-rate__stars-box">
                    <button class="modal-rate__stars-box--star" :class="{ 'active': button.selected }"
                        v-for="button in rateButtons" @click="rate(button.id)">
                        <UIIcon name="star" />
                    </button>
                </div>

                <UITextarea v-model="comment" placeholder="Ваш комментарий" class="modal-rate__input"></UITextarea>

                <div class="modal-rate__buttons">
                    <UIButton :disabled="isRateButtonDisabled" color="yellow" class="modal-rate__button"
                        @click="submit">
                        Оценить
                    </UIButton>
                </div>
            </div>
        </CommonBottomSheet>

    </ModalsOverlay>
</template>

<style lang="scss" scoped>
.modal-rate {
    width: 100vw;
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    grid-gap: 50px;

    margin-top: 0;

    padding: 20px;

    background: var(--white);

    @include mq($bp-small) {
        min-height: auto;
        max-width: 600px;

        padding: 50px 60px;

        margin: auto;

        border-radius: 40px;
    }

    @include maq(699px) {
        margin-top: 0;
        width: 100%;
    }

    &__close {
        ::v-deep(.ui-icon) svg {
            width: 28px;
            height: 28px;

            path {
                fill: var(--blackText);
            }
        }
    }

    &__stars-box {
        display: flex;
        justify-content: center;

        ::v-deep(.ui-icon) svg {
            width: 35px;
            height: 35px;

            & path {
                fill: #D9D9D9;
            }
        }

        &--star.active ::v-deep(.ui-icon) svg path {
            fill: #FEDE59;
        }
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__title {
        @include h2;
    }

    &__main {
        @include text_big;
        font-weight: 600;
    }

    &__buttons {
        display: flex;
        flex-direction: column;
        grid-gap: 12px;
    }

    &__button {
        font-weight: 500;
    }
}
</style>