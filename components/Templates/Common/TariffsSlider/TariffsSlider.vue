<template>
    <div class="tariffs-slider">
        <AppSlider :class="countSlides == 1 ? 'swiper-slider_only': ''" :options="{ VisibleSlides: countSlides, spaceBetween: 0, pagination: {clickable: true, dynamicBullets: true}}">
            <template #slide>
                <SwiperSlide v-for="slide in slides" :key="slide.id" :virtual-index="slide.id">
                    <div class="tariffs-slider__item">
                        <div class="tariffs-slider__title">
                            {{ slide.title }}
                        </div>
                        <div class="tariffs-slider__subtitle">
                            {{ slide.subtitle }}
                        </div>
                        <ul class="tariffs-slider__advantages">
                            <li class="tariffs-slider__advantage" v-for="advantage in slide.advantages">
                                {{ advantage.text }}
                            </li>
                        </ul>
                        <div class="tariffs-slider__price tariffs-slider__price_day">
                            <div class="tariffs-slider__values">
                                <div class="tariffs-slider__value tariffs-slider__value_new" :class="[null, 0].includes(setDayPrice(slide).new) ? 'tariffs-slider__value_free' : ''">
                                    {{ setDayPrice(slide).new }} руб
                                </div>
                                <div class="tariffs-slider__value tariffs-slider__value_old" v-show="setDayPrice(slide).old && setDayPrice(slide).old != 0">
                                    {{ setDayPrice(slide).old }} руб
                                </div>
                            </div>
                        </div>
                        <div class="tariffs-slider__price tariffs-slider__price_month" v-show="slide.isShowMonthPay">
                            <div class="tariffs-slider__values">
                                <div class="tariffs-slider__value tariffs-slider__value_new" :class="[null, 0].includes(setPrice(slide).new) ? 'tariffs-slider__value_free' : ''">
                                    {{ setPrice(slide).new }} руб
                                </div>
                                <div class="tariffs-slider__value tariffs-slider__value_old" v-show="setPrice(slide).old && setPrice(slide).old != 0">
                                    {{ setPrice(slide).old }} руб
                                </div>
                            </div>
                            <div class="tariffs-slider__discount" :class="!slide.discount_text ? 'tariffs-slider__discount_none' : ''">
                                {{ slide.discount_text }}
                            </div>
                        </div>
                        <NuxtLink to="/auth?tab=registration">
                            <AppButton class="button_blue">
                                Попробовать
                            </AppButton>
                        </NuxtLink>
                    </div>
                </SwiperSlide>
            </template>
        </AppSlider>
    </div>
</template>

<script setup>
    import './TariffsSlider.scss';

    import { SwiperSlide } from 'swiper/vue'
    import AppSlider from '@/components/AppSlider/Slider.vue';
    import AppButton from '@/components/AppButton/AppButton.vue';

    import tariffs from './tariffs.json'

    let countSlides = ref(3)
    let slides = ref(tariffs)

    const setPrice = (item) => {
        return item.prices[0].price
    }

    const setDayPrice = (item) => {
        return item.day_prices[0].price
    }

    onMounted(() => {
        slides.value = tariffs
        window.addEventListener('resize', checkingWindowWidth);
        checkingWindowWidth()
    })

    const checkingWindowWidth = () => {
        if (window.innerWidth > 1060) {
            countSlides.value = 3
        } else if (window.innerWidth < 1060 && window.innerWidth > 680) {
            countSlides.value = 2
        } else {
            countSlides.value = 1
        }
    }
</script>
