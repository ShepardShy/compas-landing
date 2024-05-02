<template>
	<div class="section__title-wrapper">
		<h3 class="section__title">{{ props.title }}</h3>
		<slot></slot>
	</div>
</template>

<script setup>
    import './Header.scss';

	const props = defineProps({
	    title: {
			default: 'Undefined',
	        type: String
	    }
	})

</script>
