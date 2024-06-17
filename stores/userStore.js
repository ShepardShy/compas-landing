import api from '@/helpers/api.js'
import { defineStore } from 'pinia'
import commonScripts from '@/commonScripts/commonScripts.js'

export const useUserStore = defineStore('userStore', {
    // states
    state: () =>  {
        return {
            user: {
                name: 'Денис Потемкин',
                avatar: '/user/avatar.svg',
                color: 'linear-gradient(82deg, #7ba06d, #6204c4)'
            },
            roles: [],
            authButtonLoad: false,
            authData: {
                email: '',
                password: '',
                portalName: '',
                remember_me: false
            },
            authError: {
                text: '',
                status: false
            },
            modals: [],
            userToken: null
        }
    },

    persist: {
        storage: persistedState.localStorage,
    },

    // actions
    actions: {
        async logIn(data, authRef) {
            let response = null
            try {
                this.authButtonLoad = true
                response = await api.callMethod("POST", `auth`, data, {Authorization: 'Bearer null'}, true, true, this.authData.portalName)
                if (response.code == 401) {
                    this.authData = {
                        portalName: '',
                        email: '',
                        password: ''
                    }
                    this.authError = {
                        status: true,
                        text: 'Данные введены неверно'
                    }
                    return
                } else {
                    authRef.classList.add('auth_disabled')
                    this.userToken = response.token
                    this.authError = {
                        status: false,
                        text: ''
                    }
                    window.location.href = `http://${this.authData.portalName}/${response.url}`;
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.authButtonLoad = false
            }
        },

        // Выход из приложения
        async logOut() {
            this.userToken = null

            this.authError = {
                status: false,
                text: ''
            }
            this.authData = {
                email: '',
                password: ''
            }

            await this.clearStore()
        },

        async forgetPassword(data) {
            console.log(data);
            commonScripts.showNotification({
                title: 'Восстановление пароля',
                description: `Сообщение было отправлено на почту ${data.email}`,
            })

        },

        async registration(data) {
            console.log(data);
        },

        async clearStore() {
            this.authButtonLoad = false
            this.authData = {
                email: '',
                password: '',
                remember_me: false
            }
            this.authError = {
                text: '',
                status: false
            }
        }
    }
})
