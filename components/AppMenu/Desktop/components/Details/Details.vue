<template>
	<div class="tabs">
		<div class="tabs__list">
				<AppPopup
					ref="popupRef"
					v-for="tab in props.tabs.filter(p => p.enabled)"
					class="popup__tabs"
					:closeByClick="false"
					:isCanSelect="false"
					:class="{ tabs__item_active: tab.childs.find(p => p.alias == activeTab.tab) != undefined, tabs__item_disabled: props.isCanChange == false }"
					@click="!popupRef[0].popupRef.hasAttribute('open') ? callAction({ action: 'closeAllChild' }) : ''"
					@clickOutside="callAction({ action: 'closeAllChild' })"
				>
					<template #summary>
						<div
							:class="{ tabs__item_active: $route.fullPath.includes(tab.tab), tabs__item_disabled: !props.isCanChange }"
							class="tabs__item"
						>
							<IconTriangle />
							<p class="tabs__item-text">
								{{ tab.title }}
							</p>
						</div>
					</template>
					<template #content>
						<template v-for="child in tab.childs">
							<PopupOption
								v-if="!tab.childs.find(p => p?.open) || child?.open"
								:class="{ popup__option_active: child.alias == activeTab.tab, popup__option_open: child?.open }"
								@click="() => (child.childs?.length > 0 ? callAction({ action: 'toggleOpenChild', value: child }) : callAction({ action: 'changeTab', value: child.alias, type: 'module' }))"
							>
								<span>
									{{ child.title }}
								</span>
								<IconArrow
									v-if="child.childs?.length > 0"
									class="popup__arrow"
								/>
							</PopupOption>
							<PopupOption
								v-for="kid in child?.childs"
								v-if="child?.open"
								:class="kid.alias == activeTab.tab ? 'popup__option_active' : ''"
								@click="() => callAction({ action: 'changeTab', value: kid.alias, type: 'module' })"
							>
								{{ kid.title }}
							</PopupOption>
						</template>
					</template>
				</AppPopup>
		</div>
	</div>
</template>

<script setup>
	import "./Details.scss";
	import draggable from "vuedraggable";

	import IconArrow from "@/components/AppIcons/Arrow/Arrow.vue";
	import IconTriangle from "@/components/AppIcons/Triangle/Triangle.vue";

	import AppPopup from "@/components/AppPopup/Popup.vue";
	import PopupOption from "@/components/AppPopup/PopupOption/PopupOption.vue";

	const popupRef = ref(null);

	const props = defineProps({
		tabs: {
			default: [],
			type: Object,
		},
		is_admin: {
			default: false,
			type: Boolean,
		},
		haveSettings: {
			default: true,
			type: Boolean,
		},
		userRole: {
			default: null,
			type: Number,
		},
		isCanChange: {
			default: true,
			type: Boolean,
		},
		isShowActions: {
			default: true,
			type: Boolean,
		},
		isShowBlueArrow: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["callAction"]);

	let activeTab = ref(inject("activeTab"));
	let settingsTab = ref(null);
	let isShow = ref({
		state: false,
		type: null,
	});

	let tabs = ref([]);

	provide("isShow", isShow);
	provide("settingsTab", settingsTab);

	let settingsTabs = ref({
		tabs: [
			{
				tab: "enabled",
				title: "Отображение",
			},
			{
				tab: "order",
				title: "Порядок",
			},
		],
		saves: {
			isShow: false,
		},
		activeTab: null,
	});

	// Копирование секции
	const copyField = event => {
		let parentElem = document.createElement("div");
		let elem = event.target.cloneNode(true);
		parentElem.appendChild(elem);
		parentElem.id = "clone-elem";
		parentElem.classList.add("clone-elem");
		parentElem.classList.add("popup-option__draggable");
		elem.style.width = `${event.target.offsetWidth}px`;
		document.body.appendChild(parentElem);
		event.dataTransfer.setDragImage(parentElem, 5, 8);
	};

	// Вызов действий
	const callAction = data => {
		// Изменение меню в настройках
		const changeSettingsTab = data => {
			setTimeout(() => {
				settingsTabs.value.activeTab = data;
			}, 10);
		};

		// Отрытие child у child
		const toggleOpenChild = data => {
			popupRef.value?.[0]?.popupRef?.setAttribute("open", "");
			data.open = !data?.open;
		};

		// Закрытие всех child
		const closeAllChild = () => {
			for (let tab of tabs.value) {
				if (tab.childs?.length > 0) {
					for (let child of tab.childs) {
						child.open = false;
					}
				}
			}
		};

		// Сохранение настроек
		const saveSettings = data => {
			const transformTabs = () => {
				let request = JSON.parse(JSON.stringify(tabs.value));
				for (let tab of request) {
					if (!tab.has_roles_read) {
						tab.roles_read = [];
					}
				}
				return request;
			};

			emit("callAction", {
				action: "saveSettings",
				value: {
					fields: transformTabs(),
					role: data,
				},
			});
			isShow.value.state = false;
			settingsTabs.value.saves.isShow = false;
		};

		// Изменение значений опций
		const changeValue = data => {
			tabs.value.find(option => option.tab == data.key).enabled = data.value;
			settingsTabs.value.saves.isShow = true;
		};

		// Скрытие вкладки
		const hideTab = tab => {
			tabs.value.find(p => p.id == tab.id).enabled = false;
			settingsTabs.value.saves.isShow = true;
		};

		// Смена вкладки
		const changeTab = (data, type = null) => {
			activeTab.value.tab = data;
			activeTab.value.type = type;
			callAction({ action: "closeAllChild" });
			popupRef.value?.[0]?.popupRef?.removeAttribute("open");
			emit("callAction", {
				action: "changeTab",
				value: activeTab.value.tab,
				type: type,
			});
		};

		// Конец перетаскивания плашки
		const settingsDragEnd = () => {
			settingsTabs.value.saves.isShow = true;

			document.querySelectorAll("#clone-elem").forEach(element => {
				element.remove();
			});
		};

		switch (data.action) {
			// Сохранение настроек
			case "saveSettings":
				saveSettings(data.value);
				break;

			// Отрытие child у child
			case "toggleOpenChild":
				toggleOpenChild(data.value);
				break;

			// Закрытие всех child
			case "closeAllChild":
				closeAllChild();
				break;

			// Изменение меню в настройках
			case "changeSettingsTab":
				changeSettingsTab(data.value);
				break;

			// Изменение значений опций
			case "changeValue":
				changeValue(data.value);
				break;

			// Конец перетаскивания плашки
			case "dragEnd":
				settingsDragEnd(data.value);
				break;

			// Смена вкладки
			case "changeTab":
				changeTab(data.value, data.type);
				break;

			// Скрытие вкладки
			case "hideTab":
				hideTab(data.value);
				break;

			default:
				break;
		}
	};

	const showSettingsTab = tab => {
		isShow.value = {
			type: "updateTabs",
			state: true,
		};
		settingsTab.value = tab;
	};

	const setTabs = () => {
		tabs.value = props.tabs;
		activeTab.value.tab = Array.isArray(tabs.value) ? (tabs.value.length > 0 ? tabs.value[0].tab : null) : null;
	};

	onMounted(() => {
		setTabs();
	});

	watch(
		() => props.tabs,
		() => {
			setTabs();
		},
		{
			deep: true,
		}
	);
</script>
