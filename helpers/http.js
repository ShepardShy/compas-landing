import axios from "axios";

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
					const { response } = error;
					// if (response.status == 401) {
					// 	window.location.href = "/auth/entry";
					// }

					reject(response);

					// if (error.response.status == 404) {
					//     window.location.href = '/404';
					// }
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
