import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { useUserStore } from '@/stores/userStore.js'
import { useTableStore } from "~/stores/tableStore";
import { useTableDetailsStore } from "~/stores/tableDetailsStore";

export default function() {
    const userStore = useUserStore()

    const options = {
        authEndpoint: 'https://opt6.compas.pro/broadcasting/auth',
        broadcaster: 'pusher',
        key: '9c178d50f781876d1c75',
        httpHost: 'opt6.compas.pro',
        httpsHost: 'opt6.compas.pro',
        wsHost: 'opt6.compas.pro',
        wssHost: 'opt6.compas.pro',
        wsPort: 6001,
        wssPort: 6001,
        forceTLS: true,
        disableStats: true,
        encrypted: false,
        //enabledTransports: ['ws', 'wss'],
        cluster: 'eu',
        auth: {
            headers: {
                Authorization: `Bearer ${userStore.userToken}`
            },
        },
    }

    window.Pusher = Pusher
    window.Echo = new Echo(options);

    window.Echo
        .private('object-updated')
        .listen('ObjectUpdated', (data) => {

            console.log(data);
            // Обновление строк
            const updateObject = (data) => {
                const tableStore = useTableStore()
                const tableDetailsStore = useTableDetailsStore()

                if (userStore.modals.length > 0 || (userStore.user.id != data.user_id)) {
                    let findedRow = tableStore.objects[data.slug].table.socketRows.body.findIndex(row => row.id == data.viewList.id)
                    if (findedRow != -1) {
                        for (let key in data.viewList) {
                            tableStore.objects[data.slug].table.socketRows.body[findedRow][key] = data.viewList[key]
                        }
                    } else {
                        tableStore.objects[data.slug].table.socketRows.body.push(data.viewList)
                    }
                }

                for (let field of data.viewDetail.fields) {
                    let findedField = findField(field.field.id, tableDetailsStore.objects[`${data.slug}_${data.viewDetail.id}`])
                    let findedFieldModule = null

                    if (findedField && findedField.used_in_modules.length > 0) {
                        for (let module of findedField.used_in_modules) {
                            findedFieldModule = findFieldModule(field.field.id, tableDetailsStore.objects[`${data.slug}_${data.viewDetail.id}`], module.slug)

                            if (findedFieldModule) {
                                for (let keyField in field.field) {
                                    findedFieldModule[keyField] = field.field[keyField]
                                }
                            }
                        }
                    }
                    for (let keyField in field.field) {
                        if (findedField) {
                            findedField[keyField] = field.field[keyField]
                        }
                    }
                }
            }

            // Создание строки
            const createObject = (data) => {
                const tableStore = useTableStore()

                if (userStore.modals.length > 0 || (userStore.user.id != data.user_id)) {
                    data.viewList.isNew = true
                    tableStore.objects[data.slug].table.socketRows.body.push(data.viewList)
                }
            }

            // Удаление строки
            const deleteObject = (data) => {
                const tableStore = useTableStore()

                if (userStore.modals.length > 0 || (userStore.user.id != data.user_id)) {
                    data.viewList.isDeleted = true
                    if (tableStore.objects[data.slug].table.tableData.find(row => row.id == data.viewList.id) && userStore.modals.length > 0) {
                        tableStore.objects[data.slug].table.socketRows.body.push(data.viewList)
                    } else {
                        tableStore.objects[data.slug].table.socketRows.body = tableStore.objects[data.slug].table.socketRows.body.filter(row => row.id != data.viewList.id)
                    }
                }
            }

            // Обновление истории
            const updateHistory = (data) => {
                const tableDetailsStore = useTableDetailsStore()
                let historyData = tableDetailsStore.objects[`${data.slug}_${data.id}`].history.data
                tableDetailsStore.objects[`${data.slug}_${data.id}`].history.data = historyData.concat(data.fields)
            }

            switch (data.action) {
                // Обновление строк
                case 'ObjectUpdated':
                    updateObject(data.data)
                    break;
            
                // Создание строки
                case 'ObjectCreated':
                    createObject(data.data)
                    break;
                    
                // Удаление строки
                case 'ObjectDeleted':
                    deleteObject(data.data)
                    break;

                // Восстановление строки
                case 'ObjectRestored':
                    createObject(data.data)
                    break;

                // Обновление истории
                case 'HistoryUpdated':
                    updateHistory(data.data)
                    break;
                
                default:
                    break;
            }
    });

    window.Echo
        .private('object-updated')
        .listen('FieldUpdated', (data) => {
            console.log(data);

            // Обновление колонки
            const FieldUpdated = (data) => {
                const tableStore = useTableStore()
                let findedRow = tableStore.objects[data.slug].table.socketRows.header.findIndex(row => row.id == data.viewList.id)

                if (findedRow) {
                    let updatedFields = {
                        id: data.viewList.id,
                        color: data.viewList.color,
                        is_external_link: data.viewList.is_external_link,
                        is_plural: data.viewList.is_plural,
                        required: data.viewList.required,
                        title: data.viewList.title,
                    }
    
                    if (findedRow != -1) {
                        for (let key in updatedFields) {
                            tableStore.objects[data.slug].table.socketRows.header[findedRow][key] = updatedFields[key]
                        }
                    } else {
                        tableStore.objects[data.slug].table.socketRows.header.push(updatedFields)
                    }
                }
            }

            switch (data.action) {
                // Обновление колонки
                case 'FieldUpdated':
                    FieldUpdated(data.data)
                    break;
            
                default:
                    break;
            }
        });
}


const findField = (id, store) => {
    for (let key in store.order.columns) {
        for (let section of store.order.columns[key]) {
            for (let field of section.fields) {
                if (field.id == id) {
                    return field
                }
            }
        }
    }
}


const findFieldModule = (id, store, slug) => {
    if (store.module[slug]) {
        for (let key in store.module[slug].columns) {
            for (let section of store.module[slug].columns[key]) {
                for (let field of section.fields) {
                    if (field.id == id) {
                        return field
                    }
                }
            }
        }
    } else {
        return null
    }
}