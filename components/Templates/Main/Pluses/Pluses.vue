<template>
	<AppSection class="pluses section_without-background">
		<AppH2> Плюсы использования сервиса «Компас» для поиска штрафов </AppH2>

		<div class="pluses__list">
			<div
				class="pluses__item"
				v-for="item in pluses"
			>
				<figure class="ibg pluses__icon">
					<img
						:src="item.image"
						:alt="item.title"
					/>
				</figure>
				<div class="pluses__title">
					{{ item.title }}
				</div>
				<div class="pluses__desc">
					{{ item.desc }}
				</div>
			</div>
		</div>
	</AppSection>
</template>

<script setup>
	import "./Pluses.scss";

	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";

	let pluses = [
		{
			id: 0,
			title: "Неограниченый автопарк",
			desc: "Можно добавить неограниченное кол-во машин и водителей",
			image: "main/pluses/infinity.svg",
		},
		{
			id: 1,
			title: "Сокращение затрат до 50%",
			desc: "Максимально быстро узнаете о штрафах в автоматическом режиме, тем самым у вас есть время оплатить по скидке",
			image: "main/pluses/reducing-mileage.svg",
		},
		{
			id: 2,
			title: "Безопасность",
			desc: "Данные передаются в зашифрованном виде, они доступны только получателю",
			image: "main/pluses/protection.svg",
		},
		{
			id: 3,
			title: "Уведомление о погашении",
			desc: "Мы оповестим вас о том, что штраф был погашен и соответствующая запись создана в ГИС ГМП",
			image: "main/pluses/notification.svg",
		},
		{
			id: 4,
			title: "Квитанция об оплате",
			desc: "После совершения оплаты банковской картой на Вашу электронную почту придет квитанция об успешной оплате.",
			image: "main/pluses/receipt.svg",
		},
		{
			id: 5,
			title: "Все история сохраняется по каждой машине",
			desc: "Вся история штрафов сохраняется по машине и водителю, позволяет анализировать статистику по штрафам",
			image: "main/pluses/time-reduction.svg",
		},
	];
</script>
