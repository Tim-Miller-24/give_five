<template>
    <div>
        <div id="stories" class="stories"></div>
    </div>
</template>

<script setup>
const commonStore = useCommonStore();
const catalogStore = useCartStore();

const banners = computed(() => commonStore.slidesGallery);

const isStoryOpen = ref(false);

onMounted(() => {
    nextTick(() => {
        const options = {
            localStorage: false,
        };

        const element = document.querySelector("#stories");
        const stories = new Zuck(element, options);

        // Функция для генерации уникальных id
        function generateUniqueId() {
            return Math.random().toString(36).substr(2, 9); // Генерируем случайную строку
        }

        // Переменная для хранения созданных id
        const createdIds = new Set();

        // Добавляем основные истории
        for (let slide of banners.value) {
            // Проверяем условие перед добавлением
            const storyId = generateUniqueId(); // Генерируем уникальный id для каждой истории

            const story = {
                id: storyId,
                photo: slide.image,
                name: '',
                link: '',
                lastUpdated: '',
                time: 0,
                seen: false,
            };

            stories.add(story);
            createdIds.add(storyId);

            // Добавляем внутренние баннеры, если они есть
            if (slide.inner_banners && slide.inner_banners.length > 0) {
                for (let item of slide.inner_banners.reverse()) {
                    const itemStoryId = generateUniqueId(); // Генерируем уникальный id для каждого элемента

                    const storyItem = {
                        id: itemStoryId,
                        type: item.image ? 'photo' : 'video',
                        // length: 300,
                        length: (+item.screen_time / 1000) || 3,
                        src: item.image ? item.image : item.stories_video.url,
                        preview: item.preview || item.image,
                        // link: checkLink(item), // Добавляем ссылку
                        // linkText: item.text_button || 'Подробнее', // Текст кнопки
                        time: item?.time || 0,
                        seen: false,
                    };

                    stories.addItem(story.id, storyItem); // Добавляем элемент к основной истории
                    createdIds.add(itemStoryId);
                }
            }
        }
    });
});

// const checkLink = (item) => {
//     if (item) {
//         if (item.type === 'product') {
//             // catalogStore.setProduct(item.product);

//             // let temp = catalogStore.getProductById(item.product);

//             // router.push(`${temp.slug}`);
//             return '/?product_id=' + item.product;
//         }

//         if (item.type === 'category') {
//             let temp = catalogStore.categories?.find(cat => +cat.id === +item.category);

//             // router.push(`/menu/${temp.slug}`);
//             return '/' + item.category;
//         }

//         // router.push(`${item.link}`);
//         return item.url;
//     }
// }

</script>

<style lang="scss">

#zuck-modal {
    z-index: 1000;
}

#zuck-modal-content .story-viewer .head .right .time {
    display: none;
}

#zuck-modal-content .story-viewer .slides-pointers {
    position: absolute;
    bottom: 5px !important;
    top: auto;
}

#zuck-modal-content .story-viewer .tip {
    background: var(--yellow) !important;
    padding-top: 10px;
    padding-bottom: 6px;
    color: var(--white);
}

#zuck-modal-content .story-viewer .head .left {
    display: none;
}

@include maq($bp-small-medium) {
    #zuck-modal-content .story-viewer .slides .item>.media {
        position: absolute !important;
        top: 0 !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        object-fit: cover !important;
        width: 100% !important;
        height: 100% !important;
    }
}

#zuck-modal-content .story-viewer .head .right .close {
    display: none !important;
}

#zuck-modal-content .story-viewer.with-back-button .head .left>.back {
    display: none !important;
}

.stories.carousel .story {
    margin: 0 0px;
}
</style>

<style lang="scss" scoped>
:deep(.with-effects) {
    display: flex !important;
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

.stories {
    position: relative;
    z-index: 50 !important;

    // margin-bottom: -20px !important;

    margin-left: -16px;
    margin-right: -16px;

    overflow-y: hidden;

    &:first-child {
        padding-left: 6px;
    }

    :deep(.story) {
        opacity: 1 !important;
        max-height: none !important;
        width: 90px !important;
        height: 100px !important;
        border-radius: 20px !important;

        &>a {
            max-height: none !important;
            width: 90px !important;
            height: 100px !important;
        }
    }

    :deep(.item-preview) {
        max-height: none !important;
        border-radius: 20px !important;
        height: 100px !important;
        width: 90px !important;
        background: none !important;

        &>img {
            border-radius: 0 !important;
            border: none !important;
            border-radius: 20px !important;
            height: 100px !important;
            width: 90px !important;
            object-fit: cover !important;
        }
    }
}
</style>