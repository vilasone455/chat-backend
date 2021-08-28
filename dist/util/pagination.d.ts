/// <reference types="qs" />
import { Request } from 'express';
interface Pagination {
    skip: number;
    take: number;
    page: number;
}
export declare function paginateArray(array: any, page_size: number, page_number: number): any;
export declare const getPagination: (request: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, defaultTake?: number) => Pagination;
export {};
