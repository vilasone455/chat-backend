import { RequestHandler } from 'express';
import { EntityTarget } from 'typeorm';
declare function validationMiddleware<T>(entity: EntityTarget<T>, fieldName?: string): RequestHandler;
export default validationMiddleware;
