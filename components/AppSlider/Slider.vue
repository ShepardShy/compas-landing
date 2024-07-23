<template>
	<Swiper
		class="slider"
		v-bind="$attrs"
		:slides-per-view="props.options.VisibleSlides"
		:space-between="props.options.spaceBetween"
		:modules="[Navigation, Pagination, Virtual]"
		navigation
		:pagination="props.options.pagination"
		virtual
	>
		<slot name="slide"> </slot>
	</Swiper>
</template>

<script setup>
	import "./Slider.scss";

	import "swiper/css";
	import "swiper/css/bundle";
	import { Swiper } from "swiper/vue";
	import { Navigation, Pagination, Virtual } from "swiper";

	const props = defineProps({
		options: {
			default: {
				VisibleSlides: 1,
				spaceBetween: 50,
				pagination: { clickable: true, dynamicBullets: true },
			},
			type: Object,
		},
	});
</script>
