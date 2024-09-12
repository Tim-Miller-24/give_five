<template>
  <Teleport :to="teleportTo" v-if="teleportTo">
    <ModalsOverlay
      :is-show="isShow"
      @close="emits('close')"
    >
      <div class="modal-supplements">
        <div class="modal-supplements__header">
          <div class="modal-supplements__header-line">
            <p class="modal-supplements__title">
              {{ item.title }}
            </p>
  
            <a
              href="#"
              rel="nofollow"
              class="modal-supplements__close"
              @click.prevent="closeModal()"
            >
              <UIIcon name="close" />
            </a>
          </div>
  
          <p
            v-if="description"
            class="modal-supplements__text"
          >
            {{ description }}
          </p>
        </div>
  
        <div class="modal-supplements__body">
          <ModalsSupplementsProduct
            v-for="(product, i) in products"
            :key="i"
            :item="product"
            :supplement="supplement"
            :quantity="item.quantity"
            :max="+item.quantity_max || 10"
            :min="+item.quantity_min"
            :remains="countRemains"
            @select="selectProduct"
            @increment="increment"
            @decrement="decrement"
          />
        </div>
  
        <div class="modal-supplements__footer">
          <UIButton
            type="submit"
            color="yellow"
            class="modal-supplements__button"
            :disabled="isButtonDisabled"
            @click="submit()"
          >
            Подтвердить
          </UIButton>
        </div>
      </div>
    </ModalsOverlay>
  </Teleport>
</template>

<script setup>
const catalogStore = useCatalogStore()

const teleportTo = ref();

const { uncategorizedProducts } = storeToRefs(catalogStore)

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },

  selected: {
    type: Array,
    default: () => ([]),
  },
})

const emits = defineEmits(['close', 'submit'])

const isShow = ref(true)
const supplement = ref([])

// Computed
const quantityMax = computed(() => {
  return +(props.item?.quantity_max || 0)
})

const quantityMin = computed(() => {
  return +(props.item?.quantity_min || 0)
})

const description = computed(() => {
  let str = 'Добавьте'

  if (quantityMax.value || quantityMin.value) {
    if (quantityMax.value) {
      str += ` не более ${quantityMax.value} шт.`
    }
    if (quantityMax.value && quantityMin.value > 0) {
      str += ` но`
    }
    if (quantityMin.value > 0) {
      str += ` не менее ${quantityMin.value} шт.`
    }

    return str
  }

  return null
})

const products = computed(() => {
  const products = props.item?.products || []

  return products.map(item => {
    return uncategorizedProducts.value.find(ingredient => +ingredient.id === +item)
  }).filter(item => item)
})

// Кол-во выбранных
const countSelected = computed(() => {
  return supplement.value.reduce((acc, item) => {
    acc += item.count

    return acc
  }, 0)
})

// 
const countRemains = computed(() => {
  if (quantityMax.value) {
    return quantityMax.value - countSelected.value
  }

  return null
})

const isButtonDisabled = computed(() => {
  if (quantityMin.value) {
    return countSelected.value < quantityMin.value
  }
  return false
})

// Methods
const closeModal = () => {
  isShow.value = false
}

const submit = () => {
  if (!isButtonDisabled.value) {
    emits('submit', supplement.value)
  }
}

const selectProduct = (obj) => {
  const data = {
    id: +obj.id,
    count: 1,
    price: +obj.price,
    name: obj.name,
    image: obj?.images ? obj?.images[0] : null
  }

  if (props.item.type === 'radio') {
    supplement.value = []

    supplement.value.push(data)
  } else {
    const isset = supplement.value.find((item, i) => {
      if (+item.id === +obj.id) {
        supplement.value.splice(i, 1)
        return true
      }
      return false
    })

    if (!isset) {
      supplement.value.push(data)
    }
  }
}

const increment = (id) => {
  supplement.value.find(item => {
    if (+item.id === +id) {
      item.count++
      return true
    }

    return false
  })
}

const decrement = (id) => {
  supplement.value.find((item, i) => {
    if (+item.id === +id) {
      if (item.count > 1) {
        item.count--
      } else {
        supplement.value.splice(i, 1)
      }
      return true
    }

    return false
  })
}

onMounted(() => {
  supplement.value = props.selected.slice();

  nextTick(() => {
    teleportTo.value = '.modal__box';
  })
})
</script>

<style lang="scss" scoped>
.modal-supplements {
  width: 100vw;
  max-width: 500px;

  display: flex;
  flex-direction: column;
  grid-gap: 50px;

  padding: 30px 40px;

  @include maq($bp-super-small) {
    padding: 20px 20px;
  }

  background: var(--white);
  border-radius: 40px;

  &__close {
    ::v-deep(.ui-icon) svg {
      width: 24px;
      height: 24px;

      path {
        fill: var(--blackText3);
      }
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
  }

  &__header-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    @include h2;
  }

  &__body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px 30px;

    @include maq($bp-super-small) {
      grid-gap: 20px 15px;
    }
  }

  &__footer {

  }

  &__button {
    width: 100%;
    font-weight: 500;
  }
}
</style>