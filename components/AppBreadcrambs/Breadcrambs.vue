<template>
	<div class="breadcrambs">
		<template v-for="(breadcrumb, idx) in props.breadcrumbs">
			<div
				class="breadcrambs__item"
				v-if="breadcrumb?.title"
				:title="breadcrumb?.title"
			>
				<NuxtLink :to="breadcrumb?.link">
					{{ breadcrumb?.title }}
				</NuxtLink>
			</div>
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
