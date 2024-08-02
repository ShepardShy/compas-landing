<template>
	<AppSection class="base section_without-background">
		<AppH2> Собираем штрафы по базам </AppH2>
		<div class="base__list">
			<div
				class="base__item base-item"
				v-for="item in fines"
			>
				<figure class="ibg base-item__image">
					<img
						:src="item.link"
						:alt="item.title"
					/>
				</figure>
				<div class="base-item__info">
					<div class="base-item__title">
						{{ item.title }}
					</div>
					<div class="base-item__desc">
						{{ item.desc }}
					</div>
				</div>
			</div>
		</div>
	</AppSection>
</template>

<script setup>
	import "./Base.scss";

	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";

	import gibdd from "/main/base/gibdd.svg";
	import parking from "/main/base/moscow-parking.svg";
	import mugand from "/main/base/mugand.svg";
	import madi from "/main/base/madi.svg";
	import fspp from "/main/base/fspp.svg";

	let fines = [
		{
			id: 0,
			title: "ГИБДД",
			desc: "Поиск штрафов по базе ГИБДД",
			link: gibdd,
		},
		{
			id: 1,
			title: "Московский паркинг",
			desc: "Поиск штрафов по базе Московского паркинга",
			link: parking,
		},
		{
			id: 4,
			title: "ФССП",
			desc: "Поиск штрафов по базе Федеральная служба судебных приставов",
			link: fspp,
		},

		{
			id: 3,
			title: "МАДИ",
			desc: "Поиск штрафов по базе МАДИ",
			link: madi,
		},

		{
			id: 3,
			title: "МУГАДН",
			desc: "Поиск штрафов по базе Госавтодорнадзор",
			link: mugand,
		},
	];
</script>
