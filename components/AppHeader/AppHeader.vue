<template>
	<AppSection
		:class="!props.secondElement ? 'section_without-background' : ''"
		:style="props.secondElement ? 'border-radius: 10px' : ''"
		class="section__header section_padding"
	>
		<AppGamburger
			@click="() => $emit('showMobileMenu', true)"
		/>
		<slot></slot>
	</AppSection>
</template>

<script setup>
    import './AppHeader.scss';
    import AppGamburger from "~/components/AppGamburger/AppGamburger.vue";
    import AppSection from "~/components/AppSection/AppSection.vue";

    const props = defineProps({
	    secondElement: {
		    default: false,
		    type: Boolean
	    }
    })
</script>
