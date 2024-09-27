<template>
	<AppSection class="pluses-fines section_without-background">
		<AppH2> Плюсы использования сервиса по штрафам «Компас» </AppH2>

		<div class="pluses-fines__list">
			<div
				class="pluses-fines__item"
				v-for="item in pluses"
			>
				{{ item.text }}
			</div>
		</div>

		<div class="pluses__actions">
			<NuxtLink to="/auth/registration">
				<AppButton class="button_blue"> Попробовать бесплатно </AppButton>
			</NuxtLink>
		</div>
	</AppSection>
</template>

<script setup>
	import "./PlusesFines.scss";

	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";

	let pluses = [
		{
			text: "Вся информация хранится в одном месте",
		},
		{
			text: "Удаленный доступ к программе",
		},
		{
			text: "Безопасность и сохранность данных",
		},
		{
			text: "Удобный мобильны интерфейс",
		},
		{
			text: "Различные уровни доступа к программе у каждого сотрудника",
		},
		{
			text: "Полный пакет закрывающих документов для бухгалтерии",
		},
	];
</script>
