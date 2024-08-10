export default defineNuxtRouteMiddleware((to, from) => {
    const commonStore = useCommonStore();

    if (process.client && to.path === '/' && commonStore.routerHistory?.includes('start')) {
       return navigateTo('/start')
    }

    commonStore.routerHistory = from.path;
    
})
