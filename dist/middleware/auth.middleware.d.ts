import { NextFunction, Response } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import HttpException from '../exceptions/HttpException';
export interface DataWithError<T> {
    data: T;
    error: HttpException;
}
declare function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction): Promise<void>;
export default authMiddleware;
