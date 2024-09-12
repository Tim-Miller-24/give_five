<template>
  <div
    :class="['modal-supplements-item', { 'active' : !!isSelected }, {'switchType': switcherView}]"
    @click="!switcherView ? click() : () => {}"
  >
    <template v-if="switcherView">
      <div class="switchType__item">
        <p class="switchType__title">
          {{ item.name }}
        </p>

        <div class="switchType__add-block">
          <UISwitcher @clicked="click" />
    
          <span class="switchType__price"> + {{ item.price.toLocaleString() }} ₽</span>
        </div>
  
      </div>
    </template>

    <template v-else>
      <span
        v-if="!!isSelected"
        class="modal-supplements-item__check"
      >
        <UIIcon name="check" />
      </span>
      <div class="modal-supplements-item__image">
        <img :src="item.images[0]" alt="">
      </div>
      <p class="modal-supplements-item__title">
        {{ item.name }}
      </p>
  
      <div
        v-if="quantity === 'multiple' && !!isSelected"
        class="modal-supplements-item__counter"
      >
        <button
          @click.prevent.stop="decrement()"
        >
          <UIIcon name="minus" />
        </button>
        {{ isSelected?.count || 0 }}
        <button
          :disabled="remains === 0 || isSelected?.count >= max"
          @click.prevent.stop="increment()"
        >
          <UIIcon name="plus" />
        </button>
      </div>
      <div
        v-else
        class="modal-supplements-item__counter"
      >
        <UIIcon name="plus" />
        {{ item.price.toLocaleString() }} ₽
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },

  supplement: {
    type: Array,
    default: () => ([]),
  },

  quantity: {
    type: String,
    default: '',
  },

  max: {
    type: Number,
    default: 0,
  },

  min: {
    type: Number,
    default: 0,
  },

  remains: {
    type: Number,
    default: null,
  },

  switcherView: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['select', 'increment', 'decrement'])

const isSelected = computed(() => {
  return props.supplement.find(item => item.id === props.item.id)
})

// Methods
const click = () => {
  // if (props.remains === 0 && !isSelected.value) {
  //   return false
  // }

  emits('select', props.item)
}

const decrement = () => {
  emits('decrement', props.item.id)
}

const increment = () => {
  if (props.remains === 0 || isSelected.value?.count >= props.max) {
    return false
  }

  emits('increment', props.item.id)
}
</script>

<style lang="scss" scoped>
.modal-supplements-item {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 6px 9px;

  border-radius: 20px;
  outline: 1px solid var(--grayBg);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

  cursor: pointer;

  &.active {
    outline-width: 2px;
    outline-color: #F2A32C;
  }

  input {
    display: none;
  }

  &__check {
    position: absolute;
    top: 6px;
    right: 7px;

    ::v-deep(.ui-icon) svg {
      width: 24px;
      height: 24px;

      path {
        fill: #F2A32C;
      }
    }
  }

  &__image {
    width: 72px;
    height: 72px;

    margin-bottom: 4px;

    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    width: 100%;

    @include text_mini;
    text-align: center;

    margin-bottom: 8px;
  }

  &__counter {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-gap: 10px;

    width: 100%;
    height: 32px;

    margin: auto 0 0 0;

    @include text_normal;
    font-weight: 500;

    background: var(--grayBg);
    border-radius: 14px;

    button {
      &:disabled {
        opacity: 0.3;
      }
    }
  }
}

.switchType {
  box-shadow: none;
  border: none;
  outline: none;

  cursor: auto;

  &__item {
    width: 100%;
    display: flex;
    justify-content: space-between;

    gap: 120px;
  }

  &__add-block {
    display: flex;

    gap: 10px;
  }

  &__price {
    font-weight: 600;
  }
}
</style>