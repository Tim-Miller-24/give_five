<template>
    <div class="agreements">
        <UICheckbox v-if="props.conditionText"
        :isAlignStart="true" class="agreements__checkbox"> 
            {{ props.conditionText }}
        </UICheckbox>
        <UICheckbox :isAlignStart="true" class="agreements__checkbox"> Согласен с условиями
            <br>
            <NuxtLink to="/" class="agreements__link">
                Пользовательского соглашения
            </NuxtLink>
            <br>
            <NuxtLink to="/" class="agreements__link">
                Политика обработки персональных данных
            </NuxtLink>

        </UICheckbox>

    </div>
</template>

<script setup>
const props = defineProps({
    conditionText: {
        type: String,
        default: '',
    }
})
</script>

<style lang="scss" scoped>
.agreements {
    position: relative;

    background: #EBEBEB33;

    border: 1px solid #FFFFFF0D;
    border-radius: 12px;

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    padding: 24px;

    gap: 24px;

    font-family: 'Overpass';

    &__checkbox {
        display: flex;
        align-content: start;
        justify-content: start;

        font-weight: 400;
        font-size: 12px;
    }

    &__link {
        color: var(--blue);
    }
}
</style>