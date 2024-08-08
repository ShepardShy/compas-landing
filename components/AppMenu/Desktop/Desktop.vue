<template>
	<header
		class="menu menu_desktop"
		ref="menuRef"
	>
		<div class="container">
			<div
				v-if="!route.fullPath.includes('/auth')"
				class="menu__links"
			>
				<MobileMenu />
				<NuxtLink
					:to="menu.length > 0 ? menu[0].tab : '/'"
					class="menu__logo"
				>
					<IconLogo />
				</NuxtLink>

				<div class="menu__content menu__list_desktop">
					<nav class="menu__list menu__list_desktop">
						<MenuLink
							v-show="!item.is_hidden"
							v-for="item in menu"
							class="menu__item"
							:class="{ menu__item_children: item.childs.length > 0 }"
							:to="item.tab"
							:key="item.id"
							:item="item"
							>{{ item.title }}</MenuLink
						>
					</nav>
				</div>
			</div>

			<div
				v-if="!route.fullPath.includes('/auth')"
				class="menu__actions"
			>
				<a
					href="tel:74951184422"
					class="menu__link"
				>
					+7 495 118-44-22
				</a>
				<div class="menu__buttons">
					<NuxtLink
						class="button-text"
						to="/auth/entry"
					>
						Вход
					</NuxtLink>
					<NuxtLink
						class="menu__registration"
						to="/auth/registration"
					>
						<AppButton class="button_blue"> Регистрация </AppButton>
					</NuxtLink>
				</div>
			</div>

			<NuxtLink
				v-else
				:to="menu.length > 0 ? menu[0].tab : '/'"
				class="menu__logo menu__logo_centered"
			>
				<IconLogo />
			</NuxtLink>
		</div>
	</header>
</template>

<script setup>
	import IconLogo from "@/components/AppIcons/Logo/Logo.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import MenuLink from "./components/MenuLink/MenuLink.vue";
	import MobileMenu from "../Mobile/Mobile.vue";

	const route = useRoute();

	const menuRef = ref(null);

	const menu = inject("menu");

	const emit = defineEmits(["callAction"]);
</script>

<style>
	@import "./Desktop.scss";
</style>
