<template>
	<AppSection class="section_without-background section_gray programm-full">
		<AppH2 class="programm-full__title">
			{{ props.title }}
		</AppH2>
		<div class="programm-full__desc">
			{{ props.desc }}
		</div>
		<div class="programm-full__advantages-wrapper">
			<div class="programm-full__left">
				<div class="programm-full__advantages">
					<Advantage
						:text
						:background
						v-for="{ text, background } in advantages"
					/>
				</div>
				<NuxtLink
					class="programm-full__link"
					to="/auth/registration"
				>
					<AppButton class="button_blue"> Попробуйте бесплатно </AppButton>
				</NuxtLink>
			</div>

			<figure class="ibg programm-full__image">
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

<style>
	@import url(./Programm.scss);
</style>
