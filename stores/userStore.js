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
				domain: "",
			},
			regData: {
				email: "",
				emailError: [],
				password: "",
				passwordError: [],
				domain: "",
				domainError: [],
				passwordConfirmation: "",
				passwordConfirmationError: [],
				confidence: false,
			},
			authError: {
				text: "",
				status: false,
			},
			modals: [],
			// userToken: "1Eg6R5LWw2VsRXwn7gYcSYJ81awict9B5xllQES9yTcwavoaDQFslm9BtkQ7",
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

		async registration(payload) {
			const res = await api.callMethod("POST", "registration", { domain: payload.domain, email: payload.email, password: payload.password, password_confirmation: payload.passwordConfirmation });
			const { success, data } = res;

			if (success) {
				location.assign(`http://${this.regData.domain}.compas.pro/`);
				return;
			}
			for (let key in data) {
				if (key == "password_confirmation") {
					this.regData["passwordConfirmationError"] = data[key];
				}
				if (key in this.regData) {
					this.regData[`${key}Error`] = data[key];
				}
			}
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
