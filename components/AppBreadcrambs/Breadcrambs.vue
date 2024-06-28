<template>
	<div class="breadcrambs">
		<NuxtLink
			class="breadcrambs__item"
			v-for="breadcrumb in props.breadcrumbs"
			:to="breadcrumb.link"
		>
			{{ breadcrumb.title }}
		</NuxtLink>
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
