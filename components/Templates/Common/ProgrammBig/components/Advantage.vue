<template>
	<div class="programm-full__advantage">
		<div
			class="programm-full__checkmark"
			:style="`background-color:${background ? background : '#0584fe'}`"
		>
			<AppCheckMark class="programm-full__checkmark-image" />
		</div>

		<div class="programm-full__advantage-text">{{ text }}</div>
	</div>
</template>

<script lang="ts" setup>
	import AppCheckMark from "~/components/AppIcons/CheckMark/CheckMark.vue";

	const props = defineProps({
		background: {
			type: String,
			default: "",
		},
		text: {
			type: String,
			required: true,
		},
	});
	const { background, text } = toRefs(props);
</script>

<style></style>
