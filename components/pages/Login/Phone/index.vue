<template>
    <div class="auth">
        <form class="auth__form" @submit.prevent="onSubmit()">
            <transition name="fade" mode="out-in">
                <div v-if="step === 'phone'" class="auth__line">
                    <label for="" class="auth__label">
                        Телефон
                    </label>

                    <vue-tel-input v-model="phone" mode="international" :auto-format="false" :dropdown-options="{
                        showFlags: true,
                        showDialCodeInList: true,
                        showDialCodeInSelection: true,
                        showSearchBox: true
                    }" :input-options="{
                        type: 'tel',
                        pattern: '[0-9]',
                        placeholder: 'Телефон',
                        required: true
                    }" @on-input="onInputTel" />

                </div>

                <div v-else class="auth__code">
                    <p>
                        Введите код, который был отправлен на вашу почту или телефон.
                    </p>
                    <UICodeInput class="auth__code-input" :fields="4" :field-width="35" :field-height="42" :is-error="isCodeError"
                        :disabled="isLoading" @change="onChangeCode" @complete="onCompleteCode" />
                    <div v-if="isCodeError" class="auth__code-error">
                        Неверный код
                    </div>
                </div>
            </transition>

            <UIButton type="submit" color="purple" :is-loading="isLoading" :disabled="isDisableButton"
                class="auth__button">
                {{ step === 'phone' ? 'Получить код' : 'Подтвердить' }}
            </UIButton>
        </form>

        <UIButton class="back-btn" color="gray2" @click="navigateTo('/login')">Войти другим способом</UIButton>
    </div>
</template>

<script setup lang="ts">
interface PhoneObj {
    countryCallingCode: String
    countryCode: String
    formatted: String
    nationalNumber: String
    number: String
    valid: Boolean
}

import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

const commonStore = useCommonStore()
const userStore = useUserStore()
const config = useRuntimeConfig()

const consumer_key = config.public.CONSUMER_KEY
const consumer_secret = config.public.CONSUMER_SECRET

const isShow = ref(true)

const step = ref<'phone' | 'code'>('phone')
const phone = ref<String | null>(null)
const phoneObj = ref<PhoneObj | null>(null)
const code = ref<String | null>(null)
const isCodeError = ref<Boolean>(false)
const isLoading = ref<Boolean>(false)

watch(() => code.value, () => {
    isCodeError.value = false
})

const isDisableButton = computed(() => {
    if (step.value === 'phone') {
        // return !(phoneObj.value?.valid)
    } else if (step.value === 'code') {
        return !code.value || (code.value && code.value.length !== 4)
    }

    return false
})

const closeModal = () => {
    isShow.value = false
}

const onInputTel = (tel: String, obj: PhoneObj) => {
    phoneObj.value = obj
}

const onChangeCode = (val: String) => {
    code.value = val
}

const onCompleteCode = () => {
}

const toPrevStep = () => {
    step.value = 'phone'
    isCodeError.value = false
}

const sendCode = async () => {
    isLoading.value = true

    const obj = {
        phone: phoneObj.value?.number
    }

    const data = await userStore.sendCode(obj, config);

    isLoading.value = false

    if (data?.value?.success) {
        step.value = 'code';
    }
}

const checkCode = async () => {
    isLoading.value = true

    const obj = {
        phone: phoneObj.value?.number,
        'auth-sms-code': code.value
    }

    const data = await userStore.checkCode(obj, config);

    isLoading.value = false

    if (data?.value?.success) {
        const obj = data.value.user

        await getUser(obj.token)
    } else {
        isCodeError.value = true
        return false
    }
}

const getUser = async (token: string) => {
    isLoading.value = true

    await userStore.getUser(token, config);

    isLoading.value = false

    if (userStore.user) {
        navigateTo('/lk')
        closeModal()
    }

}

const onSubmit = () => {
    // if (step.value === 'phone' && phoneObj.value?.valid) {
    if (step.value === 'phone') {
        sendCode()
    } else if (step.value === 'code') {
        checkCode()
    }
}
</script>

<style lang="scss" scoped>
.auth {
    position: relative;

    margin-top: 16px;

    display: flex;
    flex-direction: column;

    font-family: 'Overpass';

    gap: 16px;

    &__label {
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        text-align: left;

    }

    &__form {
        background: #EBEBEB33;

        position: relative;

        border: 1px solid #FFFFFF0D;
        border-radius: 12px;

        padding: 24px;

        z-index: 1000;
    }

    &__code {

        &-input {
            padding-bottom: 12px;
        }

        &-error {
            font-weight: 400;
            font-size: 14px;
        }

        & > p {
            font-size: 12px;
            font-weight: 400;
            text-align: center;

            margin-bottom: 30px;

        }
    }

    &__button {
        margin-top: 16px;
        width: 100%;
        font-size: 14px;
        font-weight: 600;
        z-index: 500;
    }
}

.back-btn {
    width: 100%;
    z-index: 500;
}

:deep(.vue-tel-input) {
    grid-gap: 10px;

    background: none;
    border: 0;
    box-shadow: none !important;

    font-family: 'Overpass';

    .vti__selection {
        font-size: 14px;
        font-weight: 600;

        .vti__country-code {
            color: var(--white);
            font-weight: 400;
            margin: 0 5px;
        }

        .vti__dropdown-arrow {
            color: var(--grayText2);
        }
    }

    .vti__dropdown {
        padding: 0;
        background: none;
    }

    .vti__dropdown-list {
        width: calc(100vw - 32px);

        max-height: 270px;

        padding: 20px;

        z-index: 1000;

        border: 0;
        border-radius: 12px;
        box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.08);

        border: 1px solid #FFFFFF4D;
        background: #FFFFFF4D;
        // background: black;


        backdrop-filter: blur(25px);

        &.below {
            top: calc(100% + 12px);
            left: -23px;
        }
    }

    .vti__search_box {
        width: calc(100% - 4px);
        z-index: 10000;

        margin: 0;

        border: 0;
    }

    .vti__dropdown-item {
        padding: 8px;
        z-index: 10000;

        &.highlighted {
            background-color: #f3f3f333;
        }
    }

    .vti__input {
        padding: 12px 16px;

        @include text_normal;
        font-weight: 500;

        background: #FFFFFF4D;
        border-radius: 14px;

        &::-webkit-input-placeholder {
            color: var(--grayText);
        }

        &:-moz-placeholder {
            color: var(--grayText);
            opacity: 1;
        }

        &::-moz-placeholder {
            color: var(--grayText);
            opacity: 1;
        }

        &:-ms-input-placeholder {
            color: var(--grayText);
        }

        &::-ms-input-placeholder {
            color: var(--grayText);
        }

        &::placeholder {
            color: var(--grayText);
        }
    }
}
</style>