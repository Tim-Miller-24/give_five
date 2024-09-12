<template>
  <div :class="['modal-filters-item', { 'open': isOpen }]">
    <div class="modal-filters-item__header" @click="!props.switcher ? toggleFilter() : ''">
      <p class="modal-filters-item__title">
        {{ title }}
      </p>

      <UISwitcher v-if="props.switcher" />
      <UIIcon v-else name="arrow" class="modal-filters-item__arrow" />
    </div>

    <div v-if="!props.switcher" class="modal-filters-item__block">
      <div class="modal-filters-item__content">
        <slot :isHaveSelectedItem="props.isHaveSelectedItem" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  switcher: {
    type: Boolean,
    default: false,
  },
  isHaveSelectedItem: {
    type: Boolean,
    default: false,
  }
})

const isOpen = ref(false)
const isSelected = computed(() => props.isHaveSelectedItem);

onMounted(() => {
  isOpen.value = isSelected.value;
})

const toggleFilter = () => {
  isOpen.value = !isOpen.value
}
</script>

<style lang="scss" scoped>
.modal-filters-item {
  display: flex;
  flex-direction: column;

  border-bottom: 1px solid var(--grayBg);

  &.open {
    border-bottom: 0;

    .modal-filters-item {
      &__arrow {
        transform: rotate(-90deg);
      }

      &__block {
        max-height: 1000px;
      }
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 15px 0;

    cursor: pointer;
  }

  &__title {
    @include text_large;
    font-weight: 700;
  }

  &__arrow {
    transform: rotate(90deg);
    transition: transform 0.3s;
  }

  &__block {
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.3s;
  }

  &__content {
    display: flex;
    flex-direction: column;
    grid-gap: 16px;

    padding-top: 5px;
  }
}
</style>