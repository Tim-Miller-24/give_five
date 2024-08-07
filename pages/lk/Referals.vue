<template>
    <div class="referals">
        <div class="referals__title">
            <NuxtLink to="/lk">
                <UIIcon class="ui-icon" name="arrow-left" />
            </NuxtLink>
            <h3>Реферальная система</h3>
        </div>

        <div class="referals__content">
            <div class="referals__card">
                <div class="referals__card-header">
                    <UIIcon name="referals" />
                    <div>
                        <h4 class="referals__card-title">Пригласи друга!</h4>
                        <h5 class="referals__card-subTitle">Получи 200 руб. за его первый заказ</h5>
                    </div>
                </div>

                <UIButton color="purple" class="referals__card-button" @click="share">
                    <UIIcon name="add" />
                    Пригласить друга
                </UIButton>
            </div>

            <div class="referals__block">
                <CommonNotification v-model:modelValue="notificationVisible" :message="'Промокод успешно скопирован'" />

                <h4 class="referals__block-title">Твой промокод</h4>

                <div class="referals__block-promo">
                    <span class="referals__block-promo_value">promo-tim</span>

                    <span class="referals__block-promo_divider"></span>

                    <span class="referals__block-promo_icon" @click="copyCode('promo-tim')">
                        <UIIcon name="copy" />
                    </span>
                </div>

                <p class="referals__block-desc">Это ваш личный промокод, поделитесь им с друзьями и получите 200 баллов
                    на ваш счет. </p>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

const notificationVisible = ref(false);

const textForShare = ref('тестовый текст для кнопки поделиться')

const share = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Персональный промокод',
        text: textForShare.value.trim(),
      });
      console.log('Поделились успешно');
    } catch (error) {
      console.error('Ошибка при поделении:', error);
    }
  } else {
    console.warn('Web Share API не поддерживается');
  }
};

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
.referals {
    position: relative;

    padding-bottom: 40px;


    &__title {
        display: flex;

        align-items: center;

        position: relative;

        &>h3 {
            font-size: 20px;
            color: var(--white);

            position: absolute;

            text-transform: uppercase;

            text-wrap: nowrap;

            top: 2px;
            left: 50%;

            transform: translateX(-50%);
        }
    }

    &__content {
        margin-top: 16px;
        font-family: 'Overpass';

        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__card {
        background: #EBEBEB33;
        border: 1px solid #FFFFFF0D;

        display: flex;
        flex-direction: column;
        gap: 16px;

        padding: 16px;
        border-radius: 12px;

        &-header {
            display: flex;

            gap: 10px;

            :deep(.ui-icon) {
                border: none;
                background: none;
            }
        }

        &-title {
            font-size: 14px;
            font-weight: 600;
        }

        &-subTitle {
            font-size: 12px;
            font-weight: 400;
            color: var(--grayText);
        }

        &-button {
            margin: auto;
            width: 100%;

            :deep(.ui-icon) {
                border: none;
                background: none;
            }
        }
    }

    &__block {
        position: relative;
        
        background: #EBEBEB33;
        border: 1px solid #FFFFFF0D;

        display: flex;
        flex-direction: column;
        gap: 16px;

        padding: 16px;
        border-radius: 12px;

        &-title {
            font-size: 16px;
            font-weight: 600;
        }

        &-promo {
            background: #ffffff4d;
            border: 1px solid #ffffff4d;
            border-radius: 12px;

            display: grid;
            grid-auto-flow: column;
            grid-template-columns: 1fr auto auto;
            align-items: center;
            grid-gap: 15px;

            padding: 0 15px 0 25px;

            box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.08);

            width: 100%;
            height: 48px;


            &_value {
                flex: 1 1 auto;
                text-align: center;

                font-weight: 400;
            }

            &_divider {
                flex: 0 0 auto;
                width: 2px;
                height: 20px;

                background: rgba(0, 0, 0, 0.3);
            }

            &_icon {
                flex: 0 0 auto;

                :deep(.ui-icon) {
                    background: none;
                    border: none;
                }
            }
        }

        &-desc {
            font-size: 12px;
            font-weight: 400;
        }
    }
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
</style>