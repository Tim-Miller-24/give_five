<template>
    <div class="info-page">
        <div class="info-page__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3> {{ title }} </h3>
        </div>

        <div class="info-page__content" v-if="content" v-html="content"></div>

        <UILoader is-big v-else class="info-page__loader"></UILoader>

    </div>
</template>

<script setup>
const commonStore = useCommonStore();
const config = useRuntimeConfig();

const content = ref('');
const title = ref('');

const data = ref(null);

const route = useRoute();
const { slug } = route.params;

try {
    data.value = await commonStore.getInfoPage(slug, config);

    let response = data?.value?.value || null

    if (response.length) {
        content.value = response[0]?.content?.rendered;

        title.value = response[0]?.title?.rendered;

        // useHead({ title: [`${response[0]?.title?.rendered}`] })
    } else {
        data.value = await commonStore.getPost(slug, config);

        response = data?.value?.value || null

        if (response) {
            content.value = response[0]?.content?.rendered;

            title.value = response[0]?.title?.rendered;

            // useHead({ title: [`${response[0]?.title?.rendered}`] })
        }
    }

} catch (err) { console.log(err); }


</script>

<style lang="scss" scoped>
.info-page {
    padding-bottom: 40px;

    position: relative;

    &__title {
        display: flex;

        align-items: center;

        text-transform: uppercase;

        text-wrap: nowrap;

        position: relative;

        &>h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
    }

    &__content {
        margin-top: 16px;
        background: #EBEBEB33;
        padding: 16px;
        border-radius: 12px;

        font-family: 'Overpass';
    }

    &__loader {
        margin: auto;
        margin-top: 40px;
    }
}

.ui-icon {
    background: #FFFFFF4D;
    border: 1px solid #FFFFFF4D;

    min-width: 35px;
    min-height: 35px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    :deep svg path {
        fill: var(--white);
    }
}
</style>