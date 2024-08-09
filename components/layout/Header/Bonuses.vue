<template>
    <div>
        {{ balance || '' }}
    </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
const config = useRuntimeConfig();

const balance = ref(0)

watch(() => userStore.isAuth, () => {
    if (!userStore.isAuth) {
        balance.value = 0;
    }
    else {
        getBalance();
    }
})

const getBalance = async () => {
    if (userStore.isAuth) {
        const data = await userStore.getBalance(config);
    
        const obj = data?.value || null
    
        if (obj) {
            balance.value = obj.points_balance
        }
    }
}

onMounted(() => {
    getBalance();
})
</script>