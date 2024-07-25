<template>
    <div class="banners">
        <Swiper :modules="[Navigation]" :breakpoints="{
                320: { slidesPerView: 'auto', spaceBetween: 5 },
                768: { slidesPerView: 'auto', spaceBetween: 5 },
            }" :navigation="{
                prevEl: `#slider-arrow-sale--prev`,
                nextEl: `#slider-arrow-sale--next`,
            }" class="index-menu__slider index-menu__slider--new">
            <SwiperSlide v-for="item in banners" :key="item.id"
                class="index-menu__slide">
                <img :src="item.src">
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import carousel_0 from '@/assets/images/carousel-0.png';
import carousel_1 from '@/assets/images/carousel-1.png';
import carousel_2 from '@/assets/images/carousel-2.png';
import carousel_3 from '@/assets/images/carousel-3.png';

const banners = reactive([
    {
        id: 0,
        src: carousel_0
    },
    {
        id: 1,
        src: carousel_1
    },
    {
        id: 2,
        src: carousel_2
    },
    {
        id: 3,
        src: carousel_3
    },
    {
        id: 4,
        src: carousel_0
    },
    {
        id: 5,
        src: carousel_1
    },
    {
        id: 6,
        src: carousel_2
    },
    {
        id: 7,
        src: carousel_3
    },
])
</script>

<style lang="scss" scoped>
@import "swiper/css";

.banners {
    margin-left: -20px;
    margin-right: -20px;
}

.index-menu__slider--new {
    z-index: 1000;

    &::v-deep(.swiper-wrapper) {
        display: flex;

        &:first-child {
            padding-left: 10px;
        }
        &:last-child {
            padding-right: 10px;
        }
    }
}

.index-menu__slide {
    width: 90px;
    height: 100px;
    
    & > img {
        border-radius: 16px;
        width: 90px;
        height: 100px;
    }
}

</style>