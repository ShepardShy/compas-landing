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
			:item="{
				id: 0,
				required: props.item.required,
				title: props.item.title,
				value: value,
				type: 'address',
				placeholder: null,
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
			@changeValue="data => changeValue(data)"
			@searchOptions="data => searchOptions(data)"
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
	import "./Field.scss";
	import { loadYmap } from "vue-yandex-maps";

	import _ from "lodash";
	import IconLasso from "@/components/AppIcons/Lasso/Lasso.vue";
	import AppAutocomplete from "@/components/AppAutocomplete/Input.vue";
	import IconLassoRemove from "@/components/AppIcons/Lasso/LassoRemove/LassoRemove.vue";
	import AppCopy from "@/components/AppCopy/AppCopy.vue";

	import { ref, onMounted, toRaw, watch } from "vue";
	import { useUserStore } from "@/stores/userStore.js";

	const userStore = useUserStore();

	const settings = {
		apiKey: "ef7607ff-665a-4e98-a65b-c73d97c69005",
		lang: "ru_RU",
		coordorder: "latlong",
		enterprise: false,
		version: "2.1",
	};

	let map = null;
	let polygon = ref(null);
	let markers = ref([]);
	let isSelectActive = ref(false);
	let localOptions = ref([]);
	let value = ref({
		text: null,
		coords: [55.755864, 37.617698],
	});

	onMounted(() => {
		setTimeout(async () => {
			await loadYmap(settings);

			if (props.isShowMap) {
				ymaps.ready(["Map", "Polygon"]).then(function () {
					map = new ymaps.Map("map", {
						center: value.value.coords,
						zoom: 15,
						height: props.isCountDistance ? "550px" : undefined,
					});

					if (props.isCountDistance) {
						const mkadPolygon = new ymaps.Polygon(props.mkadPolygonCoords);
						map.geoObjects.add(mkadPolygon, {}, { fillColor: "#fff" });
						console.log(map);
					} else {
						markers.value.push(value.value.coords);
						setMarkers();
					}
				});
			}
		}, 100);

		if (![null, undefined].includes(props.item.value) && props.item.value != "") {
			value.value = JSON.parse(JSON.stringify(props.item.value));
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
		mkadPolygonCoords: {
			default: false,
			type: Array,
		},
	});

	const emit = defineEmits(["changeValue"]);

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

	// Изменение значения
	const changeValue = data => {
		if (data.value) {
			markers.value.splice(
				markers.value.findIndex(p => _.isEqual(p, value.value.coords)),
				1,
				data.value.coords
			);
			value.value = data.value;

			if (props.isShowMap) {
				map.panTo([data.value.coords], {
					flying: false,
				});
				setMarkers();
			}
		} else {
			markers.value = [];
			value.value = {
				text: null,
				coords: [],
			};

			if (props.isShowMap) {
				map.panTo([55.755864, 37.617698], {
					flying: false,
				});
				setMarkers();
			}
		}

		emit("changeValue", data);
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
