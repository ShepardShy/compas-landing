import http from "./http";

export default {
	callMethod(type, method, params = {}, headers = { Authorization: "Bearer null" }, is_prefix = true) {
		return new Promise(async (resolve, reject) => {
			const url = (process.env.NODE_ENV == "development" ? "https://compas.pro" : "https://compas.pro") + (is_prefix ? "/api/" : "/") + method;
			try {
				let result = await http.call(type, url, params, headers);
				resolve(result);
			} catch (e) {
				reject(e);
			}
		});
	},
};
