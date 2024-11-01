import axios from "axios";
import { useUserStore } from "~/stores/userStore";
import { useCommonStore } from "~/stores/commonStore";
import commonScripts from '~/commonScripts/commonScripts'

export default {
	call(type, url, params, headers) {
		return new Promise(async function (resolve, reject) {
			try {
				let response = await axios({
					method: type.toUpperCase(),
					url: url + (type.toLowerCase() == "get" && params.length > 0 ? "?" + params : ""),
					data: JSON_stringify(params, false),
					headers: Object.assign({ "Content-Type": "application/json" }, headers),
					//withCredentials: true,
				}).catch(error => {
					const router = useRouter();
					const userStore = useUserStore();
					const commonStore = useCommonStore();
					let lastModal = userStore.modals[userStore.modals.length - 1];
					if (error.response.status == 401) {
						// userStore.userToken = null
						window.location.href = "/auth";
					} else if (error.response.status == 404) {
						if (lastModal) {
							lastModal.errorCode = 404;
							window.history.pushState("", "Title", "/404");
						} else {
							resolve(error.response);
							router.push({ path: "/404" });
						}
					} else if (type.toUpperCase() == "GET" && error.response.status == 403) {
						commonStore.errorPage = {
							code: 403,
							reason: error.response.data.message,
						};

						if (lastModal) {
							lastModal.errorCode = 403;
							window.history.pushState("", "Title", "/403");
						} else {
							router.push({ path: "/403" });
						}
					} else if (error.response.status == 409) {
						commonScripts.showNotification(
							{
								title: "Ошибка при сохранении",
								description: error.response.data.message,
							},
							"error"
						);
					} else {
						commonScripts.showNotification(
							{
								title: "Ошибка при сохранении",
								description: error.response.data.message,
							},
							"error"
						);
					}
					resolve(error.response);
				});
				resolve(response.data);
			} catch (e) {
				reject(e);
			}
		});
	},
};

function JSON_stringify(s, emit_unicode) {
	var json = JSON.stringify(s);
	return emit_unicode
		? json
		: json.replace(/[\u007f-\uffff]/g, function (c) {
				return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
		  });
}

/*eslint no-prototype-builtins: "off"*/
function obj_to_url(obj) {
	function convert(param) {
		var str = "";
		for (var x in param) {
			if (!param.hasOwnProperty(x)) {
				continue;
			}
			str += ifArray(x, param[x]) + "&";
		}
		return str.trim("&");
	}

	function ifArray(key, val) {
		if (typeof val == "object" || Array.isArray(val)) {
			var str = "",
				index;
			for (var x in val) {
				if (!val.hasOwnProperty(x)) {
					continue;
				}
				index = /[^0-9]+/.test(x) ? key + "[" + x + "]" : key + "[" + x + "]";
				str += ifArray(index, val[x]) + "&";
			}
			return str.trim("&");
		}
		switch (val) {
			case false:
			case undefined:
			case NaN:
			case Infinity:
				val = 0;
				break;
			case true:
				val = 1;
				break;
			case null:
				val = "";
				break;
			default:
				val = val instanceof String ? val : val.toString();
		}
		val = encodeURIComponent(val);
		return encodeURIComponent(key) + "=" + val;
	}

	return convert(obj);
}
