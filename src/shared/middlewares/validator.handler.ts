import boom from '@hapi/boom';
import { Schema } from 'joi';
import { Request, Response } from "express";
import { RequestProperties } from '../config/enumerates';


const validatorHandler = (schema: Schema, property: RequestProperties) => {

    return (req: Request, res: Response, next: Function): void => {
        const data = req[property as keyof Request];
        const { error, value } = schema.validate(data, { abortEarly: false });

        if (error) {
            next(boom.badRequest(error));
        }
        else {
            Object.keys(value).forEach((key) => {
                req[property as keyof Request][key] = value[key];
            });
            next();
        }
    };
};

export default validatorHandler;