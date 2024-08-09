<template>
    <div class="about">
        <NuxtLink class="about__link" v-for="(item, index) in about" :key="index" :to="item.link">
            {{ item.name }}
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
const commonStore = useCommonStore();

const about = ref([])

const menu = computed(() => commonStore.menu?.user_cab);

console.log(menu.value);

if (menu.value) {
    menu.value.forEach((item: object, i: number) => {
        let link: string = '/information';

        let url = new URL(item.url);
        link += url.pathname

        console.log(link);
        about.value?.push({
            link: link, name: item.title
        })
    });
}

console.log(about.value);

// const about = ref([]);
// const Menu = computed(() => commonStore.menu)
// //TODO move to store
// if(Menu.value?.footer) {
//   Menu.value?.footer.forEach((item, i) => {
//     let link = '/information';
//     if(item.type_label == 'Страница')
//       link+='/page'
//     else
//     if(item.type_label == 'Запись')
//       link+='/post'
//     else
//       link+='/page';

//     let url = new URL(item.url);
//     link+= url.pathname

//     about.value.push({
//       link: link, name: item.title
//     })
//   })
// }
</script>

<style lang="scss" scoped>
.about {
    margin-top: 16px;

    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-family: 'Overpass';

    &__link {
        color: var(--blue);
    }
}
</style>