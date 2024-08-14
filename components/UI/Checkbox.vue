<template>
  <label
    class="checkbox"
    :class="{'isAlignStart': props.isAlignStart}"
  >
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="isChecked"
      @change="handleChange"
    >

    <span class="checkbox__box" />

    <p>
      <slot />
    </p>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  value: {
    type: [String, Number],
    required: true,
  },
  isAlignStart: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  return props.modelValue && props.modelValue.includes(props.value)
})

const handleChange = () => {
  const newValue = [...props.modelValue]
  if (isChecked.value) {
    const index = newValue.indexOf(props.value)
    newValue.splice(index, 1)
  } else {
    newValue.push(props.value)
  }
  emit('update:modelValue', newValue)
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  grid-gap: 10px;

  &.isAlignStart {
    align-items: start;

    & > p {
      margin-top: -2px;
    }
  }

  font-weight: 400;
  font-size: 12px;

  font-family: 'Overpass';
  
  color: var(--white);

  cursor: pointer;

  &__input {
    display: none;

    &:checked + .checkbox {
      &__box {
        border-color: #FFFFFF4D;
        background: #FFFFFF4D url('@/assets/svg/checked.svg')no-repeat 50%;
      }
    }
  }

  &__box {
    min-width: 24px;
    min-height: 24px;

    border: 2px solid #FFFFFF4D;
    border-radius: 4px;
  }
}
</style>
