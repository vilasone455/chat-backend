import { RequestHandler } from 'express';
import { EntityTarget } from 'typeorm';
declare function permission1To1<T>(entity: EntityTarget<T>, entityName: string): RequestHandler;
export default permission1To1;
