<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<AppH1> Контакты </AppH1>
	<CompositeBlock class="contacts__map contacts-map">
		<template #content>
			<div class="contacts-map__list">
				<div
					class="contacts-map__item"
					v-for="contact in contacts"
				>
					<div class="contacts-map__title">{{ contact.title }}:</div>
					<a
						:href="contact.link"
						class="contacts-map__desc"
					>
						{{ contact.text }}
					</a>
				</div>
			</div>
		</template>
		<template #image>
			<iframe
				src="https://yandex.ru/map-widget/v1/?um=constructor%3A63f826b3597df087fbd0145e275bd766f86465f342822801739c0dd6d19d7bbe&amp;source=constructor"
				width="500"
				height="400"
				frameborder="0"
			></iframe>
		</template>
	</CompositeBlock>

	<AppSection class="section_without-background contacts__requisites contacts-requisites">
		<AppH2>
			Реквизиты компании Compas (Компас)

			<a
				:href="requisitesPdf"
				download
				target="_blank"
				class="contacts-requisites__link"
			>
				<figure class="ibg contacts-requisites__document">
					<img
						src="/icons/document.svg"
						alt="Скачать реквизиты"
					/>
					<figcaption class="contacts-requisites__document-text">Скачать</figcaption>
				</figure>
			</a>
		</AppH2>

		<ul class="contacts-requisites__list">
			<li
				class="contacts-requisites__item"
				v-for="requisite in requisites"
			>
				<div class="contacts-requisites__title">
					{{ requisite.title }}
				</div>
				<div class="contacts-requisites__text">
					{{ requisite.text }}
				</div>
			</li>
		</ul>
	</AppSection>

	<TemplateSocial />
</template>

<script setup>
	import "./Contacts.scss";

	import AppBreadcrambs from "@/components/AppBreadcrambs/Breadcrambs.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import TemplateSocial from "@/components/Templates/Common/Social/Social.vue";
	import CompositeBlock from "@/components/AppSection/CompositeBlock/CompositeBlock.vue";

	import requisitesPdf from "/pages/contacts/requisites.pdf";

	let contacts = [
		{
			title: "Телефон",
			text: "+7 495 118-44-22",
			link: "tel:74951184422",
		},
		{
			title: "Email",
			text: "manager@compas.pro",
			link: "mailto:manager@compas.pro",
		},
		{
			title: "Email бухгалтерии",
			text: "bux@compas.pro",
			link: "mailto:bux@compas.pro",
		},
	];

	let requisites = [
		{
			title: "Наименование",
			text: 'ООО КОМПАС ДАЙНАМИКС"',
		},
		{
			title: "ОГРН",
			text: "1237700477365",
		},
		{
			title: "БИК",
			text: "044525593",
		},
		{
			title: "Расчетный счет",
			text: "40702810502370019813",
		},
		{
			title: "ИНН",
			text: "9723204274",
		},
		{
			title: "БАНК",
			text: 'АО "АЛЬФА-БАНК"',
		},
		{
			title: "Юридический адрес",
			text: "г Москва, ул Чагинская, д 4 стр 13, кв./оф. ПОМЕЩ. 2/4",
		},
		{
			title: "КПП",
			text: "1237700477365",
		},
		{
			title: "К/С",
			text: "30101810200000000593",
		},
	];

	let breadcrumbs = [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Контакты",
			link: `/contacts`,
		},
	];
</script>
