<template>
    <div class="wheel-page">
        <div class="wheel-page__title">
            <NuxtLink to="/">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>Колесо фортуны</h3>
        </div>

        <div v-if="response" v-html="response" class="game"></div>

        <div v-else class="loader">
            <UILoader is-big />
        </div>

    </div>
</template>

<script lang="ts" setup>

const userStore = useUserStore();
const config = useRuntimeConfig();

const response = ref<null | object>(null);

const data = await userStore.getGame(config);

response.value = data?.value || null;
</script>

<style lang="scss" scoped>
.wheel-page {
    position: relative;

    padding-bottom: 40px;
    margin-top: 0;

    &__title {
        display: flex;

        align-items: center;

        width: 100%;

        position: relative;

        &>h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            text-transform: uppercase;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
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

.game {
    width: 80%;
    position: relative;

    padding-bottom: 60px;

    @include maq($bp-medium) {
        width: 100%;
    }

    :deep(.wheel) {
        background: #EBEBEB33;
        border: 1px solid #FFFFFF0D;
        border-radius: 12px;

        padding: 24px;

        padding-bottom: 90px;
    }

    :deep(.canvas-wrapper) {
        max-width: 400px;
        width: 100%;
    }

    &:deep(.triangle) {
        z-index: 1000;
        top: 22px;
        width: 2rem;
        height: 2rem;
    }

    &:deep(.wheel-button) {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 200px;

        z-index: 2000;


        margin: auto;

        &>button {
            background: var(--purple2);

            min-width: min-content;
            width: calc(100% - 40px) !important;

            height: 42px;
            padding: 12px 16px 12px 16px;
            gap: 8px;
            border-radius: 8px;

            font-family: 'Overpass';
            font-size: 14px;
            font-weight: 600;
            text-align: center;

        }
    }

    :deep(.week-days) {
        width: 80%;

        @include maq($bp-big) {
            width: 100%;
        }
    }

    :deep(.week-days-wrapper) {
        display: flex;
        flex-direction: column;

        @include maq($bp-super-small) {
            height: 100px;
        }

        &>.part1 {
            justify-content: space-between;
        }

        &>.part2 {
            width: 100%;

            &>.week-days-element.day7 {
                width: 100%;
                height: 42px;
                border-radius: 8px;
                display: flex;
                flex-direction: row;

                & div span {
                    color: var(--white) !important;

                    font-size: 14px;
                    font-family: 'Overpass';
                    font-weight: 600;

                    background: transparent !important;

                    -webkit-text-fill-color: var(--white);

                }

                & div {
                    display: flex;
                    flex-direction: row;
                    gap: 4px;

                    justify-content: center;
                    align-items: center;

                    & #sunday_gift_2 {
                        height: 27px;
                        width: 24px;

                        & path {
                            fill: var(--white) !important;
                        }
                    }
                }
            }
        }
    }

    :deep(.week-days-element) {
        background: #FFFFFF1A;
        border: 1px solid #FFFFFF1A;

        border-radius: 8px;

        height: 52px;

        flex-grow: 1;

        &>span {
            display: flex;
            flex-direction: column;
            color: var(--white);
            font-size: 14px;
        }
    }

    :deep(.side-panel) {
        z-index: 2000;
        background: #EBEBEB33;
        border: 1px solid #FFFFFF0D;
        border-radius: 12px;

        backdrop-filter: blur(25px);

        & > .side-panel-wrapper {

            & * {
                font-family: 'Overpass';
                color: var(--white);
            }

            & .side-promo .side-promo1 {
                color: var(--grayText);
            }

            & .side-image {
                
            }
        }

    }
}


.loader {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 100px 0;
}
</style>