<template>
    <div class="header" :class="props.extraClass">
        <div class="header__bar">
            <div class="header__bar-buttons" :class="{ 'blur': isScrolled && !isStoryOpened }">
                <div class="header__bar-buttons_block" :class="{ 'd-none': isStoryOpened }">
                    <UIIcon @click="userStore.isAuth ? navigateTo('/lk') : navigateTo('/login')" name="icon-user"
                        class="icon-user"></UIIcon>
                    <UIIcon name="icon-chat" @click="navigateTo('/chat')"></UIIcon>
                </div>

                <h1 class="header__title" @click="navigateTo('/')" :class="{ 'd-none': isStoryOpened }">ДАЙ 5</h1>

                <div class="header__bar-buttons_block" :class="{ 'd-none': isStoryOpened }">
                    <NuxtLink to="/lk/Notifications">
                        <UIIcon name="icon-notification"></UIIcon>
                    </NuxtLink>

                    <div class="coins" @click="navigateTo('/lk/bonuses')">
                        <span>
                            <LayoutHeaderBonuses />
                        </span>
                        <UIIcon name="icon-coin" class="icon-coin"></UIIcon>
                    </div>
                </div>

                <UIIcon class="ui-icon" v-if="isStoryOpened" @click="closeStory" id="custom-close-story" name="close" />
            </div>

            <div class="header__bar-address" :class="{ 'd-none': isStoryOpened }">
                <p>Urban Oasis Grill</p>
                <span class="dot"></span>
                <p>Москва, проспект Победы 35</p>
            </div>
        </div>

        <div class="header__image-box">
            <img v-if="isImage" :data-src="bgSource" v-lazy-load :loading="'lazy'"
            alt="" :key="'main-bg'">
            <video v-else :data-src="bgSource" v-lazy-load :loading="'lazy'"
            autoplay muted loop playsinline :key="'main-bg-video'"
                ref="videoElement"></video>
            <div class="gray-frame" :class="props.extraClass"></div>
        </div>

        <img :src="bgText" :loading="'lazy'" :key="'bg-text'" v-if="props.extraClass === 'index'" class="header__text"
            alt="">
    </div>
</template>

<script setup lang="ts">
import bgText from '@/assets/images/header-text.png';

const userStore = useUserStore()
const commonStore = useCommonStore();

const route = useRoute();

const isStoryOpened = ref<boolean>(false);
const isScrolled = ref<boolean>(false);

const videoElement = ref<Element | null>();
const mainBlock = ref<Element | null>();

const props = defineProps({
    extraClass: {
        type: String,
        default: '',
    }
})

const bgSource = computed(() => commonStore.allSettings.logo.gr_logo_app.logo_header_desktop);

const isImage = computed(() => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(bgSource.value);
});

watch(() => route.name, () => {
    if (route.name === 'index') {
        videoElement.value.play();
    } else {
        videoElement.value.pause();
    }
})


const userScroll = () => {
    if (window.scrollY > 20) {
        isScrolled.value = true;
    } else {
        isScrolled.value = false
    }
    
    if (route.name !== 'index') return;
    const distanceFromTop = mainBlock.value?.getBoundingClientRect().top;

    if (videoElement.value && distanceFromTop && distanceFromTop < 100) {
        videoElement.value.pause();
    } else if (videoElement.value) {
        videoElement.value.play();
    }
};

onMounted(() => {
    window.addEventListener("scroll", userScroll);

    commonStore.getPickups();
    commonStore.getDelivery();

    nextTick(() => {
        if (videoElement.value && route.name === 'index') {
            videoElement.value.play();
        }

        const observer = new MutationObserver(() => {
            const zuckModal = document.getElementById('zuck-modal-slider-stories');
            if (zuckModal) {
                isStoryOpened.value = true;
            } else {
                isStoryOpened.value = false;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const storyElements = document.querySelectorAll('.story');

        mainBlock.value = document.querySelector('.layout-content');

        if (process.client) {
            for (let elem of storyElements) {
                elem.addEventListener('click', (() => {
                    isStoryOpened.value = true;
                    window?.scrollTo({ top: 0, behavior: 'smooth' })
                }))
            }
        }
    })
})
onBeforeMount(() => {
    window.removeEventListener("scroll", userScroll);
})

const closeStory = () => {
    nextTick(() => {
        const zuckModal = document.getElementById('zuck-modal');
        if (zuckModal) {
            // Вызовите метод закрытия Zuck.js
            isStoryOpened.value = false;
            zuckModal.querySelector('.story-viewer .close').click();
        }
    })
};
</script>

<style lang="scss" scoped>
.d-none {
    display: none !important;
}

#custom-close-story {
    z-index: 6000;
    position: fixed;
    top: 16px;
    right: 16px;
    background: #FFFFFF4D;
    border: 1px solid #FFFFFF4D;
    min-width: 30px;
    min-height: 30px;

    box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.2);

    backdrop-filter: blur(12px);

    :deep svg {
        height: 22px;
        width: 22px;
    }

    border-radius: 50%;
}

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
    max-width: 768px;
    width: 100%;

    margin: auto;
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
            max-width: 768px;
            width: calc(100% - 40px);

            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            top: 20px;

            background: transparent;

            z-index: 2000;

            display: flex;
            justify-content: space-between;
            align-items: center;

            @include mq($bp-small) {
                padding: 0 20px;
            }

            &.blur {
                top: 12px;
                padding: 8px 20px;
                width: 100%;
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

            z-index: 1500;


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
        // background: url('@/assets/images/header-banner-bg.png');

        // background-size: cover;
        // background-position: center center;

        min-height: 100vh;
        width: 100vw;


        position: fixed;
        top: 0;
        left: 0;
        z-index: 8;

        &>img {
            object-fit: cover;
            margin: auto;
            max-width: 768px;
            width: 100%;
            height: 100%;
            min-height: 100vh;
        }

        &>video {
            margin: auto;
            object-fit: cover;
            max-width: 768px;
            width: 100%;
            height: 100%;
            min-height: 100vh;
        }

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

        @include mq($bp-small) {
            left: 50%;
        }

        transform: translate(-50%, -50%);
    }
}
</style>