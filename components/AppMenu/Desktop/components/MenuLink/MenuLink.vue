<template>
	<NuxtLink
		v-if="props.item.childs?.length <= 0"
		v-bind="$attrs"
	>
		<slot />
	</NuxtLink>

	<AppTabs
		v-else
		:tabs="[props.item]"
		:isShowActions="false"
		:isShowBlueArrow="true"
		@callAction="tab => changeTab(tab)"
	/>
</template>

<script setup>
	let activeTab = ref({
		type: null,
		tab: "mkad",
	});
	provide("activeTab", activeTab);

	// Cмена вкладки
	const changeTab = async tab => {
		activeTab.value.tab = tab.value;
		await navigateTo(tab.value);
	};

	const props = defineProps({
		children: {
			default: [],
			type: Array,
			required: false,
		},
		item: {
			default: {},
			type: Object,
			required: true,
		},
	});
</script>

<style lang="scss">
	@import url(./MenuLink.scss);
</style>
