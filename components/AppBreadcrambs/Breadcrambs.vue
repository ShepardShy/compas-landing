<template>
	<div class="breadcrambs">
		<template v-for="breadcrumb in props.breadcrumbs">
			<NuxtLink
				class="breadcrambs__item"
				v-if="breadcrumb?.title"
				:to="breadcrumb?.link"
			>
				{{ breadcrumb?.title }}
			</NuxtLink>
		</template>
	</div>
</template>

<script setup>
	import "./Breadcrambs.scss";

	const props = defineProps({
		breadcrumbs: {
			default: [
				{
					title: "Главная",
					link: "/",
				},
			],
			type: Object,
		},
	});
</script>
