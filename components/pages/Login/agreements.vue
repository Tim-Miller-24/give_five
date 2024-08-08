<template>
    <div class="agreements">
        <div class="agreements__block">
            <p>Нажимая любую кнопку, вы принимаете условия</p>
            <NuxtLink class="agreements__link">Лицензионного соглашения.</NuxtLink>
        </div>
        <div class="agreements__block">
            <p>Условия и цели обработки персональных данных определены в</p>
            <NuxtLink class="agreements__link">
                Политике конфиденциальности.
            </NuxtLink>
            <NuxtLink class="agreements__link">
                Политика обработки персональных данных.
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.agreements {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    text-align: center;

    padding: 24px;

    gap: 24px;

    font-family: 'Overpass';
    font-size: 12px;
    font-weight: 400;

    &__block {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    &__link {
        color: var(--blue);
    }
}
</style>