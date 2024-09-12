<template>
    <ModalsOverlay :is-show="isShowFilters" @close="closeModal()">
        <div class="modal-categories">
            <div class="modal-categories__main">
                <div class="modal-categories__header">
                    <p class="modal-categories__title">
                        {{ commonStore.categoriesMenuTitle }}
                    </p>

                    <a href="#" class="modal-categories__close" @click.prevent="closeModal()">
                        <UIIcon name="close" />
                    </a>
                </div>
                <ul class="modal-categories__list">
                    <nav class="categories_menu">
                        <ul>
                            <li v-for="(category, i) in catalogStore.categories" :key="'category-link-parent-' + i"
                                :class="[{ active: isActiveCategory(category) }, 
                                        {'d-none': !isShowCategory(category)}]">
                                <div class="category_link__parent" :class="{ active: isOpen(i) }">
                                    <button @click="click(category, i)">
                                        <p>{{ category.name }}</p>
                                        <UIIcon name="arrow" class="icon" v-if="category.subCategories.length > 0"
                                            :filled="true" />
                                    </button>
                                    <div class="count" v-if="category?.subCategories?.length > 0">
                                        {{ category.subCategories.reduce((sum, subCategory) => {
                                                return sum + subCategory.products.length;
                                            }, 0) 
                                        }}
                                    </div>
                                    <div class="count" v-else>{{ category?.products?.length }}</div>
                                </div>
                                <ul v-show="isOpen(i)">
                                    <li v-for="(subcategory, j) in category.subCategories.filter(cat => cat.products?.length > 0)"
                                        :key="'subcategory-link-' + j">
                                        <div class="category_link__subcategory">
                                            <button @click="click(category, null, subcategory)">
                                                <p>{{ subcategory.name }}</p>
                                            </button>
                                            <div class="count">{{ subcategory.products.length }}</div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </ul>

            </div>
        </div>
    </ModalsOverlay>
</template>

<script setup>
const commonStore = useCommonStore();

const catalogStore = useCatalogStore();

const route = useRoute();
const openSubMenus = ref({});
const isShowFilters = computed(() => commonStore.isShowCategoriesModal);

const click = (category, i, subcategory = null) => {
    if (category.subCategories.length > 0 && i !== null) {
        toggleSubMenu(i);
        return;
    }

    else if (subcategory) {
        if (commonStore.allSettings?.facade?.catalog_front === 'lending') {
            scrollToEl(`sub-${subcategory.id}`, -100);
    
            closeModal();
            return;
        }

        navigateTo('/menu/' + category.slug + '/' + subcategory.slug);

        closeModal();
        return;
    }

    navigateTo(`/menu/${category.slug}`);
    closeModal();
}

const isActiveCategory = (category) => {
    return route.path === `/menu/${category.slug}`;
};

const isShowCategory = (category) => {
    if (category?.products?.length > 0 || category?.subCategories?.length > 0) {
        return true;
    }
    else {
        return false
    }
}

const isOpen = (index) => {
    return !!openSubMenus.value[index];
};

const toggleSubMenu = (index) => {
    openSubMenus.value[index] = !openSubMenus.value[index];
};

const closeModal = () => {
    document.body.classList.remove('overflow-hidden');
    commonStore.toggleShowCategoriesModal(false);
}

console.log(catalogStore.categories);
</script>

<style lang="scss" scoped>
.d-none {
    display: none;
}

.categories_menu {
    &>ul {
        &>li {
            border-bottom: 1px solid rgb(217, 217, 217);
            transition: all 0.3s ease;

            &.active {
                border-bottom: 1px solid var(--orange);
            }
        }
    }
}

.count {
    background-color: var(--grayBg);
    padding: 0 8px;
    border-radius: 16px;
    font-size: 12px;
    color: var(--grayText);
    height: 22px;
    min-width: 27px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.category_link__subcategory {
    position: relative;
    display: flex;
    padding-left: 30px;
    margin-bottom: 20px;
    justify-content: space-between;

    .router-link-active {
        color: var(--orange);

        &:before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            border-bottom: 1px solid var(--orange);
        }
    }
}

.category_link__parent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;

    &.active {
        .ui-icon {
            transform: rotate(-90deg);
        }
    }

    &>button {
        display: inline-flex;
        align-items: center;
        transition: all 0.3s ease;
        width: 100%;

        &:hover {
            color: var(--orange);
        }

        &>p {
            font-size: 20px;
            font-weight: 600;
            padding-right: 18px;
        }

        .ui-icon {
            transform: rotate(90deg);
        }
    }
}

.modal-categories {
    width: 100vw;
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background: var(--white);

    @include mq($bp-small) {
        max-width: 540px;
        min-height: auto;

        border-radius: 40px;
    }

    &__main {
        display: flex;
        flex-direction: column;
        grid-gap: 15px;

        padding: 40px 52px 45px;

        @include mq($bp-small) {
            padding: 50px 60px 65px;
        }
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__title {
        @include h2;
    }

    &__close {
        width: 35px;
        height: 35px;
        background-color: var(--grayBg2);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        ::v-deep(.ui-icon) svg {
            width: 24px;
            height: 24px;

            path {
                fill: var(--blackText);
            }
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        font-size: 16px;
        font-weight: 500;

        &>li {
            border-bottom: 0.5px solid #0000000d;

            &:hover {
                cursor: pointer;
                border-bottom-color: var(--orange);
            }
        }


        grid-gap: 15px;


    }
}
</style>