<template>
	<AppSection class="companies section_without-background">
		<AppH2>
			{{ props.title }}
		</AppH2>

		<div
			class="companies__desc"
			v-if="props.desc"
		>
			{{ props.desc }}
		</div>

		<!-- <div class="companies__list">
            <figure class='ibg companies__item' v-for="item in props.list">
                <img :src='item.link' :alt='item.title'>
            </figure>
        </div> -->
	</AppSection>
</template>

<script setup>
	import "./Companies.scss";

	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";

	const props = defineProps({
		list: {
			default: [],
			type: Array,
		},
		desc: {
			default: null,
			type: String,
		},
		title: {
			default: null,
			type: String,
		},
	});
</script>
