<template>
  <label
    :for="id"
    class="radio"
  >
    <input
      :id="id"
      type="radio"
      :value="defaultValue"
      :checked="isChecked"
      class="radio__input"
      @change="$emit('update:modelValue', $event.target.value)"
    >
    <span
      class="radio__box"
    />
    <span class="radio__text">
      <slot />
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  modelValue: {
    type: undefined,
    default: null,
  },
  value: {
    type: undefined,
    default: null,
  },
  defaultValue: {
    type: String,
    default: '',
  },
})

const isChecked = computed(() => {
  return (props.modelValue || props.value) === props.defaultValue
})
</script>

<style lang="scss" scoped>
.radio {
  display: flex;
  align-items: center;
  grid-gap: 10px;

  cursor: pointer;

  &__input {
    display: none;

    &:checked + .radio__box {
      border-color: var(--white);

      &:after {
        opacity: 1;
      }
    }
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;

    background: #EBEBEB33;
    
    border: 1px solid #FFFFFF0D;
    border-radius: 50%;

    &:after {
      content: '';

      width: 12px;
      height: 12px;

      background: var(--white);
      border-radius: 50%;

      transition: opacity 0.3s;
      opacity: 0;
    }
  }

  &__text {
    color: var(--white);
    font-weight: 500;
  }
}
</style>
