<template>
	<div class="payment">
		<img
			class="payment__img"
			src="/pages/payment/success.png"
			alt="success"
		/>
		<div class="payment__text">Ваш платеж в обработке</div>
		<NuxtLink
			to="/"
			class="payment__link"
		>
			Главная страница
		</NuxtLink>
	</div>
</template>

<script setup></script>

<style lang="scss">
	@import url(./Payment.scss);
</style>
