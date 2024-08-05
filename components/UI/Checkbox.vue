<template>
  <label
    class="checkbox"
    :class="{'isAlignStart': props.isAlignStart}"
  >
    <input
      type="checkbox"
      class="checkbox__input"
    >

    <span
      class="checkbox__box"
    />

    <p>
      <slot />
    </p>
  </label>
</template>

<script setup>
const props = defineProps({
  isAlignStart: {
    type: Boolean,
    default: false,
  }
})
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

  @include text_normal;
  font-weight: 500;
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
