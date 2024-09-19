<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<AppH1> Тарифы </AppH1>

	<CommonProgramm
		class="tariffs__programm"
		:title="'Программа удобна, интуитивно понятна и проста'"
		desc="Если у Вас возникнут Вопросы заботливая техподдержка максимально быстро решит их подключившись на прямую на ваш портал."
	/>

	<AppSection class="tarification section_without-background">
		<AppH2> Как происходит тарификация? </AppH2>
		<div class="tarification__desc">
			<!-- <p class="tarification__text">У каждой платной услуги есть своя базовая стоимость.</p> -->
			<p class="tarification__text">Помимо очевидных различий тарифных планов по кол-ву пользователей или объему хранилища есть пожалуй самое важное различие в проценте скидки на комиссию за оплату штрафов. Если у вас много штрафов или большой автопарк рекомендуем перейти на профессиональный тариф и платить комиссию всего 1,8%, если у вас мало штрафов или отслеживаете штрафы по одной машине, рекомендуем остаться на бесплатном тарифе.</p>
		</div>

		<TariffsSlider />
	</AppSection>

	<AppSection class="tariffs-equal section_without-background">
		<AppH2> Сравнение тарифов </AppH2>

		<AppTable
			class="tariffs-equal__table section_without-background"
			:isTrash="false"
			:actionType="'view'"
			:slug="'equal'"
			:isPermanentEdit="false"
			:table="table"
			:activeCategory="null"
			:categories="[]"
			:isCanSort="false"
			:isHaveCategories="false"
			:categoryType="'default'"
		/>
	</AppSection>

	<CommonSocial />
</template>

<script setup>
	import "./Tariffs.scss";

	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppBreadcrambs from "@/components/AppBreadcrambs/Breadcrambs.vue";
	import CommonProgramm from "@/components/Templates/Common/Programm/Programm.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import TariffsSlider from "@/components/Templates/Common/TariffsSlider/TariffsSlider.vue";
	import AppTable from "@/components/AppTable/AppTable.vue";
	import CommonSocial from "@/components/Templates/Common/Social/Social.vue";

	let table = {
		// Таблица
		tableKeys: [
			{
				id: 1,
				title: "",
				key: "module",
				width: "300px",
				enabled: true,
				sort_order: null,
				type: "text",
				is_plural: 0,
				external_link: "",
				is_external_link: 0,
				is_link: 0,
				required: 0,
				fixed: true,
				index: 0,
				fixTarget: "0px",
				read_only: 0,
				unit: null,
				mask: null,
				can_edit: 0,
				color: "",
				is_hidden: 0,
				visible_always: 0,
				options: [],
			},
			{
				id: 2,
				isHTMLTitle: true,
				alternativeTitle: `
                    <div class="table-cell__title">
                        Бесплатный
                    </div> <!--  
                    <div class="table-cell__subtitle">
                        6 инструментов
                    </div>
                    <div class="table-cell__desc">
                        Минимальный набор инструментов для старта сквозной аналитики
                    </div> -->
                `,
				title: "Бесплатный",
				key: "free",
				width: "300px",
				enabled: true,
				sort_order: null,
				type: "text",
				is_plural: 0,
				external_link: "",
				is_external_link: 0,
				is_link: 0,
				required: 0,
				fixed: false,
				index: 0,
				fixTarget: "0px",
				read_only: 0,
				unit: null,
				mask: null,
				can_edit: 0,
				color: "",
				is_hidden: 0,
				visible_always: 0,
				options: [],
			},
			{
				id: 3,
				isHTMLTitle: true,
				alternativeTitle: `
                    <div class="table-cell__title">
                        Базовый тариф
                    </div> <!--
                    <div class="table-cell__subtitle">
                        7 инструментов
                    </div>
                    <div class="table-cell__desc">
                        Оптимальный набор инструментов для сквозной аналитики, роста трафика, заявок и продаж
                    </div> -->
                `,
				title: "Базовый тариф",
				key: "base",
				width: "300px",
				enabled: true,
				sort_order: null,
				type: "text",
				is_plural: 0,
				external_link: "",
				is_external_link: 0,
				is_link: 0,
				required: 0,
				fixed: false,
				index: 0,
				fixTarget: "0px",
				read_only: 0,
				unit: null,
				mask: null,
				can_edit: 0,
				color: "",
				is_hidden: 0,
				visible_always: 0,
				options: [],
			},
			{
				id: 2,
				isHTMLTitle: true,
				alternativeTitle: `
                    <div class="table-cell__title">
                        Бизнес
                    </div> 
                    <!--
                    <div class="table-cell__subtitle">
                        11 инструментов
                    </div>
                    <div class="table-cell__desc">
                        Максимальный набор инструментов для сквозной аналитики, роста трафика, заявок и продаж
                    </div>
                    -->
                `,
				title: "Бизнес",
				key: "business",
				width: "300px",
				enabled: true,
				sort_order: null,
				type: "text",
				is_plural: 0,
				external_link: "",
				is_external_link: 0,
				is_link: 0,
				required: 0,
				fixed: false,
				index: 0,
				fixTarget: "0px",
				read_only: 0,
				unit: null,
				mask: null,
				can_edit: 0,
				color: "",
				is_hidden: 0,
				visible_always: 0,
				options: [],
			},
			{
				id: 2,
				isHTMLTitle: true,
				alternativeTitle: `
                    <div class="table-cell__title">
                        Профессиональный
                    </div> <!--
                    <div class="table-cell__subtitle">
                        14 инструментов
                    </div>
                    <div class="table-cell__desc">
                        Максимальный набор инструментов для сквозной аналитики, роста трафика, заявок и продаж
                    </div> -->
                `,
				title: "Профессиональный",
				key: "prof",
				width: "300px",
				enabled: true,
				sort_order: null,
				type: "text",
				is_plural: 0,
				external_link: "",
				is_external_link: 0,
				is_link: 0,
				required: 0,
				fixed: false,
				index: 0,
				fixTarget: "0px",
				read_only: 0,
				unit: null,
				mask: null,
				can_edit: 0,
				color: "",
				is_hidden: 0,
				visible_always: 0,
				options: [],
			},
		],
		tableData: [
			{
				module: "Кол-во пользователей",
				free: "5",
				base: "10",
				business: "40",
				prof: "100",
			},
			{
				module: "Магазин модулей",
				free: "0%",
				base: "-10%",
				business: "-20%",
				prof: "-40%",
			},
			{
				module: "Обьем хранилища",
				free: "2.5 гб.",
				base: "5 гб.",
				business: "50 гб.",
				prof: "100 гб.",
			},
			{
				module: '<div class="table__cell-group"> Штрафы ГИБДД <span class="table-cell__desc">Комиссия за оплату</span> </div>',
				free: "3%",
				base: "2.7%",
				business: "2.4%",
				prof: "1.8%",
			},
			{
				module: "Автопарк",
				free: true,
				base: true,
				business: true,
				prof: true,
			},
			{
				module: "Сотрудники",
				free: true,
				base: true,
				business: true,
				prof: true,
			},
			{
				module: "Компании",
				free: true,
				base: true,
				business: true,
				prof: true,
			},
			// {
			//     module: 'Мягкое удаление',
			//     free: true,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Товары',
			//     free: true,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Мобильное приложение',
			//     free: true,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Задачи',
			//     free: true,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Маршруты',
			//     free: true,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Пробег',
			//     free: true,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Должностные инструкции',
			//     free: true,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Аналитика',
			//     free: false,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Зарплаты',
			//     free: false,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Аварийный фонд',
			//     free: false,
			//     base: true,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Склады',
			//     free: false,
			//     base: false,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Ремонт и тех. обслуживания',
			//     free: false,
			//     base: false,
			//     business: true,
			//     prof: true
			// },
			// {
			//     module: 'Путевые листы',
			//     free: false,
			//     base: false,
			//     business: true,
			//     prof: true
			// }
		],
		socketRows: {
			header: [],
			body: [],
		},

		// Сортировка по ключу
		sortItem: {
			key: null,
			order: null,
		},

		tableFooter: {
			pages: 1,
			activePage: 1,
			count: 25,
		},

		loaderState: "",
	};

	let breadcrumbs = [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Тарифы",
			link: `/tariffs`,
		},
	];
</script>
