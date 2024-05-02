import filter from "./filter";

export default function(page, fields) {
    switch (page) {
        case 'filter':
            return filter.renderElements(fields)
        default:
            break;
    }
}