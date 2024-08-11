<template>
    <div class="image-uploader">
        <div class="uploaded-images">
            <div v-for="(image, index) in images" :key="index" class="image-container">
                <div v-if="image" class="uploaded-image">
                    <img :src="image" alt="Uploaded Image" />
                    <button @click="removeImage(index)">
                        <UIIcon name="close" />
                    </button>
                </div>
                <div v-else class="add-image" @click="triggerFileInput(index)">
                    <UIIcon name="plus" />
                </div>
                <input type="file" accept="image/*" ref="fileInputs" :data-index="index" @change="handleFileUpload"
                    class="hidden" />
            </div>
        </div>

        <!-- Кнопка внизу для добавления фото -->
        <UIButton color="gray2" @click="triggerNextAvailableInput">Добавить фото</UIButton>
    </div>
</template>

<script setup lang="ts">
const commonStore = useCommonStore();

const images = reactive<(string | null)[]>([null]); // Массив изображений

const fileInputs = ref<HTMLInputElement[]>([]); // Ссылки на инпуты файлов

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const index = parseInt(target.dataset.index || '0');
    const file = target.files?.[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            images[index] = e.target?.result as string;
            if (images.length - 1 === index) {
                images.push(null); // Добавляем новый слот для следующей загрузки
            }
        };

        reader.readAsDataURL(file);
        updateStoreState();
    }
};

const removeImage = (index: number) => {
    images.splice(index, 1); // Удаляем изображение
    if (!images.includes(null)) {
        images.push(null); // Добавляем новый слот для следующей загрузки
    }
    
    updateStoreState();
};

const triggerFileInput = (index: number) => {
    fileInputs.value[index].click(); // Имитируем клик на input[type="file"]
};

const triggerNextAvailableInput = () => {
    const nextIndex = images.indexOf(null);
    if (nextIndex !== -1) {
        triggerFileInput(nextIndex); // Имитируем клик на следующий доступный слот
    }
};

const updateStoreState = () => {
    commonStore.uploadedImages = images;
}
</script>

<style scoped lang="scss">
.image-uploader {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.uploaded-images {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 10px;
}

.image-container {
    position: relative;
    width: 64px;
    height: 64px;
    background: #FFFFFF4D;
    border-radius: 8px;
}

.uploaded-image {
    position: relative;
    width: 100%;
    height: 100%;

    border-radius: 8px;
}

.uploaded-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    border-radius: 8px;
}

.uploaded-image button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #0C0F10;
    color: white;
    border: none;
    padding: 3px;
    cursor: pointer;

    border-radius: 0px 6px 0px 6px;


    &:deep(.ui-icon) svg path {
        fill: #787878;
        height: 13px;
        width: 13px;
    }

    &:deep(.ui-icon) svg {
        fill: #787878;
        height: 13px;
        width: 13px;
    }
}

.add-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 2px solid #FFFFFF4D;
    border-radius: 8px;
    cursor: pointer;
}

.add-image span {
    line-height: 1;
    color: #D2D2D2;
}

.hidden {
    display: none;
}
</style>