<script setup>
	import { ref } from "vue";

	const picked = ref("One");
</script>

<template>
	<div>Picked: {{ picked }}</div>

	<input
		type="radio"
		id="one"
		value="One"
		@input="console.log(123)"
		v-model="picked"
	/>
	<label for="one">One</label>

	<input
		type="radio"
		id="two"
		value="Two"
		@input="console.log(123)"
		v-model="picked"
	/>
	<label for="two">Two</label>
</template>
