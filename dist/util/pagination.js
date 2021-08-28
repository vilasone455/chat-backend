"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paginateArray(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
exports.paginateArray = paginateArray;
exports.getPagination = (request, defaultTake = 5) => {
    const take = Number(request.query["take"]) || defaultTake;
    let page = Number(request.query["page"]) || 0;
    if (page > 0)
        page -= 1;
    let skip = page * take;
    let rs = {
        skip,
        take,
        page
    };
    return rs;
};
//# sourceMappingURL=pagination.js.map