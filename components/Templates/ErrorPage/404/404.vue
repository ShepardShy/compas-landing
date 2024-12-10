<template>
	<figure class="ibg error__img">
		<img
			src="/images/pages/error/404.svg"
			alt="Страница не найдена"
		/>
	</figure>

	<AppH1 class="error__title"> Страница не найдена, ошибка 404 </AppH1>

	<NuxtLink
		to="/"
		class="error__link"
	>
		Главная страница
	</NuxtLink>
</template>

<script setup>
	import "./404.scss";

	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
</script>
