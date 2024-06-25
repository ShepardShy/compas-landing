<template>
	<NuxtLink
		v-if="props.children?.length <= 0"
		v-bind="$attrs"
	>
		<slot />
	</NuxtLink>
	<AppPopup
		ref="popupRef"
		v-else
	>
		<template #summary>
			<div class="menu__triangle-wrapper">
				<IconTriangle
					class="menu__triangle"
					fill="#fd8301"
				/>
				<span>
					<slot />
				</span>
			</div>
		</template>
		<template #content>
			<PopupOption
				v-if="props.children"
				v-for="child in props.children"
			>
				{{ child.name }}
			</PopupOption>
		</template>
	</AppPopup>
</template>

<script setup>
	import AppPopup from "@/components/AppPopup/Popup.vue";
	import PopupOption from "@/components/AppPopup/PopupOption/PopupOption.vue";
	import IconArrow from "@/components/AppIcons/Arrow/Arrow.vue";
	import IconTriangle from "@/components/AppIcons/Triangle/Triangle.vue";

	const popupRef = ref(null);

	const props = defineProps({
		children: {
			default: [],
			type: Array,
			required: false,
		},
	});
</script>

<style lang="scss">
	@import url(./MenuLink.scss);
</style>
