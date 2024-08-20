<template>
    <div class="rate-feedback-block">
        <div class="rating" v-if="!isShowMapsBlock">
            <h3 class="rating__title">Расскажите о своем опыте!</h3>
            <p class="rating__subTitle">Расскажите о своем опыте! Оставьте отзыв. Ваши комментарии помогут нам стать
                лучше.
            </p>
            <div class="rating__stars">
                <UIIcon name="star" class="rating__star" :class="{ 'active': button.selected }"
                    v-for="button in rateButtons" @click="rate(button.id)" alt="" />
            </div>
        </div>

        <div class="feedback" v-if="!isRateButtonDisabled && !isShowMapsBlock && !isShowThanksBlock && +starsRate < 4">
            <form class="feedback__form">
                <div class="feedback__item">
                    <label for="user-name" class="feedback__label">Имя</label>
                    <UIInput id="user-name" class="feedback__input feedback__field" @blur="checkName(userName)"
                        @focus="isShowNameIcon = false" v-model="userName" placeholder="Ваше имя">
                    </UIInput>

                    <UIIcon class="feedback__item-icon feedback__item-icon--name"
                        :name="checkName(userName) ? 'tick-circle' : 'close-circle'"
                        v-if="isShowNameIcon && userName?.length > 0" :class="checkName(userName) ? 'green' : 'red'" />
                </div>

                <div class="feedback__item">
                    <label for="user-email" class="feedback__label">Почта</label>
                    <UIInput id="user-email" class="feedback__input feedback__field" @blur="checkEmail(userEmail)"
                        @focus="isShowEmailIcon = false" v-model="userEmail" placeholder="example@gmail.com">
                    </UIInput>

                    <UIIcon class="feedback__item-icon feedback__item-icon--email"
                        :name="checkEmailValidate(userEmail) ? 'tick-circle' : 'close-circle'"
                        v-if="isShowEmailIcon && userEmail?.length > 0"
                        :class="checkEmailValidate(userEmail) ? 'green' : 'red'" />
                </div>

                <div class="feedback__item">
                    <label for="user-comment" class="feedback__label">Ваш отзыв</label>
                    <UITextarea id="user-comment" class="feedback__textarea feedback__field" v-model="userComment"
                        placeholder="Комментарий">
                    </UITextarea>
                </div>
            </form>

            <div class="feedback__images">
                <CommonImageUploader />
            </div>

            <UIButton color="purple" :disabled="!checkEmailValidate(userEmail) || !checkName(userName)"
                @click="submitFeedBack">Далее</UIButton>
        </div>

        <p v-if="+starsRate >= 4">тут будет редирект на страницу для хорошего отзыва</p>

        <PagesFeedBackMaps v-if="isShowMapsBlock && !isShowThanksBlock" @submit="onMapsSelected" />

        <PagesFeedBackThanks v-if="isShowThanksBlock" />
    </div>
</template>

<script lang="ts" setup>
interface RateButton {
    id: number,
    selected: boolean,
}

interface FeedbackRequestBody {
    starsRate: number,
    userName: string,
    userEmail: string,
    userComment: string,
    selectedMaps: string[],
    images: File[],
}

const commonStore = useCommonStore();
const userStore = useUserStore();

const starsRate = ref<number>(0);

const rateButtons = reactive<RateButton[]>([]);

const isRateButtonDisabled = ref<boolean>(true);

const userName = ref<string>('');

const userEmail = ref<string>('');

const userComment = ref<string>('');

const userMaps = ref<string[]>([]);

const isShowNameIcon = ref<boolean>(false);

const isShowEmailIcon = ref<boolean>(false);

const isShowMapsBlock = ref<boolean>(false);

const isShowThanksBlock = ref<boolean>(false);

onMounted(() => {
    for (let i = 0; i < 5; i++) {
        rateButtons.push({ id: i, selected: false });
    }
})

const rate = (id: number) => {
    for (let i = 0; i < 5; i++) {
        if (i <= id) {
            rateButtons[i].selected = true;
        }
        else {
            rateButtons[i].selected = false;
        }
    }

    starsRate.value = id + 1;

    isRateButtonDisabled.value = false;
}

const checkName = (name: string) => {
    isShowNameIcon.value = true;

    return name?.length > 1;
}
const checkEmail = (email: string) => {
    isShowEmailIcon.value = true;

    checkEmailValidate(email);
}

const submitFeedBack = () => {
    isShowMapsBlock.value = true;
}

const onMapsSelected = (maps: Array<string>) => {
    userMaps.value = maps;
    isShowThanksBlock.value = true;

    submit();
}

const submit = async () => {
    const formData = new FormData();

    formData.append('starsRate', starsRate.value.toString());
    formData.append('userName', userName.value);
    formData.append('userEmail', userEmail.value);
    formData.append('userComment', userComment.value);

    userMaps.value.forEach((map, index) => {
        formData.append(`selectedMaps[${index}]`, map);
    });

    //@ts-ignore
    commonStore.uploadedImages.forEach((image, index) => {
        if (image !== null) {
            try {
                const blob = dataURLtoBlob(image);
                formData.append(`image_${index}`, blob, `image_${index}.jpg`);
            } catch (error) {
                console.error(`Ошибка при преобразовании картинки image_${index}:`, error);
            }
        }
    });

    try {
        const { data } = await $fetch(`/api/wp-json/user/bad_feedback?token=${userStore.token}`, {
            method: 'POST',
            body: formData,
        });

        console.log('Отзыв отправлен успешно');
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

const dataURLtoBlob = (dataURL: string): Blob => {
    const byteString = atob(dataURL.split(',')[1]); // Декодируем данные из base64
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]; // Получаем MIME-тип

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}
</script>

<style lang="scss" scoped>
.rate-feedback-block {
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    background: #EBEBEB33;

    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    padding: 32px 24px;
}

.rating {
    position: relative;
    display: flex;
    flex-direction: column;

    margin-bottom: 28px;

    align-items: center;
    justify-content: center;

    color: var(--white);

    &__title {
        font-size: 16px;
        text-transform: uppercase;

        margin-bottom: 10px;
    }

    &__subTitle {
        font-size: 12px;
        font-family: 'Overpass';
        text-align: center;

        margin-bottom: 24px;
    }

    &__stars {
        display: flex;
        gap: 5px;

    }

    &__star {
        display: flex;
        justify-content: center;

        :deep svg g path {
            fill: #F1F1F133;
            stroke: #FFFFFF66;
            height: 34px;
            width: 34px;
        }

        :deep svg {
            height: 34px;
            width: 34px;
        }

        &.active :deep svg path {
            fill: var(--yellow);
        }
    }
}

.feedback {
    width: 100%;
    font-family: 'Overpass';

    display: flex;
    flex-direction: column;

    gap: 24px;

    &__form {
        display: flex;
        flex-direction: column;

        gap: 12px;
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

    &__field {
        color: var(--black);
        font-size: 14px;
        font-weight: 500;

    }
}
</style>