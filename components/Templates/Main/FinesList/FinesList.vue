<template>
	<div class="fines-list">
		<AppH1 class="fines-list__title">Быстрая провека штрафов</AppH1>
		<div class="fines-list__info">
			<div class="fines-list__group">
				<p class="fines-list__label">Номер автомобиля *</p>
				<p class="fines-list__text"></p>
			</div>
			<div class="fines-list__group">
				<p class="fines-list__label">Свидетельство о регистрации ТС *</p>
				<p class="fines-list__text"></p>
			</div>
			<div class="fines-list__group">
				<p class="fines-list__label">Создание портала</p>
				<p class="fines-list__text fines-list__text_link">Зарегестрируйте портал для постоянного отслеживания машины</p>
			</div>
			<AppTable />
		</div>
	</div>
</template>

<script setup>
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppTable from "~/components/AppTable/AppTable.vue";
</script>

<style lang="scss" scoped>
	@import url(./FinesList.scss);
</style>
