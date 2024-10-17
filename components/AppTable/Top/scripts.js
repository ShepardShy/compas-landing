import { nextTick } from 'vue'
import resizeTable from '../Header/resizeTable.js'

export default {
    // Установка полей для сортировке в мобильной версии
    setMobileSortOptions(fields) {
        return fields.map(field => {
            return {
                label: field.title,
                value: field.key
            }
        }).filter(field => !['isChoose', 'actions', 'iconDelete', 'iconDrag'].includes(field.value))
    },

     // Сортировка таблицы
    sortTable(emit, sortItem, data) {
        let request = {
            key: String(data.value),
            order: data.value == sortItem.key ? sortItem.order == "asc" ? "desc" : "asc" : "desc"
        }

        emit('callAction', {
            action: 'getTableData',
            value: request
        })

        return request
    },

    // Изменение видимости колонок
    changeVisibleColumn(fields, menu, tableRef, data) {
        let findedOption = fields.find(option => option.key == data.key)
        findedOption[menu.activeTab.tab] = data.value
        menu.showSaves(true)
        
        nextTick(() => {
            let findedCell = tableRef ? tableRef.querySelector(`th[data-key="${data.key}"]`) : undefined

            if (findedCell) {
                if (findedCell.offsetWidth <= 50) {
                    findedCell.querySelector('span').style.display = 'none'
                } else {
                    findedCell.querySelector('span').style.display = 'flex'
                }
            }
        }, 10);

        return fields
    },

    // Скачивание Экселя
    downloadExcel(emit, fields) {
        emit('callAction', {
            action: 'downloadExcel',
            value: fields.filter(field => field.enabled).map((field) => {
                return `fields[]=${field.key}`
            })
        })
    },

    // Сохранение настроек
    saveSettings(emit, tableRef, fields, sortItem, menu, role) {
        menu.showSaves(false)
        let tableFields = tableRef ? tableRef.querySelectorAll('.table__header:not(.table__header_copy) .table__item:not(.table__item_hidden)') : undefined

        if (tableRef) {
            tableFields.forEach(element => {
                let findedField = fields.find(p => p.key == element.getAttribute('data-key'))
                findedField.width = `${element.offsetWidth}px`
            });
        }

        emit('callAction', {
            action: 'saveFields', 
            value: {
                sortItem: sortItem,
                role: role, 
                fields: fields
            }
        })
    },


    // Установка колонок после перетаскивания
    setColumnAfterDragEnd(fields, tableRef, menu, value) {
        fields = value.to.__draggable_component__.modelValue
        let row = tableRef.querySelector('tr');
        let cols = row ? row.children : undefined;
        resizeTable.setDefaultWidth(cols, fields)
        menu.showSaves(true)

        document.querySelectorAll('#clone-elem').forEach(element => {
            element.remove()
        });

        return fields
    }
}