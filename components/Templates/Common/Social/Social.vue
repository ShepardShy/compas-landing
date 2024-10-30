<template>
	<AppSection class="social section_without-background">
		<AppH2> Присоединяйтесь к Compas Pro в соцсетях </AppH2>

		<div class="social__description">Публикуем обучающие материалы Компас Про, анонсы мероприятий, рассказываем об обновлениях платформы Compas</div>

		<div class="social__icons">
			<a
				v-for="icon in icons"
				:href="icon.link"
				target="_blank"
				class="social__icon-link"
			>
				<figure class="ibg social__icon">
					<img
						:src="icon.icon"
						:alt="icon.name"
					/>
				</figure>
			</a>
		</div>
	</AppSection>
</template>

<script setup>
	import "./Social.scss";

	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";

	import telegram from "/social/telegram.svg";
	import vk from "/social/vk.svg";
	import rutube from "/social/rutube.svg";

	let icons = [
		{
			name: "Телеграм",
			link: "https://t.me/compas_pro",
			icon: telegram,
		},
		{
			name: "ВКонтакте",
			link: "https://vk.com/cmps_pr",
			icon: vk,
		},
		{
			name: "Rutube",
			link: "https://rutube.ru/channel/47374099/",
			icon: rutube,
		},
	];
</script>
