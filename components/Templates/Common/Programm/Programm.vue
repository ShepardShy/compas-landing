<template>
	<CompositeBlock class="programm">
		<template #content>
			<AppH2 class="programm__title">
				{{ props.title }}
			</AppH2>
			<div class="programm__desc">
				{{ props.desc }}
			</div>
			<NuxtLink to="/auth?tab=registration">
				<AppButton class="button_blue"> Попробовать бесплатно </AppButton>
			</NuxtLink>
		</template>
		<template #image>
			<figure class="ibg programm__image">
				<img
					src="/tariffs/program.webp"
					alt=""
				/>
			</figure>
		</template>
	</CompositeBlock>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import CompositeBlock from "@/components/AppSection/CompositeBlock/CompositeBlock.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";

	const props = defineProps({
		title: {
			default: null,
			type: String,
		},
		desc: {
			default: null,
			type: String,
		},
	});
</script>

<style scoped>
	@import url(./Programm.scss);
</style>
