import _ from 'lodash'

export default {
    // Ресайз таблицы
    resizableGrid(table, fields) {
        // Установка слушателей на движение мышкой с бордером
        const setListeners = (div) => {
            let info = {
                pageX: 0,
                curCol: undefined,
                nxtCol: 0,
                index: 0,
                curColWidth: 0,
                prevDown: null
            };
    
            if (div == null || div.getAttribute('setListener') === 'true') return
    
            // Прослушивание события, что на блок кликнули
            div.addEventListener('mousedown', function (e) {
                // Установка паддингов
                const paddingDiff = (col) => {
                    // Получение значений стилей
                    const getStyleVal = (elm, css) => {
                        return (window.getComputedStyle(elm, null).getPropertyValue(css))
                    }
    
                    if (getStyleVal(col, 'box-sizing') == 'border-box') {
                        return 0;
                    }
    
                    let padLeft = getStyleVal(col, 'padding-left');
                    let padRight = getStyleVal(col, 'padding-right');
                    return (parseInt(padLeft) + parseInt(padRight));
                }
    
                info.curCol = info.prevDown = e.target.closest('.table__item');
                info.index = [...table.querySelectorAll('thead .table__item')].findIndex(p => p.getAttribute('data-key') == info.curCol.getAttribute('data-key'));
                info.nxtCol = info.curCol.nextElementSibling;
                info.pageX = e.pageX;

                table.classList.add('table_resizing')
                document.body.classList.add('body__unselected')
                let padding = paddingDiff(info.curCol);
                info.curCol.querySelector('.table-item__border').classList.add('table-item__border_changing')
                info.curColWidth = info.curCol.offsetWidth - padding;
            });

            // Прослушивание события, что на блок навелись
            div.addEventListener('mouseover', function (e) {
                let hoverElem = e.target.closest('.table__item_fixed')
                if (hoverElem != null) {
                    hoverElem.classList.add('table__item_hover')
                }
            })

            // Прослушивание события, что у блока меняют ширину
            document.addEventListener('mousemove', (e) => {
                const resizeCell = (e, info) => {               
                    if (info.curCol) {
                        let diffX = info.curColWidth + e.pageX - info.pageX;
                        if ((diffX) >= 40) {
                            onMouseMoveThrottle(table, tableHeader, sectionBody, info.curCol, diffX, info)
                        }
                    }
                }
                
                resizeCell(e, info)
            });
    
            // Прослушивание события, что блок отпустили
            document.addEventListener('mouseup', (e) => {
                // Очищение редактируемой ячейки
                function clearCell() {
                    if (info.curCol != undefined) {
                        let borderBlock = info.curCol.querySelector('.table-item__border')
                        borderBlock.classList.remove('table-item__border_changing')
                        borderBlock.style.height = '';
            
                        info.nxtCol != undefined ? info.nxtCol.classList.remove('changeWidth') : ''
                        info.curCol.classList.remove('changeWidth')
                        info.curCol.classList.remove('table__item_resizing')
                        document.body.classList.remove('body__cursor-style')
                        info.prevDown.classList.remove('table__item_hover')
                        info.prevDown = null
                        info.curCol = undefined;
                        info.nxtCol = undefined;
                        info.pageX = undefined;
                        info.curColWidth = undefined;

                        setTimeout(() => {
                            table.classList.remove('table_resizing')
                            document.body.classList.remove('body__unselected')
                        }, 10);
                    }
                }
                
                clearCell()
            });
    
            div.setAttribute('setListener', 'true')
        }
    
        let tableHeaders = table ? table.querySelectorAll('.table__header') : null
        let sectionBody = table ? table.parentNode : null
        let tableHeader = table ? table.querySelector('.table__header') : null

        if ([null, undefined].includes(tableHeaders)) return
        for (let localTableHeader of tableHeaders) {
    
            let row = localTableHeader.querySelector('tr');
            let cols = row ? row.children : undefined;
            if (!cols) return;
        
            setFixedCellsWidth(table)
            this.setDefaultWidth(cols, fields)
            this.setCellsWidth(table)
        
            if (localTableHeader.offsetWidth + 10 <= sectionBody.offsetWidth) {
                setCellsWidthDefference(localTableHeader, sectionBody)    
            }
    
            for (let i = 0; i < cols.length; i++) {
                let div = cols[i].querySelector('.table-item__border');
                setListeners(div);
            }
        }
    },

    // Установка изначального положения ячеек если ширина таблицы меньше секции
    setCellsWidth(table) {
        setFixedCellsWidth(table)
        this.setStickyClass(table)
    },

    // Установка цвета у зафиксированного столбца
    setStickyClass(table) {
        let rows = table.querySelectorAll('.table__row')
        let fixedFields = []
        let fieldPos = null

        if (rows.length == 0) return

        let scrolledArea = table.parentNode.scrollLeft
        // fixedFields = rows[0].querySelectorAll('.table__item_fixed:not(.table__item_hidden)')

        for (let row of rows) {
            fixedFields = row.querySelectorAll('.table__item_fixed:not(.table__item_hidden)')

            for (let cell of fixedFields) {
                fieldPos = cell.getBoundingClientRect().left - table.parentNode.getBoundingClientRect().left
                if ([null, undefined].includes(cell.style.getPropertyValue("--fixTarget")) || cell.style.getPropertyValue("--fixTarget") == '') {
                    setFixedCellsWidth(table);
                }

                if (scrolledArea != 0 && fieldPos == cell.style.getPropertyValue("--fixTarget").replace('px', '')) {
                    cell.classList.add('table__item_sticky')
                } else {
                    cell.classList.remove('table__item_sticky')
                }
            }
        }
    },

    // Установить значения ширин при импорте
    setDefaultWidth(cells, fields) {
        let width = null

        for (let cell of cells) {
            width = fields.find(p => p.key == cell.getAttribute('data-key')).width
            setCellWidth(cell, width)
            setVisibleTitle(cell)    
        }
    }
}

// Тротлинг для получения отступа фиксированной ячейки
const onMouseMoveThrottle = _.throttle(async function (table, tableHeader, sectionBody, cell, width, info) {
    setCellWidth(cell, width)
    setVisibleTitle(cell)

    if (cell.classList.contains('table__item_fixed')) {
        setFixedCellsWidth(table)
    }

    let data = table.querySelectorAll('tbody .table__row')
    let rowFields = []
    data.forEach(row => {
        rowFields = row.querySelectorAll('.table__item')
        setCellWidth([...rowFields][info.index], width)
    });

    if (table.offsetWidth <= sectionBody.offsetWidth + 1) {
        setCellsWidthDefference(tableHeader, sectionBody)
    }

    if (!cell.classList.contains('changeWidth')) {
        cell.classList.add('changeWidth')
        cell.classList.add('table__item_resizing')
    }
}, 10);

// Установка видимости заголовка у ячейки
const setVisibleTitle = (cell) => {
    let span = cell.querySelector('span') ?? cell.querySelector('.form-item__title')

    if (cell.offsetWidth <= 55) {
        span.style.display = 'none'
    } else {
        span.style.display = 'flex'
    }
}

// Установка изначального положения ячеек если ширина таблицы меньше секции
const setCellsWidthDefference = (tableHeader, sectionBody) => {
    let changingCell = tableHeader.querySelector('th.changeWidth')
    let cells = tableHeader.querySelectorAll('th:not(.changeWidth)')
    let widthData = null

    // Получение ширин для клеток
    const getProportionalСells = (cells, tableHeader, sectionBody) => {
        let widthData = []
        for (let cell of cells) {
            let part = getWidthPercent(cell)
            let width = getPartWidth(part.toFixed(2))
            widthData.push(width)
        }

        return widthData

        // Нахождение доли ячейки в секции
        function getWidthPercent(cell) {
            return cell.offsetWidth * 100 / tableHeader.offsetWidth
        }

        // Нахождение пикселей для ячейки 
        function getPartWidth(part) {
            return sectionBody.offsetWidth * part / 100
        } 
    }

    // Обновление ширины ячейки
    const updateWidth = (changingCell, array, sectionBody) => {
        let summaryWidth = changingCell == null ? 0 : changingCell.offsetWidth
        for (let i = 0; i <= array.length - 1; i++) {
            summaryWidth += array[i]
        }
    
        if (summaryWidth < sectionBody.offsetWidth) {
            array[array.length - 1] += sectionBody.offsetWidth - summaryWidth
        } 
    
        return array
    }

    widthData = getProportionalСells(cells, tableHeader, sectionBody)
    widthData = updateWidth(changingCell, widthData, sectionBody)

    for (let i = 0; i <= cells.length - 1; i++) {
        setCellWidth(cells[i], widthData[i])
        setVisibleTitle(cells[i])
    }
}

// Установка ширины ячейки
const setCellWidth = (cell, width) => {
    if (typeof width == 'string') {
        width = Number(width.replace('px', ''))
    }
    cell.style.setProperty("--defaultWidth", `${width.toFixed(2)}px`)
}

// Устанвока ширины у фикисрованных столбцов
const setFixedCellsWidth = (table) => {
    let rows = table.querySelectorAll('.table__row')
    let fixedFields = []
    let summaryWidth = 0

    for (let row of rows) {
        summaryWidth = 0
        fixedFields = row.querySelectorAll('.table__item_fixed:not(.table__item_hidden)')

        for (let index = 0; index < fixedFields.length; index++) {
            if (index > 0) {
                summaryWidth += fixedFields[index - 1].offsetWidth
            }

            fixedFields[index].style.setProperty("--fixTarget", `${summaryWidth}px`)
        }
    }
}