<template>
	<div class="docs">
		<AppBreadcrambs :breadcrumbs="breadcrumbs" />

		<AppH1> Документы </AppH1>
		<div class="docs__list">
			<NuxtLink
				:to="`/docs/${doc.url}`"
				class="docs__item"
				v-for="doc in docs"
			>
				<div class="docs__title">
					{{ doc.title }}
				</div>
				<div class="docs__desc">
					{{ doc.desc }}
				</div>
				<div class="docs__footer">
					<div class="docs__subtitle">Дата размещения версии</div>
					<div class="docs__date">
						{{ setDate(doc.date) }}
					</div>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
	import "./List.scss";

	import docs from "../docs.json";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppBreadcrambs from "@/components/AppBreadcrambs/Breadcrambs.vue";

	import { useGlobalStore } from "~/stores/globalStore";

	const globalStore = useGlobalStore();
	globalStore.isShowMobileMenu = false;
	onBeforeRouteLeave(() => {
		globalStore.isShowMobileMenu = true;
	});

	const setDate = date => {
		return new Date(date).toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
	};

	let breadcrumbs = ref([
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Документы",
			link: `/docs`,
		},
	]);
</script>
