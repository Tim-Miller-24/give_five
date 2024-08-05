<template>
  <div
    :class="[
      'bottom-sheet',
      {
        'bottom-sheet--fullscreen' : sheetHeight === 100,
        'bottom-sheet--draggable': isDraggable,
        'bottom-sheet--autoheight' : autoHeight,
      }
    ]"
    :style="autoHeight ? '' : `height: ${sheetHeight}vh`"
  >
    <button
      ref="draggableButton"
      type="button"
      class="bottom-sheet__button"
    >
      <UIIcon name="bottom-sheet" />
    </button>

    <div class="bottom-sheet__content">
      <slot />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  autoHeight: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: Boolean,
    default: false,
  },
  isModalMap: {
    type: Boolean,
    default: false,
  },
  isOrder: {
    type: Boolean,
    default: false,
  },
  isQr: {
    type: Boolean,
    default: false,
  }
})

const START_HEIGHT = props.maxHeight ? 100 : props.isModalMap ? 25 : 15
const START_HEIGHT_WITHOUT_LOCATION = 25


const emits = defineEmits(['closeModal']);

const draggableButton = ref(null)
const dragPosition = ref(null)
const sheetHeight = ref(props.autoHeight ? START_HEIGHT : START_HEIGHT_WITHOUT_LOCATION)
    //const sheetHeight = computed(() => (props.autoHeight ? START_HEIGHT : START_HEIGHT_WITHOUT_LOCATION))
const isFullscreen = ref(false)
const isDraggable = ref(false)

// <!-- Methods -->
const setSheetHeight = (value) => {
  sheetHeight.value = Math.max(0, Math.min(100, value))
}

const touchPosition = (event) => {
  return event.touches ? event.touches[0] : event
}

const onDragStart = (e) => {
  dragPosition.value = touchPosition(e).pageY
  isDraggable.value = true
}

const onDragMove = (e) => {
  if (dragPosition.value === null) {
    return
  }
  const y = touchPosition(e).pageY
  const deltaY = dragPosition.value - y
  const deltaHeight = deltaY / window.innerHeight * 100
  setSheetHeight(sheetHeight.value + deltaHeight)
  dragPosition.value = y
}

const onDragEnd = () => {
  dragPosition.value = null
  isDraggable.value = false

  if (isFullscreen.value && sheetHeight.value < 90) {
    isFullscreen.value = false
    setSheetHeight(START_HEIGHT)
    return
  }

  if (sheetHeight.value > 25) {
    if (props.isModalMap) {
      setSheetHeight(90);
    }
    else {
      setSheetHeight(100)
    }
    isFullscreen.value = true
  } else {
    isFullscreen.value = false
    setSheetHeight(START_HEIGHT)
  }
}

onMounted(() => {
  if (props.isOrder) {
    setSheetHeight(100);
    isFullscreen.value = true;
  }
  if (props.isQr) {
    setSheetHeight(70);
    isFullscreen.value = true;
  }
  draggableButton.value.addEventListener('mousedown', onDragStart)
  draggableButton.value.addEventListener('touchstart', onDragStart)
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('touchmove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchend', onDragEnd)
})

watch(sheetHeight, (newValue) => {
  if (newValue <= 0) {
    emits('closeModal');
  }  
});
</script>

<style lang="scss" scoped>
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: -2px;
  right: -2px;

  display: flex;
  flex-direction: column;

  max-height: calc(100vh - 20px);

  height: 15vh;

  background: #404040;
  border-radius: 40px 40px 0 0;
  box-shadow: 0px -2px 80px 0px rgba(0, 0, 0, 0.20);
  overflow: hidden;
  transition: height 0.3s;

  &--draggable {
    transition: height 0s;
  }

  &--fullscreen {
    height: 100vh;
    height: calc(var(--app-height) - 20px);

    .bottom-sheet {
      &__content {
        overflow-y: auto;
      }
    }
  }

  &--autoheight {
    padding-top: 20px;
    height: auto;

    .bottom-sheet__button {
      display: none;
    }
  }

  &__button {
    flex: 0 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;

    height: 50px;

    margin-left: -20px;

    padding-top: 3px;
    padding-bottom: 20px;    

    :deep(.ui-icon) {
      width: 62px;
    }
    :deep(.ui-icon) svg {
      width: 62px;
    }
    :deep(.ui-icon) svg rect {
      width: 62px;
      fill: #D9D9D9;
    }
  }

  &__content {
    padding: 0 20px 20px 20px;
  }
}
</style>