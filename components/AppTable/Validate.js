// Проверка на корректность заполнения поля
export default function (field, value) {
	let error = {
		state: false,
		text: null,
	};

	if (field.required) {
		switch (field.type) {
			// Проверка текстового поля
			case "text":
				if (checkTextValue(field, value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			// Проверка relation
			case "relation":
				if (checkSelectValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			// Проверка числа
			case "number":
				if (checkEmptyValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			// Проверка даты
			case "date":
				if (checkEmptyValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			// Проверка файла
			case "file":
				if (checkFileValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			// Проверка селекта
			case "select_dropdown":
				if (checkSelectValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;

			// Проверка автокомплита
			case "autocomplete":
				if (checkSelectValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			// Проверка группированного текстового поля
			case "text_group":
				if (checkSubfieldsValue(field)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;

			case "address":
				if (checkingAddress(field, value, `map-autocomplete_${field.id}`)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			case "email":
				if (checkEmptyValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			case "password":
				if (checkEmptyValue(value)) {
					return createError(error, "Поле обязательно к заполнению");
				}
				break;
			default:
				break;
		}
	}

	// Валидация по маске
	if (!checkEmptyValue(field.mask)) {
		if (validateField(field)) {
			return createError(error, `Некорректное значение, поле должно быть в формате: ${field.mask.replaceAll("#", "7")}`);
		}
	}

	return error;
}

// Создание ошибки
const createError = (error, text) => {
	(error.state = true), (error.text = text);
	return error;
};

// Проверка значения на пустоту
const checkEmptyValue = value => {
	return value == "" || [null, undefined, "Invalid Date"].includes(value);
};

// Проверка поля text на пустоту
const checkTextValue = (field, value) => {
	if (field.is_external_link) {
		if (checkEmptyValue(value)) {
			return true;
		} else if (typeof value == "object" && checkEmptyValue(value.external_link) && checkEmptyValue(value.value)) {
			return true;
		}
	} else {
		if (checkEmptyValue(value)) {
			return true;
		} else if (typeof value == "object" && checkEmptyValue(value.value)) {
			return true;
		}
	}
	return false;
};

// Проверка поля file на пустоту
const checkFileValue = value => {
	return value == null || value.length == 0 || value.filter(p => p != null && p != "").length == 0;
};

// Проверка поля select на пустоту
const checkSelectValue = value => {
	if (Array.isArray(value)) {
		return value.filter(option => option != null).length == 0;
	} else {
		return checkEmptyValue(value);
	}
};

// Проверка поля text_group на пустоту
const checkSubfieldsValue = field => {
	if (field.subfields != undefined) {
		return !(field.subfields.filter(subfield => !checkEmptyValue(subfield.value)).length > 0);
	} else {
		return false;
	}
};

// Проверка на правильное заполнение значения
const validateField = (field, fieldValue) => {
	// Создание регулярного выражения из маски
	const createRegexpMask = mask => {
		let newReg = "^";
		mask = mask.replace(/[\s()\-+]/g, "");

		for (let symb of mask) {
			switch (symb) {
				case "#":
					newReg += `[0-9]{1}`;
					break;
				case "A":
					newReg += `[а-яa-zА-ЯA-Z]{1}`;
					break;
				default:
					if (Number(symb) != NaN) {
						newReg += `[\\d]{1}`;
					}
					break;
			}
		}
		newReg += "$";

		return new RegExp(newReg);
	};

	// Валидация маски
	const checkingMask = value => {
		if (value == null || value == "") {
			return false;
		} else {
			value = value == null ? "" : value.replace(/[\s()\-+]/g, "");
			return !regExp.test(value);
		}
	};

	let regExp = createRegexpMask(field.mask);

	if (fieldValue != null && field.is_external_link) {
		if (typeof fieldValue == "string" || fieldValue == null) {
			fieldValue = {
				value: fieldValue,
				external_link: null,
			};
		}

		return checkingMask(fieldValue.value);
	} else {
		return checkingMask(fieldValue);
	}
};

// Проверка поля address на пустоту
const checkingAddress = (field, value, elemId) => {
	let element = document.getElementById(elemId);
	let modal = document.querySelector(".modal-container");

	// Проверка адреса на совпадение с сохраненным вариантом
	const checkAddress = field => {
		if (value == null || typeof value == "string" || value.search == "") return true;
		if (value.search != undefined) {
			if (value.search != value.text) {
				return false;
			}
		}
		return true;
	};

	if (element != null) {
		let tableItem = element.closest(".table__item");
		if (!checkAddress(field)) {
			element.classList.add("field_error");
			if (modal != null) {
				modal.querySelectorAll(".modal__content")[0].scrollBy(0, element.getBoundingClientRect().top - 100);
			} else {
				tableItem.classList.add("table__item_clicked");
				window.scrollBy(0, element.getBoundingClientRect().top - 100);
			}

			setTimeout(() => {
				element.setAttribute("open", true);
			}, 10);
			return true;
		} else {
			element.classList.remove("field_error");
		}
	}
	return false;
};
