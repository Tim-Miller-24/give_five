<template>
    <div class="auth">
        <form class="auth__form">
            <div class="auth__item">
                <label for="user-email" class="auth__label">Электронная почта</label>
                <UIInput id="user-email" class="auth__input auth__field" @blur="checkEmail(userEmail)"
                    @focus="isShowEmailIcon = false" v-model="userEmail" placeholder="example@gmail.com">
                </UIInput>

                <UIIcon class="auth__item-icon auth__item-icon--email"
                    :name="checkEmailValidate(userEmail) ? 'tick-circle' : 'close-circle'"
                    v-if="isShowEmailIcon && userEmail?.length > 0"
                    :class="checkEmailValidate(userEmail) ? 'green' : 'red'" />
            </div>

            <div class="auth__item">
                <label for="user-name" class="auth__label">Пароль</label>
                <UIInput type="password" id="user-name" class="auth__input auth__field" @blur="CheckPassword(userPassword)" :isError="!CheckPassword(userPassword) && userPassword?.length > 0" errorText="Не менее 6 символов"
                    @focus="isShowNameIcon = false" v-model="userPassword" placeholder="Ваш пароль">
                </UIInput>

                <UIIcon class="auth__item-icon auth__item-icon--name"
                    :name="CheckPassword(userPassword) ? 'tick-circle' : 'close-circle'"
                    v-if="isShowNameIcon && userPassword?.length > 0" :class="CheckPassword(userPassword) ? 'green' : 'red'" />
            </div>

            <UIButton type="submit" color="purple" class="auth__button">
                Войти
            </UIButton>
        </form>

        <div class="auth__buttons">
            <UIButton class="back-btn" color="gray2" @click="navigateTo('/login')">Войти другим способом</UIButton>
            <UIButton class="back-btn" color="gray1" @click="navigateTo('/login/recovery')">Восстановить пароль</UIButton>
        </div>

    </div>
</template>

<script lang="ts" setup>

const userPassword = ref<string>('');

const userEmail = ref<string>('');

const isShowNameIcon = ref<boolean>(false);

const isShowEmailIcon = ref<boolean>(false);

const CheckPassword = (name: string) => {
    isShowNameIcon.value = true;

    return name?.length > 6;
}
const checkEmail = (email: string) => {
    isShowEmailIcon.value = true;

    checkEmailValidate(email);
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
        font-weight: 500;
        padding-left: 5px;

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