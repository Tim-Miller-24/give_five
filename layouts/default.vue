<template>
    <div class="layout-default">
        <div class="container">
            <MainHeader :extra-class="headerExtraClass" />

            <slot />

            <LayoutFooter v-if="route.name === 'index'" />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const headerExtraClass = computed(() => route.name === 'index' ? 'index' : '')
</script>

<style lang="scss">
.layout-default {
    padding-top: 110px;
}
</style>