<template>
    <div class="header" :class="props.extraClass">
        <div class="header__bar">
            <div class="header__bar-buttons" :class="{ 'blur': isScrolled }">
                <div class="header__bar-buttons_block">
                    <UIIcon name="icon-user" class="icon-user"></UIIcon>
                    <UIIcon name="icon-chat"></UIIcon>
                </div>

                <h1 class="header__title">ДАЙ 5</h1>

                <div class="header__bar-buttons_block">
                    <UIIcon name="icon-notification"></UIIcon>
                    <div class="coins">
                        <span> 250 </span>
                        <UIIcon name="icon-coin" class="icon-coin"></UIIcon>
                    </div>
                </div>
            </div>

            <div class="header__bar-address">
                <p>Urban Oasis Grill</p>
                <span class="dot"></span>
                <p>Москва, проспект Победы 35</p>
            </div>
        </div>

        <div class="header__image-box">
            <!-- <img :data-src="mainBg" v-lazy-load alt=""> -->
            <div class="gray-frame" :class="props.extraClass"></div>
        </div>

        <img src="@/assets/images/header-text.png" v-if="props.extraClass === 'index'" class="header__text" alt="">
    </div>
</template>

<script setup>
import mainBg from '@/assets/images/header-banner-bg.png';

const props = defineProps({
    extraClass: {
        type: String,
        default: '',
    }
})

const isScrolled = ref();

const userScroll = () => {
    if (window.scrollY > 50) {
        isScrolled.value = true;
    } else {
        isScrolled.value = false
    }
};

onMounted(() => {
    window.addEventListener("scroll", userScroll);
})
onBeforeMount(() => {
    window.removeEventListener("scroll", userScroll);
})
</script>

<style lang="scss" scoped>
.ui-icon {
    :deep svg path {
        fill: var(--white);
    }

    &.icon-user {
        :deep svg path {
            fill: #CC75C0;
        }
    }

    &.icon-coin {
        margin-top: -2px;
        height: 20px;

        :deep svg path {
            height: 20px;
            fill: #CC75C0;
        }

        :deep svg {
            height: 20px;
            fill: #CC75C0;
        }
    }
}

.header {
    width: 100%;
    color: var(--white);

    &__title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
        font-weight: 600;
    }

    &__bar {

        &-buttons {
            position: fixed;
            left: 20px;
            right: 20px;
            top: 20px;

            background: transparent;


            z-index: 2000;

            display: flex;
            justify-content: space-between;
            align-items: center;

            &.blur {
                padding: 8px 20px;
                margin: -8px -20px;
                backdrop-filter: blur(10px);
            }

            &_block {
                display: flex;
                gap: 15px;

                &>.coins {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2px;

                    background: #FFFFFF4D;

                    border: 1px solid #FFFFFF4D;

                    height: 24px;

                    padding: 8px 5px;

                    border-radius: 8px;

                    &>span {
                        font-family: 'Overpass';
                        padding-top: 3px;
                        font-size: 11px;
                    }
                }
            }
        }

        &-address {
            display: flex;
            justify-content: center;
            align-items: center;

            position: absolute;

            top: 50px;
            left: 0;
            right: 0;

            z-index: 100;


            margin-top: 10px;

            font-family: 'Overpass';

            gap: 10px;

            font-size: 14px;

            &>.dot {
                height: 4px;
                width: 4px;
                background: var(--white);

                transform: rotate(45deg);
                border-radius: 10%;

                margin-bottom: 3px;
            }

        }
    }

    &__image-box {
        background: url('@/assets/images/header-banner-bg.png');
        background-size: cover;
        background-position: center center;
        background-attachment: fixed;

        min-height: 100vh;
        width: 100vw;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 8;


        &>.gray-frame {
            position: fixed;
            top: 0;
            left: 0;

            width: 100%;
            min-height: 100vh;

            background: #00000066;

            z-index: 10;
            backdrop-filter: blur(20px);

            &.index {
                backdrop-filter: none;
            }
        }
    }

    &__text {
        position: absolute;
        top: 40%;
        left: 55%;

        z-index: 11;

        transform: translate(-50%, -50%);
    }
}
</style>