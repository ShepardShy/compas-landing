<template>
	<AppSection class="section_without-background section_gray programm-full">
		<div class="programm-full__top">
			<AppH2 class="programm-full__title">
				{{ props.title }}
			</AppH2>
			<p class="programm-full__desc">
				{{ props.desc }}
			</p>
		</div>
		<div class="programm-full__left">
			<div class="programm-full__advantages">
				<Advantage
					:text
					:background
					v-for="{ text, background } in advantages"
				/>
			</div>
			<div class="programm-full__link">
				<AppButton
					@click="navigateTo('/auth/registration')"
					class="button_blue"
				>
					Попробуйте бесплатно
				</AppButton>
			</div>
		</div>

		<img
			class="programm-full__image"
			src="/tariffs/program.webp"
			alt=""
		/>
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
