<template>
    <div class="recovery">
        <form class="recovery__form start" v-if="step === 1">
            <h4 class="recovery__title">Укажите электронную почту или телефон. Мы вышлем код для восстановления пароля.
            </h4>
            <div class="recovery__item">
                <label for="user-email-or-phone" class="recovery__label">Телефон или электронная почта</label>
                <UIInput id="user-email-or-phone" class="recovery__input recovery__field" @blur="checkInputData(inputData)"
                    @focus="isShowIcon = false" v-model="inputData" placeholder="Телефон или почта">
                </UIInput>

                <UIIcon class="recovery__item-icon recovery__item-icon--email"
                    :name="checkInputData(inputData) ? 'tick-circle' : 'close-circle'"
                    v-if="isShowIcon && inputData?.length > 0" :class="checkInputData(inputData) ? 'green' : 'red'" />
            </div>

            <UIButton color="purple" class="recovery__button" :is-loading="isLoading"
                :disabled="isDisableButton" @click="sendCode">
                Продолжить
            </UIButton>
        </form>

        <form class="recovery__form code" v-if="step === 2">
            <h4 class="recovery__title">Введите код, который был отправлен на вашу почту или телефон.</h4>
            <div class="recovery__item">
                <UICodeInput class="auth__code-input" :fields="4" :field-width="35" :field-height="42"
                    :is-error="isCodeError" :disabled="isLoading" @change="onChangeCode" />
                <div v-if="isCodeError" class="auth__code-error">
                    Неверный код
                </div>
            </div>

            <UIButton color="purple" class="recovery__button" :is-loading="isLoading"
                :disabled="isDisableButton" @click="checkCode">
                Подтвердить
            </UIButton>
        </form>

        <form class="recovery__form new" v-if="step === 3">
            <h4 class="recovery__title">Введите и подтвердите новый пароль.
            </h4>
            <div class="recovery__item">
                <label for="user-new-password" class="recovery__label">Пароль</label>
                <UIInput type="password" id="user-new-password" class="recovery__input recovery__field"
                    v-model="newPassword" placeholder="пароль">
                </UIInput>
            </div>
            <div class="recovery__item">
                <label for="user-new-password-copy" class="recovery__label">Подтвердите пароль</label>
                <UIInput type="password" id="user-new-password-copy" class="recovery__input recovery__field" @blur="isNewPasswordError = true"
                    @focus="isNewPasswordError = false" v-model="newPasswordCopy" placeholder="пароль" :isError="isDisableButton && isNewPasswordError" errorText="Пароли должны совпадать">
                </UIInput>
            </div>

            <UIButton color="purple" class="recovery__button" :disabled="isDisableButton || !isNewPasswordError" @click="saveAndLogin">
                Сохранить пароль и войти
            </UIButton>
        </form>
    </div>
</template>

<script lang="ts" setup>

const inputData = ref<string>('');

const isShowIcon = ref<boolean>(false);

const step = ref<number>(1);

const code = ref<String | null>(null)
const isCodeError = ref<Boolean>(false)
const isNewPasswordError = ref<Boolean>(false);
const isLoading = ref<Boolean>(false)

const newPassword = ref<string>('');
const newPasswordCopy = ref<string>('');

const isDisableButton = computed(() => {
    if (step.value === 1) {
        return !checkInputData(inputData.value);
    }
    else if (step.value === 2) {
        return !code.value || (code.value && code.value.length !== 4)
    }
    else if (step.value === 3) {
        return !(newPassword.value === newPasswordCopy.value);
    }
})

const checkInputData = (data: string) => {
    isShowIcon.value = true;

    let emailValide = checkEmailValidate(data);

    let phoneValide = checkPhoneValidate(data);

    return (emailValide || phoneValide);
}

const sendCode = async () => {
    // 

    step.value++;
}

const checkCode = async () => {
    //

    step.value++;
}

const onChangeCode = (val: String) => {
    code.value = val
}

const saveAndLogin = () => {
    //

    navigateTo('/lk')
}
</script>

<style lang="scss" scoped>
.recovery {
    position: relative;

    margin-top: 16px;

    display: flex;
    flex-direction: column;

    font-family: 'Overpass';

    gap: 16px;

    &__title {
        font-size: 12px;
        font-weight: 400;
        text-align: center;
    }

    &__label {
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        text-align: left;
        font-weight: 500;
        padding-left: 10px;

    }

    &__form {
        background: #EBEBEB33;

        position: relative;

        border: 1px solid #FFFFFF0D;
        border-radius: 12px;

        padding: 24px;

        display: flex;
        flex-direction: column;

        gap: 12px;

        z-index: 1000;
    }

    &__item {
        position: relative;

        &-icon {
            position: absolute;

            right: 15px;
            top: 35px;

            &.red {
                :deep svg path {
                    fill: var(--red);
                }
            }

            &.green {
                :deep svg path {
                    fill: var(--green);
                }
            }
        }
    }

    &__buttons {
        display: flex;
        flex-direction: column;
        gap: 4px;
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
</style>