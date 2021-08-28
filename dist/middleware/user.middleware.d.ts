import { NextFunction, Response } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
declare function userMiddleware(request: RequestWithUser, response: Response, next: NextFunction): Promise<void>;
export default userMiddleware;
