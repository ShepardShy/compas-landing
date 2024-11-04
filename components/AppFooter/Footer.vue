<template>
	<footer class="footer">
		<div class="container">
			<div class="footer__column">
				<NuxtLink
					to="/"
					class="footer__logo"
				>
					<IconLogo />
				</NuxtLink>
				<div class="footer__desc">Компас Про - удобное управление транспортом</div>

				<!-- <div class="footer__link footer-link">
					<a href="tel:74951184422" class="footer-link__href footer-link__href_bold"> +7(495)118-44-22 </a>
				</div> -->
				<div class="footer__link footer-link">
					<a
						href="mailto:info@compas.pro"
						class="footer-link__href footer-link__href_bold"
					>
						info@compas.pro
					</a>
				</div>
				<div class="footer__link footer-link">
					<div class="footer-link__title">Для закрывающих документов</div>
					<a
						href="mailto:info@compas.pro"
						class="footer-link__href footer-link__href_bold"
					>
						buh@compas.pro
					</a>
				</div>
				<div class="footer__icons">
					<NuxtLink
						v-for="icon in icons"
						:to="icon.link"
					>
						<figure class="ibg footer__icon">
							<img
								:src="icon.icon"
								:alt="`${icon.name}. Иконка`"
							/>
						</figure>
					</NuxtLink>
				</div>
				<div
					v-if="route.fullPath.includes('/products/fines')"
					class="footer-link__title"
				>
					Оплата штрафов ГИБДД осуществляется НКО «МОНЕТА.РУ» (ООО). Лицензия ЦБ РФ №3508-К от 2 июля 2012 года.
				</div>
			</div>

			<div class="footer__column footer__column_possibilities">
				<div class="footer__title">Возможности сервиса</div>
				<li class="footer__list">
					<!-- <NuxtLink
						to="/logistics"
						class="footer-link__href"
					>
						Логистика
					</NuxtLink> -->
					<NuxtLink
						to="/products/fines"
						class="footer-link__href"
					>
						Отслеживание штрафов
					</NuxtLink>
					<NuxtLink
						to="/products/distance"
						class="footer-link__href"
					>
						Расчёт расстояния
					</NuxtLink>
				</li>
			</div>

			<div class="footer__column">
				<div class="footer__title">Карта сайта</div>
				<nav class="footer__list">
					<NuxtLink
						to="/"
						class="footer-link__href"
					>
						Главная страница
					</NuxtLink>
					<NuxtLink
						to="/tariffs"
						class="footer-link__href"
					>
						Тарифы
					</NuxtLink>
					<NuxtLink
						to="/contacts"
						class="footer-link__href"
					>
						Контакты
					</NuxtLink>
					<NuxtLink
						to="/auth/entry"
						class="footer-link__href"
					>
						Войти
					</NuxtLink>
					<NuxtLink
						to="/auth/registration"
						class="footer-link__href"
					>
						Регистрация
					</NuxtLink>
					<NuxtLink
						to="/questions"
						class="footer-link__href"
					>
						Вопрос-ответ
					</NuxtLink>
					<NuxtLink
						to="/articles"
						class="footer-link__href"
					>
						Статьи
					</NuxtLink>
					<NuxtLink
						to="/knowledge"
						class="footer-link__href"
					>
						База знаний
					</NuxtLink>
					<!-- <NuxtLink
						to="/guides"
						class="footer-link__href"
					>
						Гайды
					</NuxtLink> -->
					<NuxtLink
						to="/docs"
						class="footer-link__href"
					>
						Документы
					</NuxtLink>
				</nav>
			</div>
		</div>
	</footer>
</template>

<script setup>
	import "./Footer.scss";

	import IconLogo from "@/components/AppIcons/Logo/Logo.vue";

	import telegram from "/footer/telegram.svg";
	import vk from "/footer/vk.svg";
	import rutube from "/footer/rutube.svg";
	import youtube from "/footer/youtube.svg";

	const route = useRoute();

	let icons = [
		{
			name: "Телеграм",
			icon: telegram,
			link: "https://t.me/compas_pro",
		},
		{
			name: "ВКонтакте",
			icon: vk,
			link: "https://vk.com/cmps_pr",
		},
		{
			name: "Rutube",
			icon: rutube,
			link: "https://rutube.ru/channel/47374099/",
		},
		{
			name: "Youtube",
			icon: youtube,
			link: "https://www.youtube.com/@CmpsPr",
		},
	];
</script>
