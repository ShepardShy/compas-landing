<template>
	<aside class="menu menu_mobile">
		<IconGamburger
			class="menu__gamburger"
			@click="() => callAction({ action: 'showMenu', value: true })"
		/>

		<div
			class="menu__content"
			v-show="settingsMenu.isShow"
		>
			<AppH2
				class="menu__nav-back"
				@click="
					() => {
						callAction({ action: 'navigateMenu', value: settingsMenu.activeTab == null ? false : settingsMenu.parentTab ? settingsMenu.parentTab : null });
						settingsMenu.parentTab = null;
					}
				"
			>
				<IconArrow />
				{{ settingsMenu.activeTab == null ? "Меню" : settingsMenu.activeTab.title }}
			</AppH2>
			<nav
				class="menu__list"
				v-if="settingsMenu.activeTab == null"
			>
				<NuxtLink
					@click.prevent="clickLink(item)"
					class="menu__item"
					:class="$route.fullPath === item.tab ? 'menu__item_active' : ''"
					v-for="item in menu"
					:key="item.id"
					v-show="item.enabled"
				>
					{{ item.title }}
					<IconArrow v-if="item?.childs?.length > 0" />
				</NuxtLink>
			</nav>
			<nav
				class="menu__list"
				v-if="settingsMenu?.activeTab?.childs?.length > 0"
			>
				<NuxtLink
					@click.prevent="clickChildLink(child)"
					:to="child.alias"
					class="menu__item"
					:class="$route.fullPath === child.alias ? 'menu__item_active' : ''"
					v-for="child in settingsMenu.activeTab.childs"
					:key="child.tab"
					v-show="child.enabled"
				>
					{{ child.title }}
					<IconArrow v-if="child?.childs?.length > 0" />
				</NuxtLink>
			</nav>
			<!-- <nav
				class="menu__list"
				v-else-if="settingsMenu.activeTab?.tab == 'user'"
			>
				<NuxtLink
					to="/profile"
					class="menu__item"
					@click="() => callAction({ action: 'showMenu', value: false })"
				>
					Настройки
				</NuxtLink>
				<button
					class="menu__item menu__button"
					@click="logOut"
				>
					Выйти
				</button>
			</nav> -->
		</div>
	</aside>
</template>

<script setup>
	import "./Mobile.scss";

	import IconArrow from "@/components/AppIcons/Arrow/Arrow.vue";
	import IconGamburger from "@/components/AppIcons/Gamburger/Gamburger.vue";

	import AppH2 from "@/components/AppHeaders/H2/H2.vue";

	let settingsMenu = ref({
		isShow: false,
		activeTab: null,
		parentTab: null,
	});

	provide("settingsMenu", settingsMenu);

	const menu = inject("menu");

	// Клик по ссылке
	const clickLink = async item => {
		if (item?.childs?.length <= 0) {
			navigateTo(item.tab);
			callAction({ action: "showMenu", value: false });
		} else {
			callAction({ action: "navigateMenu", value: item });
		}
	};

	// Клик по ссылке с другими ссылками
	const clickChildLink = async child => {
		if (!child?.childs || child?.childs?.length <= 0) {
			navigateTo(child.alias);
			callAction({ action: "showMenu", value: false });
		} else {
			callAction({ action: "navigateMenu", parent: child, value: child });
		}
	};

	// Вызов действий
	const callAction = data => {
		// Показ/скрытие меню
		const showMenu = state => {
			if (!state) {
				settingsMenu.value.activeTab = null;
			}
			settingsMenu.value.isShow = state;

			if (state) {
				document.body.classList.add("body_uncscroll");
			} else {
				document.body.classList.remove("body_uncscroll");
			}
		};

		// Навигация по меню
		const navigateMenu = (value, parent) => {
			if (parent) {
				settingsMenu.value.parentTab = settingsMenu.value.activeTab;
			}
			if (value == false) {
				showMenu(false);
			} else {
				settingsMenu.value.activeTab = value;
			}
		};

		switch (data.action) {
			// Показ/скрытие меню
			case "showMenu":
				showMenu(data.value);
				break;

			// Навигация по меню
			case "navigateMenu":
				navigateMenu(data.value, data.parent);
				break;
			default:
				break;
		}
	};
</script>
