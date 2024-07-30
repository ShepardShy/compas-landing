<template>
	<AppSection class="section_without-background section_gray programm">
		<AppH2 class="programm__title">
			{{ props.title }}
		</AppH2>
		<div class="programm__desc">
			{{ props.desc }}
		</div>
		<div class="programm__advantages-wrapper">
			<div class="programm__left">
				<div class="programm__advantages">
					<Advantage
						:text
						:background
						v-for="{ text, background } in advantages"
					/>
				</div>
				<NuxtLink
					class="programm__link"
					to="/auth?tab=registration"
				>
					<AppButton class="button_blue"> Попробуйте бесплатно </AppButton>
				</NuxtLink>
			</div>

			<figure class="ibg programm__image">
				<img
					src="/tariffs/program.webp"
					alt=""
				/>
			</figure>
		</div>
	</AppSection>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import AppSection from "~/components/AppSection/AppSection.vue";
	import Advantage from "./components/Advantage.vue";

	import advantages from "./advantages.json";

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
