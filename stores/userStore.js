import api from "@/helpers/api.js";
import { defineStore } from "pinia";
import commonScripts from "@/commonScripts/commonScripts.js";
import axios from "axios";

export const useUserStore = defineStore("userStore", {
	// states
	state: () => {
		return {
			user: {
				name: "Денис Потемкин",
				avatar: "/user/avatar.svg",
				color: "linear-gradient(82deg, #7ba06d, #6204c4)",
			},
			roles: [],
			authButtonLoad: false,
			authData: {
				// email: "",
				// password: "",
				domain: "",
				// remember_me: false,
			},
			authError: {
				text: "",
				status: false,
			},
			modals: [],
			// userToken: "1Eg6R5LWw2VsRXwn7gYcSYJ81awict9B5xllQES9yTcwavoaDQFslm9BtkQ7",
			userToken: null,
		};
	},

	// persist: {
	// 	storage: persistedState.localStorage,
	// },

	// actions
	actions: {
		async logIn(data, authRef) {
			let response = null;
			try {
				this.authButtonLoad = true;
				response = await api.callMethod("POST", `tenant/check`, data, { Authorization: "Bearer null" }, true, true, this.authData.domain);
				console.log(response, "response");
				if (response?.code == 404) {
					return;
				} else {
					authRef.classList.add("auth_disabled");
					this.userToken = response.token;
					this.authError = {
						status: false,
						text: "",
					};
					location.assign(`http://${this.authData.domain}.compas.pro/`);
					// window.location.href = `http://${this.authData.domain}.compas.pro/`;
					// navigateTo(`http://${this.authData.domain}.compas.pro`, {
					// external: true,
					// });
					// window.location.replace(`http://${this.authData.domain}.compas.pro`);
				}
			} catch (error) {
				this.authData = {
					domain: "",
				};
				this.authError = {
					status: true,
					text: error.data.error,
				};
			} finally {
				this.authButtonLoad = false;
			}
		},

		// Выход из приложения
		async logOut() {
			this.userToken = null;

			this.authError = {
				status: false,
				text: "",
			};
			this.authData = {
				email: "",
				password: "",
			};

			await this.clearStore();
		},

		async forgetPassword(data) {
			console.log(data);
			commonScripts.showNotification({
				title: "Восстановление пароля",
				description: `Сообщение было отправлено на почту ${data.email}`,
			});
		},

		async registration(data) {
			const res = await axios.post("/api/registration", { ...data, repeatPassword: undefined, confidence: undefined });
			console.log(res);
		},

		async clearStore() {
			this.authButtonLoad = false;
			this.authData = {
				email: "",
				password: "",
				remember_me: false,
			};
			this.authError = {
				text: "",
				status: false,
			};
		},
	},
});
