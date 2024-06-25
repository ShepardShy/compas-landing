<template>
	<figure class="icon__triangle">
		<svg
			:fill="props.fill"
			width="8"
			height="5"
		>
			<polygon
				points="0,0 8,0 4,5"
				:fill="props.fill"
			></polygon>
		</svg>
	</figure>
</template>

<script setup>
	import "./Triangle.scss";

	const props = defineProps({
		fill: {
			type: String,
			default: "#1253a2",
		},
	});
</script>
