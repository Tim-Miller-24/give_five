<template>
    <div class="maps">
        <div class="maps__header">
            <h4 class="maps__title">Расскажите о своем опыте!</h4>
            <p class="maps__subTitle">Расскажите о своем опыте! Оставьте отзыв. Ваши комментарии помогут нам стать
                лучше.</p>
        </div>

        <div class="maps__checks">
            <UICheckbox v-model="selected" value="2Gis">2Gis</UICheckbox>
            <UICheckbox v-model="selected" value="Yandex карты">Yandex карты</UICheckbox>
            <UICheckbox v-model="selected" value="Google maps">Google maps</UICheckbox>
        </div>

        <UIButton class="maps__submit-button" @click="emits('submit', selected)" color="purple">Отправить</UIButton>
    </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['submit'])

const selected = ref<Array<String>>();
</script>

<style lang="scss" scoped>
.maps {
    width: 100%;
    text-align: center;
    font-family: 'Overpass';

    display: flex;
    flex-direction: column;
    gap: 24px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__title {
        font-weight: 500;
        font-family: 'Oswald';
        font-size: 16px;

        text-transform: uppercase;
    }

    &__subTitle {
        font-size: 12px;
    }

    &__checks {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__submit-button {
        width: 100%;
    }
}
</style>