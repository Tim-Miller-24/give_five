<template>
    <div class="data">
        <div class="data__block">
            <div class="data__left">
                <UIIcon name="wifi" />
                <p>Название</p>
            </div>
            <div class="data__right" @click="copyCode(wifiLogin)">
                <p>{{ wifiLogin }}</p>
                <UIIcon name="copy" />
            </div>
        </div>

        <div class="data__block">
            <div class="data__left">
                <UIIcon name="key" />
                <p>Пароль</p>
            </div>
            <div class="data__right" @click="copyCode(wifiPassword)">
                <p>{{ wifiPassword }}</p>
                <UIIcon name="copy" />
            </div>
        </div>

        <CommonNotification v-model:modelValue="notificationVisible" :message="'Скопировано!'" />

        <button class="data__button">Подключить</button>
    </div>
</template>

<script lang="ts" setup>
const commonStore = useCommonStore();

const notificationVisible = ref<boolean>(false);

const wifiLogin = computed(() => commonStore.dai5?.wifi_login || '');

const wifiPassword = computed(() => commonStore.dai5?.wifi_password || '');

const copyCode = async (value: string) => {
  try {
    await copyTextToClipboard(value);

    notificationVisible.value = true;

  } catch (e) {
    console.error(e);
  }
}
</script>

<style lang="scss" scoped>
:deep(.ui-icon) svg path {
    fill: var(--white);
}

.data {
    margin-top: 16px;
    margin-bottom: 16px;

    position: relative;
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    background: #EBEBEB33;

    gap: 8px;

    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    padding: 32px 20px;

    color: var(--white);

    &__block {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    &__left {
        display: flex;
        gap: 16px;

        &>p {
            padding-top: 2px;
            font-weight: 600;
            font-size: 14px;
            font-family: 'Overpass';
        }
    }

    &__right {
        display: flex;
        justify-content: space-between;
        align-items: center;

        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;
        border-radius: 8px;
        padding: 12px;
        width: 50%;

        &>p {
            padding-top: 2px;
            font-weight: 600;
            font-size: 14px;
            font-family: 'Overpass';
        }
    }

    &__button {
        width: 100%;
        background: var(--purple);
        padding: 12px 0;
        border-radius: 8px;
    }
}
</style>