<template>
	<div class="articles-slider">
		<AppSlider
			:class="countSlides == 1 ? 'swiper-slider_only' : ''"
			:options="{ VisibleSlides: countSlides, spaceBetween: 20, pagination: { clickable: true, dynamicBullets: true } }"
		>
			<template #slide>
				<template
					:key="id"
					v-for="{ created_at, preview_picture, name, slug, views } in articles"
				>
					<SwiperSlide
						v-if="name"
						:virtual-index="id"
					>
						{{ id }}
						<ArticleItem
							:id="slug.value ? slug.value : slug"
							:image="preview_picture?.[0]?.file"
							:title="name"
							:views
							:date="created_at"
						/>
					</SwiperSlide>
				</template>
			</template>
		</AppSlider>
	</div>
</template>

<script setup>
	import "./ArticlesSlider.scss";

	import { SwiperSlide } from "swiper/vue";
	import AppSlider from "@/components/AppSlider/Slider.vue";
	import ArticleItem from "@/components/Templates/Common/ArticleItem/ArticleItem.vue";
	import { useArticlesStore } from "~/stores/articlesStore";
	import { storeToRefs } from "pinia";

	const articlesStore = useArticlesStore();
	const { categories, currentTitle, articlesList } = storeToRefs(articlesStore);

	const route = useRoute();

	const articles = ref(articlesList.value.filter((i) => i.slug != route.params.id));

	let countSlides = ref(3);

	onMounted(async () => {
		articlesList.value.length == 0 ? await articlesStore.loadArticles() : 0;
		window.addEventListener("resize", checkingWindowWidth);
		checkingWindowWidth();
	});

	const checkingWindowWidth = () => {
		if (window.innerWidth >= 1240) {
			countSlides.value = 4;
		} else if (window.innerWidth <= 1240 && window.innerWidth >= 950) {
			countSlides.value = 3;
		} else if (window.innerWidth <= 950 && window.innerWidth >= 500) {
			countSlides.value = 2;
		} else {
			countSlides.value = 1;
		}
	};
</script>
