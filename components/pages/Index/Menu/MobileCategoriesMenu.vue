<template>
  <div class="mobile-menu">
    <div class="mobile-menu__backscroll">
      <UIIcon name="arrow" />
    </div>
    <div class="mobile-menu__wrap">
      <ul class="mobile-menu__list">
        <li v-for="(item, i) in menu" :key="'item-link-' + i">
          <NuxtLink :to="`/categories/${item.id}`">{{ item.name }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  menu: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.divide {
  height: 20px;
  border-right: 2px solid rgb(150, 150, 150);
  border-radius: 100px;
}

.mobile-menu {
  @include flex-start;
  height: 48px;
  background-color: #fff;
  gap: 16px;
  max-width: 100%;
  overflow-x: auto;
  // overflow-y: hidden;
}

.mobile-menu__list {
  @include flex-start;
  gap: 7px;
  li {
    a {
      background-color: var(--grayBg2);
      @include flex-center;
      padding: 12px 15px;
      font-weight: 500;
      border-radius: 14px;
      white-space: nowrap;
      border: 2px solid var(--grayBg2);
      &.router-link-active {
        border-color: var(--orange);
      }
    }
  }
}

.mobile-menu__backscroll {
  background-color: var(--grayBg2);
  height: 100%;
  width: 48px;
  min-width: 48px;
  @include flex-center;
  border-radius: 14px;
  span {
    transform: rotate(180deg);
  }
}
.router-link-exact-active {
}
// .router-link-active {
//   border-color: var(--orange);
// }
</style>
