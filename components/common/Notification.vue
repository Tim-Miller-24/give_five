<template>
    <transition name="fade">
        <div v-if="visible" class="notification">
            <!-- <UIIcon name="copy" /> -->
            {{ message }}
        </div>
    </transition>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: '',
    }
});

const emits = defineEmits(['update:modelValue']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    visible.value = newVal;
    if (newVal) {
        setTimeout(() => {
            visible.value = false;
            emits('update:modelValue', false); 
        }, 2000);
    }
});
</script>

<style scoped lang="scss">
.notification {
    position: fixed;
    z-index: 5000;
    bottom: 20px;
    right: 20px;
    left: 20px;

    // transform: translateX(-50%);

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    grid-gap: 20px;

    background-color: #ffffff4d;
    border: 1px solid #ffffff4d;
    backdrop-filter: blur(12px);
    color: var(--white);

    padding: 10px;
    border-radius: 12px;
    padding: 12px 40px;

    white-space: nowrap;
    // border: 1px solid var(--red);
    box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.2);

    @include mq($bp-small) {
        top: -70px;
        right: 0;
        padding: 25px 40px;
    }

    &:deep span svg path {
        fill: var(--red);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>