<template>
    <div class="block">
        <div class="block__header">
            <h3 class="block__title">{{ props.item.title }}</h3>

            <p class="block__subTitle">{{ props.item.code }}</p>
        </div>

        <div class="block__buttons">
            <div class="block__button" @click="emits('qrSelected', props.item)">
                <p>QR код</p>

                <UIIcon class="ui-icon" name="scan-barcode" />
            </div>
            <div class="block__button" @click="share">
                <p>Ссылка</p>

                <UIIcon class="ui-icon" name="link" />
            </div>
        </div>
    </div>

</template>

<script setup>
const config = useRuntimeConfig()

const emits = defineEmits(['qrSelected'])

const props = defineProps({
    item: {
        type: Object,
        default: {},
    }
})

const qrImage = computed(() => props.item.qrcode);

const share = async () => {
  if (navigator.share) {
    try {
      // Замена BASE_URL на /api
      const imageRequest = qrImage.value.replace(`${config.public.BASE_URL}`, '/api');
      
      // Использование fetch вместо $fetch
      const response = await fetch(imageRequest);
      
      // Проверка успешности ответа
      if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
      }

      // Преобразование ответа в Blob
      const imageBlob = await response.blob();
      const imageFile = new File([imageBlob], 'qrcode.jpg', { type: imageBlob.type });

      // Отправка изображения через Web Share API
      await navigator.share({
        title: 'Персональный промокод',
        files: [imageFile],
      });

      console.log('Поделились успешно');
    } catch (error) {
      console.error('Ошибка при поделении:', error);
    }
  } else {
    console.warn('Web Share API не поддерживается');
  }
};
</script>

<style lang="scss" scoped>
:deep(.ui-icon) svg path {
    fill: var(--white);
}

.block {
    position: relative;
    display: flex;
    flex-direction: column;

    justify-content: center;

    background: #EBEBEB33;

    gap: 16px;

    border: 1px solid #FFFFFF0D;
    border-radius: 16px;

    padding: 16px;

    color: var(--white);
    font-family: 'Overpass';

    &__title {
        display: flex;
        font-size: 14px;
        font-weight: 600;
    }

    &__subTitle {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        color: var(--grayText);
    }

    &__buttons {
        display: flex;
        gap: 10px;
    }

    &__button {
        display: flex;
        justify-content: space-between;
        align-items: center;

        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;
        border-radius: 8px;
        padding: 9px;
        width: 50%;

        &>p {
            padding-top: 2px;
            font-weight: 600;
            font-size: 14px;
            font-family: 'Overpass';
        }
    }
}
</style>