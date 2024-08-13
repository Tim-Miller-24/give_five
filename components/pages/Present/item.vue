<template>
    <div class="present">
        <!-- <img src="@/assets/images/present.png" alt=""> -->

        <div class="present__content">
            <h3 class="present__title">{{ props.item.title }} <span>Осталось 2</span></h3>

            <p class="present__desc">{{ props.item.code }}</p>

            <div class="present__button" @click="share"><span style="padding-top: 2px;">Отправить другу</span>
                <UIIcon name="share-2" />
            </div>
        </div>

        
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

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
        text: props.item.title,
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
.present {
    margin-top: 16px;
    margin-bottom: 16px;

    position: relative;
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    font-family: 'Overpass';

    &>img {
        width: 100%;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }


    color: var(--white);

    &__content {
        width: 100%;
        background: #EBEBEB33;

        border: 1px solid #FFFFFF0D;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;

        // temp
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;

        padding: 16px;

    }

    &__title {
        font-size: 14px;
        font-weight: 600;

        text-align: left;

        position: relative;

        &>span {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);

            background: var(--purple);

            border-radius: 8px;

            padding: 6px 8px;
        }
    }

    &__desc {
        margin-top: 12px;
        font-weight: 400;
        font-size: 12px;
    }

    &__button {
        background: #FFFFFF4D;
        border: 1px solid #FFFFFF4D;

        padding: 9px;
        border-radius: 8px;

        margin-top: 5px;

        font-size: 14px;

        width: max-content;

        gap: 8px;

        display: flex;

        &:deep(.ui-icon) svg path {
            stroke: var(--white);
        }
    }

}
</style>