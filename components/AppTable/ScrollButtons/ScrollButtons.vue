<template>
	<AppLoader
		class="table-template__loader"
		ref="loaderRef"
	/>

	<div
		class="table-template__buttons"
		ref="buttonsRef"
		:class="`table-template__buttons_${buttonsPos}`"
	>
		<div
			class="scroll-button scroll-button_left"
			ref="buttonScrollLeftRef"
			:style="`--buttonPos: ${leftButtonPos}px`"
			@mouseover="() => actionScroll({ action: 'scrollingBlock', value: 'left' })"
			@mouseleave="() => (mouseHover = false)"
		></div>
		<div
			class="scroll-button scroll-button_right"
			ref="buttonScrollRightRef"
			:style="`--buttonPos: ${rightButtonPos}px`"
			@mouseover="() => actionScroll({ action: 'scrollingBlock', value: 'right' })"
			@mouseleave="() => (mouseHover = false)"
		></div>
	</div>

	<div class="table__empty-block">Нет данных</div>
</template>

<script setup>
	import "./ScrollButtons.scss";

	import _ from "lodash";
	import { ref, onMounted, inject, onUnmounted, watch } from "vue";

	import AppLoader from "@/components/AppLoader/AppLoader.vue";

	let mouseHover = ref(false);

	const loaderRef = ref(null);
	const buttonScrollLeftRef = ref(null);
	const buttonScrollRightRef = ref(null);
	const tableHeadRef = ref(null);
	const buttonsPos = ref("start");
	const buttonsRef = ref(null);

	let leftButtonPos = ref(0);
	let rightButtonPos = ref(0);

	const tableHeadCopy = ref(null);

	const tableRef = inject("tableRef");
	const isCanSort = inject("isCanSort");
	const sectionRef = inject("sectionRef");
	const scrollPosition = inject("scrollPosition");
	const sortItem = inject("sortItem");
	const menu = inject("menu");
	const footerData = inject("footerData");
	const selectAll = inject("selectAll");
	const bodyData = inject("bodyData");
	const actionState = inject("actionState");

	const props = defineProps({
		tableRef: {
			default: null,
		},
	});

	const emit = defineEmits(["callAction"]);

	let clickSetting = ref({
		id: -1,
		delay: 500,
		clicks: 0,
		timer: null,
	});

	onMounted(async () => {
		tableHeadRef.value = tableRef.value.querySelector(".table__header");
		window.addEventListener("scroll", throt_funScroll);
		tableRef.value.parentNode.addEventListener("scroll", scrollXThrottling);
		if (tableRef.value) {
			new ResizeObserver(resizeTable).observe(tableRef.value);
		}

		window.addEventListener("resize", setButtonPos);
	});

	onUnmounted(() => {
		window.removeEventListener("scroll", throt_funScroll);
		window.removeEventListener("resize", setButtonPos);
	});

	// Скролл таблицы и кнопок
	const actionScroll = data => {
		// Установка позиции у кнопок
		const setPosition = () => {
			if (tableRef.value?.getBoundingClientRect()?.top > 400 || tableRef.value?.getBoundingClientRect()?.top < 100) {
				buttonsRef.value?.classList?.add("table-template__buttons_hide");
			} else {
				buttonsRef.value?.classList?.remove("table-template__buttons_hide");
			}

			// старт таблицы
			if (sectionRef.value && sectionRef.value.sectionRef.getBoundingClientRect().top > 0) {
				const rect = sectionRef.value.sectionRef.getBoundingClientRect();
				const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
				buttonsPos.value = "start";

				if (isFullyVisible) {
					return (sectionRef.value.sectionRef.offsetHeight - 82) / 2 - 27;
				} else {
					return (window.innerHeight - sectionRef.value.sectionRef.getBoundingClientRect().top - 82) / 2 - 17;
				}
				// конец таблицы
			} else {
				let startPosScrollBlock = sectionRef.value?.sectionRef?.getBoundingClientRect()?.top + window.pageYOffset - document.body.clientTop;
				if (sectionRef.value && sectionRef.value?.sectionRef?.getBoundingClientRect()?.height + startPosScrollBlock < window.scrollY + window.innerHeight) {
					buttonsPos.value = "end";
					return window.innerHeight / 2 + (window.scrollY - startPosScrollBlock - startPosScrollBlock + 5);
				}
				// середина таблицы
				else {
					buttonsPos.value = "center";
					return window.innerHeight / 2 + window.scrollY - startPosScrollBlock - 41;
				}
			}
		};

		// Отображение псевдошапки
		const showCopyHeader = () => {
			let localTableHeader = tableRef.value.querySelector(".table__header");
			if (!localTableHeader) return;
			let tableBodyTop = localTableHeader.getBoundingClientRect().top;
			let copyHeader = tableRef.value.querySelector(".table__header_copy");

			const getWidth = () => {
				let cellsWidth = [];
				for (let cell of localTableHeader.querySelectorAll(".table__item")) {
					cellsWidth.push(cell.offsetWidth);
				}
				return cellsWidth;
			};

			const setWidth = () => {
				let arrWidth = getWidth();
				copyHeader.querySelectorAll(".table__item").forEach((element, index) => {
					element.width = `${arrWidth[index]}px`;
					element.style.setProperty("--defaultWidth", `${arrWidth[index].toFixed(2)}px`);
				});
			};

			if (tableBodyTop <= 0) {
				if (copyHeader == null) {
					copyHeader = localTableHeader.cloneNode(true);
					setWidth();
					copyHeader.classList.add("table__header_copy");
					tableRef.value.appendChild(copyHeader);
					copyHeader.addEventListener("click", doubleClick);
				}
			} else {
				if (copyHeader) {
					copyHeader.removeEventListener("click", doubleClick);
					copyHeader.remove();
					tableHeadCopy.value = null;
				}
			}
		};

		// Скролл при наведении на кнопку
		const scrollingBlock = pos => {
			// Смещение блока по иксу при наведении
			const scrollX = (scrollSection, pos) => {
				if (!mouseHover.value) {
					return;
				}
				setButtonsVisible(scrollSection);
				if (pos == "right") {
					if (scrollSection.scrollWidth == scrollSection.scrollLeft + scrollSection.offsetWidth) {
						return;
					}
					scrollSection.scrollLeft += 5;
					scrollSection.scrollTo({
						left: scrollSection.scrollLeft,
						top: 0,
					});
				} else {
					if (scrollSection.scrollLeft == 0) {
						return;
					}
					scrollSection.scrollLeft -= 5;
					scrollSection.scrollTo({
						left: scrollSection.scrollLeft,
						top: 0,
					});
				}
				setTimeout(() => {
					scrollX(scrollSection, pos);
				}, 0.1);
			};

			mouseHover.value = true;
			scrollX(tableRef.value.parentNode, pos);
		};

		// Отображение видимости кнопок
		const setButtonsVisible = scrollSection => {
			if (scrollSection.scrollWidth == scrollSection.offsetWidth) {
				buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.add("scroll-button_disabled") : null;
				buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.add("scroll-button_disabled") : null;
				return;
			} else if (scrollSection.scrollLeft == 0) {
				buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.add("scroll-button_disabled") : null;
				buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.remove("scroll-button_disabled") : null;
			} else if (scrollSection.scrollWidth == scrollSection.scrollLeft + scrollSection.offsetWidth) {
				buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.remove("scroll-button_disabled") : null;
				buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.add("scroll-button_disabled") : null;
			} else {
				buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.remove("scroll-button_disabled") : null;
				buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.remove("scroll-button_disabled") : null;
			}
		};

		switch (data.action) {
			// Установка позиции у кнопок
			case "setPosition":
				return setPosition();

			// Скролл при наведении на кнопку
			case "scrollingBlock":
				scrollingBlock(data.value);
				break;

			// Отображение видимости кнопок
			case "setButtonsVisible":
				setButtonsVisible(data.value);
				break;

			// Отображение псевдошапки
			case "showCopyHeader":
				showCopyHeader();
				break;
			default:
				break;
		}
	};

	// Троттлинг скролла по вертикали
	const throt_funScroll = () => {
		scrollPosition.value = actionScroll({ action: "setPosition", value: null });
		actionScroll({ action: "showCopyHeader", value: null });
	};

	// Двойной клик для псевдошапки
	const doubleClick = event => {
		let eventKey = event.target.closest(".table__item").getAttribute("data-key");

		if (event.target.closest(".form-item__checkbox") != null && eventKey == "isChoose") {
			selectAllRows(!selectAll.value);
		}

		clickSetting.value.clicks++;
		if (clickSetting.value.clicks === 1) {
			clickSetting.value.timer = setTimeout(() => {
				clickSetting.value.clicks = 0;
			}, clickSetting.value.delay);
		} else {
			if (isCanSort && eventKey != "isChoose" && eventKey != "actions") {
				sortItem.value = {
					key: eventKey,
					order: sortItem.value.key == eventKey ? (sortItem.value.order == "desc" ? "asc" : "desc") : "desc",
				};
				menu.value.saves.isShow = true;
				footerData.value.activePage = 1;

				let copyHeader = tableRef.value.querySelector(".table__header_copy");
				let findedIcon = copyHeader.querySelector(".icon__sort").cloneNode(true);

				if (sortItem.value.order == "asc") {
					findedIcon.classList.add("icon__sort_up");
				} else {
					findedIcon.classList.remove("icon__sort_up");
				}

				copyHeader.querySelectorAll(".icon__sort").forEach(item => {
					item.remove();
				});

				let findedField = [...copyHeader.querySelectorAll(".table__item")].find(p => p.getAttribute("data-key") == eventKey);
				findedField.querySelector(".table-item__content").appendChild(findedIcon);

				emit("callAction", {
					action: "getTableData",
					value: null,
				});
			}
			window.getSelection().empty();
			clearTimeout(clickSetting.value.timer);
			clickSetting.value.clicks = 0;
		}
	};

	// Выбор всех строк
	const selectAllRows = data => {
		selectAll.value = data;
		bodyData.value.forEach(row => {
			row.isChoose = selectAll.value;
		});

		if (data) {
			actionState.value = props.isTrash ? "restoring" : "editting";
		} else {
			actionState.value = null;
		}
	};

	// Установка положения кнопок
	const setButtonPos = () => {
		leftButtonPos.value = tableRef.value.parentNode.getBoundingClientRect().left;
		rightButtonPos.value = tableRef.value.parentNode.getBoundingClientRect().left + tableRef.value.parentNode.offsetWidth - 40;
	};

	// Троттлинг скролла по горизонтали
	const scrollXThrottling = _.throttle(() => {
		actionScroll({ action: "setButtonsVisible", value: tableRef.value.parentNode });
		tableHeadCopy.value = tableRef.value.querySelector(".table__header_copy");

		if (tableHeadCopy.value != null) {
			tableHeadCopy.value.scroll(tableRef.value.parentNode.scrollLeft, 0);
		}
	}, 5);

	const resizeTable = () => {
		if (tableRef.value) {
			actionScroll({ action: "setButtonsVisible", value: tableRef.value.parentNode });
		}
		scrollPosition.value = actionScroll({ action: "setPosition", value: null });
		setButtonPos();
	};
</script>
