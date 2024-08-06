<template>
	<thead
		class="table__header"
		ref="headerRef"
	>
		<tr class="table__row">
			<HeaderItem
				v-for="(item, index) in fields"
				:item="item"
				:headerRef="headerRef"
				:data-key="item.key"
				:isTrash="props.isTrash"
				:class="[item.fixed ? 'table__item_fixed' : '', !item.enabled ? 'table__item_hidden' : '', item.required ? 'table__item_required' : '', item.read_only || item.key == 'actions' ? 'table__item_readonly' : '', item.isUpdated ? 'table__item_updated' : '']"
				@mousedown="() => hideAllDetails()"
				@callAction="data => emit('callAction', data)"
				@dragStart="event => dragColumn({ action: 'dragStart', value: { event, key: item.key } })"
				@dragEnd="() => dragColumn({ action: 'dragEnd', value: null })"
			/>
		</tr>
	</thead>
</template>

<script setup>
	import "./Header.scss";

	import { ref, inject, onMounted, onUnmounted, watch } from "vue";

	import _ from "lodash";
	import HeaderItem from "./Item/Item.vue";
	import resizeTable from "./resizeTable.js";
	import commonScripts from "@/helpers/commonScripts.js";

	const headerRef = ref(null);

	const menu = inject("menu");
	const fields = inject("fields");
	const tableRef = inject("tableRef");

	let draggingItem = ref(null);
	let tableCopy = ref(null);
	let prevMouseCoords = ref(null);
	let mouseDown = ref(null);

	const props = defineProps({
		isTrash: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["callAction"]);

	// Движение мыши
	const onMouseMove = e => {
		// Перетаскивание колонки
		const moveColumn = posX => {
			let itemListParent = tableCopy.value.querySelector("thead tr");
			let itemList = itemListParent.querySelectorAll(".table__item");

			let tableBodyListParent = [...tableCopy.value.querySelectorAll("tbody tr")];
			let fromIndex = [...itemList].findIndex(p => p.getAttribute("data-key") == draggingItem.value);

			let stopDrag = false;

			let hoverElementIndex = [...itemList].findIndex((elem, index) => {
				let itemCoords = elem.getBoundingClientRect();
				let startCoord = itemCoords.x;
				let center = (itemCoords.x + (itemCoords.x + itemCoords.width)) / 2;
				let endCoord = itemCoords.x + itemCoords.width;
				let coord = (startCoord + center) / 2;

				if (posX >= coord && posX <= endCoord && ((posX > center + 3 && fromIndex > index) || (posX < center - 3 && fromIndex < index))) {
					stopDrag = true;
				}

				return posX >= coord && posX <= endCoord;
			});

			if (stopDrag || [null, undefined, -1].includes(hoverElementIndex) || itemList[hoverElementIndex].classList.contains("table__item_sticky")) return;

			if (fromIndex > hoverElementIndex) {
				itemListParent.insertBefore(itemList[fromIndex], itemList[hoverElementIndex]);

				for (let row of tableBodyListParent) {
					row.insertBefore(row.children[fromIndex], row.children[hoverElementIndex]);
				}
			} else if (fromIndex < hoverElementIndex) {
				itemListParent.insertBefore(itemList[hoverElementIndex], itemList[fromIndex]);

				for (let row of tableBodyListParent) {
					row.insertBefore(row.children[hoverElementIndex], row.children[fromIndex]);
				}
			} else {
				return;
			}
		};

		e = e || window.event;
		var dragX = e.pageX;
		if (prevMouseCoords.value != dragX) {
			moveColumn(dragX);
		}
		prevMouseCoords.value = dragX;
	};

	// Закрытие открытых меню
	const hideAllDetails = () => {
		let details = document.querySelectorAll("details[open]");
		details.forEach(element => {
			element.removeAttribute("open");
		});
	};

	// Перемещение колонки
	const dragColumn = data => {
		// Копирование таблицы
		const copyTable = () => {
			tableCopy.value = tableRef.value.cloneNode(true);
			tableCopy.value.classList.add("table_copy");

			let tableCells = tableCopy.value.querySelectorAll(".table__item");
			let tableRows = tableCopy.value.querySelectorAll(".table__row");

			tableRows.forEach((row, index) => {
				if (index >= 30) {
					row.remove();
				}
			});

			for (let cell of tableCells) {
				if (cell.getAttribute("data-key") == draggingItem.value) {
					cell.classList.add("sortable-ghost");
				}
			}

			setTimeout(() => {
				tableRef.value.closest(".table-template__body").appendChild(tableCopy.value);
				tableRef.value.closest(".section__table").style.setProperty("overflow", "hidden");

				tableRef.value.classList.add("table_hidden");
			}, 100);
		};

		// Обновление положения полей
		const updateFields = () => {
			let list = tableCopy.value.querySelectorAll("thead .table__item");
			let findedField = null;
			let data = [];
			list.forEach((element, index) => {
				findedField = fields.value.find(p => p.key == element.getAttribute("data-key"));
				findedField.index = index;
				data.push(findedField);
			});

			fields.value = data.sort((next, prev) => next.index - prev.index);
		};

		// Начало перетаскивания
		const dragStart = value => {
			draggingItem.value = value.key;

			copyTable();
			setDragImage(value.event);
			document.addEventListener("dragover", onMouseMove);
			tableRef.value.closest(".table-template__body").classList.add("table-template__body_drag");
		};

		// Конец перетаскивания
		const dragEnd = () => {
			// Удаление таблицы из дататрансфера
			const removeDragImage = () => {
				let removingItem = document.getElementById("table_transfer");
				if (removingItem != null) {
					removingItem.remove();
				}
			};

			draggingItem.value = null;
			updateFields();
			document.removeEventListener("dragover", onMouseMove);
			menu.value.saves.isShow = true;
			tableRef.value.closest(".section__table").style.removeProperty("overflow");

			setTimeout(() => {
				let cells = headerRef.value.querySelector("tr").children;
				resizeTable.setDefaultWidth(cells, fields.value);
				tableCopy.value.remove();
				tableRef.value.classList.remove("table_hidden");
				removeDragImage();
				tableRef.value.closest(".table-template__body").classList.remove("table-template__body_drag");
			}, 10);
		};

		// Создание колонки для дататрансфера
		const setDragImage = event => {
			if (document.getElementById("table_transfer") == null) {
				let table = tableCopy.value.cloneNode(true);
				let backupRows = tableRef.value.querySelectorAll(".table__row");
				table.id = "table_transfer";
				table.classList.add("table_transfer");
				table.classList.add("table");
				table.style.width = `${tableCopy.value.offsetWidth}px`;
				document.body.appendChild(table);

				let rows = table.querySelectorAll(".table__row");

				rows.forEach((row, index) => {
					let items = row.querySelectorAll(".table__item");
					for (let item of items) {
						if (item.getAttribute("data-key") != draggingItem.value) {
							item.remove();
						} else {
							let findedRow = [...backupRows][index];
							if (findedRow != undefined) {
								item.style.height = `${findedRow.offsetHeight}px`;
								item.classList.remove("sortable-ghost");
							} else {
								item.style.height = `${row.offsetHeight}px`;
							}
						}
					}
				});

				event.dataTransfer.setDragImage(table, event.offsetX, event.offsetY);
			}
		};

		switch (data.action) {
			// Копирование таблицы
			case "copyTable":
				copyTable();
				break;

			// Обновление положения полей
			case "updateFields":
				updateFields();
				break;

			// Начало перетаскивания
			case "dragStart":
				dragStart(data.value);
				break;

			// Конец перетаскивания
			case "dragEnd":
				dragEnd();
				break;
			default:
				break;
		}
	};

	// Отображение сохранения после ресайза колонки
	const updateTableHeader = e => {
		if (tableRef.value && tableRef.value.classList.contains("table_resizing")) {
			menu.value.saves.isShow = true;
			let findedIndex = fields.value.findIndex(p => p.key == mouseDown.value.closest(".table__item").getAttribute("data-key"));
			fields.value[findedIndex].width = `${mouseDown.value.closest(".table__item").offsetWidth}px`;

			setTimeout(() => {
				commonScripts.clearSelection();
			}, 5);
		}
	};

	// Скролл таблицы по горизонтали
	const scrollTable = _.throttle(async function () {
		resizeTable.setStickyClass(tableRef.value);
	}, 10);

	onMounted(() => {
		setTimeout(() => {
			resizeTable.resizableGrid(tableRef.value, fields.value);
		}, 100);

		tableRef.value.parentNode.addEventListener("scroll", scrollTable);
		document.addEventListener("mouseup", updateTableHeader);
		document.addEventListener("mousedown", e => {
			mouseDown.value = e.target;
		});
	});

	watch(
		() => fields.value,
		() => {
			if (fields.value.length > 0) {
				setTimeout(async () => {
					resizeTable.setCellsWidth(tableRef.value);
				}, 10);
				setTimeout(() => {
					resizeTable.setStickyClass(tableRef.value);
				}, 100);
			}
		},
		{ deep: true }
	);

	onUnmounted(() => {
		document.removeEventListener("dragover", onMouseMove);
		document.removeEventListener("mouseup", updateTableHeader);
		document.removeEventListener("mousedown", e => {
			mouseDown.value = e.target;
		});
	});
</script>
