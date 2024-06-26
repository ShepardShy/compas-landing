<template>
	<div class="map">
		<div
			class="map__actions"
			v-if="props.isCanSelect"
		>
			<IconLasso
				v-show="!isSelectActive"
				@click="() => selectPoligon(true)"
			/>
			<IconLassoRemove
				v-show="isSelectActive"
				@click="() => selectPoligon(false)"
			/>
		</div>

		<AppAutocomplete
			class="map__autocompete"
			ref="autocompleteComponent"
			:style="props.autoCompleteStyles"
			:item="{
				id: 0,
				required: props.item.required,
				title: props.item.title,
				value: props.isCountDistance ? address : value,
				type: 'address',
				placeholder: props.placeholder,
				focus: props.item.focus,
				key: props.item.key,
				options: localOptions,
				lockedOptions: [],
			}"
			:isReadOnly="props.isReadOnly"
			:isCanCreate="false"
			:isLink="false"
			:isShowId="false"
			:anotherTitle="null"
			:is-show-label="showInputLabel"
			:placeholder="props.placeholder"
			:isShowSubstring="props.isShowSubstring"
			:isShowButton="props.isShowInputButton"
			:isCountDistance="props.isCountDistance"
			@changeValue="data => changeValue(data)"
			@searchOptions="data => searchOptions(data)"
			@clickButton="data => changeValue(data, 'calculate')"
		/>

		<AppCopy
			v-if="value && value.text"
			:text="value.text"
			:buttonTitle="'Скопировать адрес'"
		/>

		<div
			class="map__container"
			v-if="props.isShowMap"
		>
			<div
				id="map"
				class="yandex-container"
				:style="mapStyles"
			></div>
			<canvas
				id="draw-canvas"
				style="position: absolute; left: 0; top: 0; display: none"
			></canvas>
			<a
				class="map__link"
				target="_blank"
				:href="`https://maps.yandex.ru/?text=${value.coords.join('+')}`"
			>
				Открыть в Яндекс картах
			</a>
		</div>
	</div>
</template>

<script setup>
	import { loadYmap } from "vue-yandex-maps";
	import "./Field.scss";

	import AppAutocomplete from "@/components/AppAutocomplete/Input.vue";
	import AppCopy from "@/components/AppCopy/AppCopy.vue";
	import IconLasso from "@/components/AppIcons/Lasso/Lasso.vue";
	import IconLassoRemove from "@/components/AppIcons/Lasso/LassoRemove/LassoRemove.vue";
	import _ from "lodash";

	import { useUserStore } from "@/stores/userStore.js";
	import { onMounted, ref, toRaw, watch } from "vue";
	import { render } from "sass";

	const userStore = useUserStore();

	const settings = {
		apiKey: "cf49735b-c6b6-46d6-90d5-0ef59b9cdf11", // ef7607ff-665a-4e98-a65b-c73d97c69005
		lang: "ru_RU",
		coordorder: "latlong",
		enterprise: false,
		version: "2.1",
	};

	const dayjs = useDayjs();

	let map = null;
	const autocompleteComponent = ref(null);
	const arrPlacemarksRez = ref(null);
	let polygon = shallowRef(null);
	let multiRoute = shallowRef(null);
	let positionClick = shallowRef(null);
	let lastRoute = shallowRef(null);
	let lastPoint = shallowRef(null);
	let routeLength = ref(null);
	let markers = ref([]);
	let isSelectActive = ref(false);
	let address = ref(null);
	let localOptions = ref([]);
	let value = shallowRef({
		text: null,
		coords: [55.755864, 37.617698],
	});

	onMounted(() => {
		setTimeout(async () => {
			await loadYmap(settings);

			if (props.isShowMap) {
				ymaps.ready(["Map", "Polygon"]).then(function () {
					map = new ymaps.Map(
						"map",
						{
							center: props.isCountDistance ? props.coords : value.value.coords,
							zoom: props.mapZoom,
							height: props.isCountDistance ? "550px" : undefined,
						},
						{ suppressMapOpenBlock: true, suppressObsoleteBrowserNotifier: true }
					);
					map.options.set("suppressMapOpenBlock", true);
					map.options.set("suppressObsoleteBrowserNotifier", true);

					if (props.isCountDistance) {
						clickMap();
						createPolygon();
					} else {
						markers.value.push(value.value.coords);
						setMarkers();
					}
				});
			}
			watch(
				() => props.polygonCoords,
				() => {
					changeCoords();
				}
			);
		}, 100);

		if (![null, undefined].includes(props.item.value) && props.item.value != "") {
			value.value = JSON.parse(JSON.stringify(props.item.value));
			if (props.isCountDistance) return;
			localOptions.value.push({
				label: {
					text: props.item.value ? props.item.value.text : null,
				},
				value: props.item.value,
			});
		}
	});

	const props = defineProps({
		isCanSelect: {
			default: false,
			type: Boolean,
		},
		item: {
			default: {
				id: 0,
				title: "Адрес",
				key: "address",
				required: false,
				focus: false,
				value: {
					text: null,
					coords: [],
				},
				options: [],
				lockedOptions: [],
			},
			type: Object,
		},
		isReadOnly: {
			default: false,
			type: Boolean,
		},
		isShowMap: {
			default: false,
			type: Boolean,
		},
		isShowMap: {
			default: false,
			type: Boolean,
		},
		isCountDistance: {
			default: false,
			type: Boolean,
		},
		polygonCoords: {
			default: false,
		},
		coords: {
			default: [55.755864, 37.617698],
			type: Array,
		},
		mapZoom: {
			default: 15,
			type: Number,
		},
		mapStyles: {
			default: {},
			type: Object,
		},
		showInputLabel: {
			default: false,
			type: Boolean,
		},
		placeholder: {
			default: null,
			type: String,
		},
		isShowSubstring: {
			default: true,
			type: Boolean,
		},
		isShowInputButton: {
			default: false,
			type: Boolean,
		},
		autoCompleteStyles: {
			default: {},
			type: Object,
		},
	});

	const emit = defineEmits(["changeValue", "selectAddress"]);

	// Клик по карте
	const clickMap = e => {
		map.events.add("click", function (e) {
			positionClick.value = e.get("coords");

			renderRoute();

			// multiRoute.value.model.events.add("requestsuccess", function (route) {
			// 	address.value = multiRoute.value.getWayPoints().get(1)?.geometry?.getCoordinates();
			// 	// map.balloon.open(positionClick.value, multiRoute.value.getWayPoints().get(1)?.properties?.get("address"), {
			// 	// 	closeButton: false,
			// 	// });
			// });
		});
	};

	// Прокладка маршрута
	const renderRoute = async (positionRoute, data) => {
		// Данные из инпута
		if (positionRoute) {
			positionClick.value = positionRoute;
		} else if (positionRoute === null) {
			lastRoute.value && map.geoObjects?.remove(lastRoute.value);
			emit("changeValue", "0");
			return;
		}

		// Ближайшая точка

		// Создаем коллекцию, в которую будем добавлять метки
		let routes = [];

		for (let elem of props.polygonCoords[0]) {
			let route = new ymaps.route([positionClick.value, elem], { results: 1 });
			routes.push(route);
		}
		routes = await Promise.all(routes);

		// routes = ymaps.geoQuery(routes);
		routes = routes.map(route => {
			return {
				length: route.getLength(),
				route,
			};
		});
		let sorted = routes.sort((a, b) => a.length - b.length)[0];
		console.log(positionClick.value);
		console.log(sorted.route.getWayPoints().get(1).geometry.getCoordinates(), "sorted");
		let closestPoint = sorted.route.getWayPoints().get(1).geometry.getCoordinates();

		// у позиции 6 цифр после запятой
		positionClick.value = [(+positionClick.value[0]).toFixed(6), (+positionClick.value[1]).toFixed(6)];

		// построение пути
		console.log(closestPoint, positionClick.value);
		multiRoute.value = new ymaps.multiRouter.MultiRoute(
			{
				referencePoints: [closestPoint, positionClick.value],
				params: {
					routingMode: "auto",
					results: 1,
					reverseGeocoding: true,
				},
			},
			{ wayPointVisible: false, viaPointVisible: false, routeActiveMarkerVisible: false, routeOpenBalloonOnClick: false }
		);

		// Проверка внутри полигона
		const myObjects = ymaps.geoQuery({
			type: "Point",
			coordinates: positionClick.value,
		});
		const isInside = !!myObjects?.searchInside(polygon.value)?.getLength();

		if (isInside) {
			renderPoint(positionClick.value);
			multiRoute.value.options.set("visible", false);
		} else {
			renderPoint(positionClick.value);
		}

		// Удаление предыдущего пути
		lastRoute.value && map?.geoObjects?.remove(lastRoute.value);
		lastRoute.value = multiRoute.value;

		multiRoute.value.model.events.add("requestsuccess", async function () {
			let between = spaceBetween(multiRoute.value.getWayPoints().get(0)?.geometry?.getCoordinates(), multiRoute.value.getWayPoints().get(1)?.geometry?.getCoordinates());
			between = (await Promise.all([between]))[0];
			if (isInside) {
				emit("changeValue", "0");
			} else {
				emit("changeValue", between);
			}
			// map.balloon.open(positionClick.value, multiRoute.value.getWayPoints().get(1)?.properties?.get("address"), {
			// 	closeButton: false,
			// });

			// Форимирование ответа с данными
			let address = null;
			if (data?.search) {
				address = data.search;
			} else {
				address = multiRoute.value.getWayPoints().get(1).geometry.getCoordinates().join(", ");
			}

			const historyItem = { address, distance: between, date: dayjs().format("DD.MM.YYYY"), time: dayjs().format("HH:mm") };
			emit("selectAddress", historyItem);
		});
		map?.geoObjects.add(multiRoute.value);
	};

	// Удаление маршрута

	const removeRoute = () => {
		multiRoute.value && map?.geoObjects?.remove(multiRoute.value);
		emit("changeValue", "0");
	};

	// Расчёт расстояния
	const spaceBetween = async (point1, point2) => {
		let arrayPromises = [];
		let res = null;

		arrayPromises.push(ymaps.geocode(point1), ymaps.geocode(point2));
		res = await Promise.all(arrayPromises);
		const point1Coords = res[0].geoObjects.get(0)?.geometry?.getCoordinates();
		const point2Coords = res[1].geoObjects.get(0)?.geometry?.getCoordinates();
		arrayPromises = [];
		arrayPromises.push(ymaps.formatter.distance(ymaps.coordSystem.geo.getDistance(point1Coords, point2Coords)));
		res = await Promise.all(arrayPromises);
		let between = res[0];
		routeLength.value = between;
		return between;
	};

	// Создание полигона
	const createPolygon = () => {
		polygon.value = new ymaps.Polygon(props.polygonCoords, {}, { fillColor: "#689c46", opacity: 0.1 }); //  0.1
		map.geoObjects.add(polygon.value);

		// Рисование полигона

		// polygon.value.editor.startDrawing();
		// var stateMonitor = new ymaps.Monitor(polygon.value.editor.state);
		// stateMonitor.add("drawing", function (newValue) {
		// 	console.log(polygon.value.geometry.getCoordinates());
		// 	polygon.value.options.set("strokeColor", newValue ? "#FF0000" : "#0000FF");
		// });

		const arrPlacemarks = [];
		for (let i = 0; i < props.polygonCoords[0].length; i++) {
			const placemark = new ymaps.Placemark(props.polygonCoords[0][i]);
			placemark.options.set("visible", false);

			arrPlacemarks[i] = placemark;
		}
		arrPlacemarksRez.value = ymaps.geoQuery(arrPlacemarks).addToMap(map);
	};

	// Удаление полигона
	const removePolygon = () => {
		map.geoObjects?.remove(polygon?.value);
	};

	// Смена координат
	const changeCoords = () => {
		removePolygon();
		removeMarkers();
		createPolygon();
		emit("changeValue", "0");
		map?.panTo(props.coords, {
			flying: false,
		});
	};

	// Удаление меток
	const removeMarkers = () => {
		map.geoObjects.removeAll();
	};

	// Клик по полигону

	// Создание меток
	const setMarkers = () => {
		map.geoObjects.removeAll();

		for (let marker of markers.value) {
			var myPlacemark = new ymaps.Placemark(marker);
			map.geoObjects.add(myPlacemark);
		}
	};

	// Нахождение меток попавших в полигон
	const selectPoligon = status => {
		let copyMap = toRaw(map);
		let copyPolygon = toRaw(polygon.value);

		let polygonOptions = {
			strokeColor: "#0000ff",
			fillColor: "#8080ff",
			interactivityModel: "default#transparent",
			strokeWidth: 4,
			opacity: 0.7,
		};

		let canvasOptions = {
			strokeStyle: "#0000ff",
			lineWidth: 4,
			opacity: 0.7,
		};

		// Отрисовка полигона
		const drawLineOverMap = () => {
			var canvas = document.querySelector("#draw-canvas");
			var ctx2d = canvas.getContext("2d");
			var drawing = false;
			var coordinates = [];

			// Задаем размеры канвасу как у карты.
			var rect = map.container.getParentElement().getBoundingClientRect();
			canvas.style.width = rect.width + "px";
			canvas.style.height = rect.height + "px";
			canvas.width = rect.width;
			canvas.height = rect.height;

			// Применяем стили.
			ctx2d.strokeStyle = canvasOptions.strokeStyle;
			ctx2d.lineWidth = canvasOptions.lineWidth;
			canvas.style.opacity = canvasOptions.opacity;

			ctx2d.clearRect(0, 0, canvas.width, canvas.height);

			// Показываем канвас. Он будет сверху карты из-за position: absolute.
			canvas.style.display = "block";

			canvas.onmousedown = function (e) {
				// При нажатии мыши запоминаем, что мы начали рисовать и координаты.
				drawing = true;
				coordinates.push([e.offsetX, e.offsetY]);
			};

			canvas.onmousemove = function (e) {
				// При движении мыши запоминаем координаты и рисуем линию.
				if (drawing) {
					var last = coordinates[coordinates.length - 1];
					ctx2d.beginPath();
					ctx2d.moveTo(last[0], last[1]);
					ctx2d.lineTo(e.offsetX, e.offsetY);
					ctx2d.stroke();

					coordinates.push([e.offsetX, e.offsetY]);
				}
			};

			return new Promise(function (resolve) {
				// При отпускании мыши запоминаем координаты и скрываем канвас.
				canvas.onmouseup = function (e) {
					coordinates.push([e.offsetX, e.offsetY]);
					canvas.style.display = "none";
					drawing = false;

					coordinates = coordinates.map(function (x) {
						return [x[0] / canvas.width, x[1] / canvas.height];
					});
					resolve(coordinates);
				};
			});
		};

		// Нахождение меток
		const filterMarkers = myPolygon => {
			let data = [];
			for (let marker of markers.value) {
				if (myPolygon.geometry.contains(marker)) {
					data.push(marker);
				}
			}
		};

		copyMap.geoObjects.remove(copyPolygon);
		if (status) {
			isSelectActive.value = true;
			drawLineOverMap().then(function (coordinates) {
				var bounds = copyMap.getBounds();
				coordinates = coordinates.map(function (x) {
					return [bounds[0][0] + (1 - x[1]) * (bounds[1][0] - bounds[0][0]), bounds[0][1] + x[0] * (bounds[1][1] - bounds[0][1])];
				});

				coordinates = coordinates.filter(function (_, index) {
					return index % 3 === 0;
				});

				if (copyPolygon) {
					copyMap.geoObjects.remove(copyPolygon);
				}

				copyPolygon = new ymaps.Polygon([coordinates], {}, polygonOptions);
				polygon.value = copyPolygon;
				copyPolygon.options.setParent(copyMap.options);
				copyPolygon.geometry.setMap(copyMap);
				copyMap.geoObjects.add(copyPolygon);
				filterMarkers(copyPolygon);
				isSelectActive.value = false;
				map = copyMap;
			});
		} else {
			console.log(null);
		}
	};

	//Сброс маршрута
	const resetRoute = () => {
		// changeValue(null);
		removeRoute();
		removePoint();
		map?.panTo(props.coords, {
			flying: false,
		});
		autocompleteComponent.value.reset();
		address.value = "";
	};

	defineExpose({
		resetRoute,
	});

	// Отрисовка точки

	const renderPoint = position => {
		map.geoObjects?.remove(lastPoint.value);
		lastPoint.value = new ymaps.Placemark(position);
		map.geoObjects.add(lastPoint.value);
	};

	// Удалить точку

	const removePoint = () => {
		map.geoObjects?.remove(lastPoint.value);
	};

	// Изменение значения
	const changeValue = (data, action = "show") => {
		if (props.isCountDistance) {
			let position = data?.value?.coords ? data?.value?.coords : null;

			let search = data?.search;
			let coords = search?.split(",");
			if (coords?.length > 0 && !isNaN(+coords?.[0]) && !isNaN(+coords?.[1])) {
				position = [+coords[0], +coords[1]];
			}

			if (position) {
				position = [+position[0], +position[1]];

				map?.panTo(position, {
					flying: false,
				});

				action == "show" && renderPoint(position);
				action == "calculate" && renderRoute(position, data);
			}
		}
		if (data?.value && !props.isCountDistance) {
			markers.value.splice(
				markers.value.findIndex(p => _.isEqual(p, value.value.coords)),
				1,
				data.value.coords
			);
			value.value = data.value;
		} else {
			markers.value = [];
			value.value = {
				text: null,
				coords: [],
			};
		}

		if (props.isShowMap && data?.value?.coords && !props.isCountDistance) {
			map?.panTo([data?.value?.coords], {
				flying: false,
			});
			!props.isCountDistance && setMarkers();
		} else {
			!props.isCountDistance &&
				map?.panTo(props.isCountDistance ? props.coords : [55.755864, 37.617698], {
					flying: false,
				});
			!props.isCountDistance && setMarkers();
		}

		if (!props.isCountDistance) {
			emit("changeValue", data);
		}
	};

	// Поиск опций
	const searchOptions = async data => {
		// Метод для вставки запроса на получение опций
		const getOptions = async search => {
			let request = await fetch(`https://opt6.compas.pro/api/map/geocode?address=${search}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${userStore.userToken}`,
				},
			});
			return await request.json();
		};

		// Установка опций
		const setOptions = gettingData => {
			localOptions.value = gettingData.map(
				option =>
					(option = {
						label: {
							text: option.text,
						},
						value: {
							text: option.text,
							coords: option.coords,
						},
					})
			);
		};

		let gettingData = await getOptions(data.value);
		setOptions(gettingData);
	};

	watch(
		() => props.item.value,
		() => {
			value.value = props.item.value
				? JSON.parse(JSON.stringify(props.item.value))
				: {
						text: null,
						coords: [55.755864, 37.617698],
				  };
			localOptions.value.push({
				label: {
					text: props.item.value ? props.item.value.text : null,
				},
				value: props.item.value
					? props.item.value
					: {
							text: null,
							coords: [55.755864, 37.617698],
					  },
			});
		}
	);
</script>
