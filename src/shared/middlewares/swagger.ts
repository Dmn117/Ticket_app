import YAML from 'yaml';
import { readFileSync } from "fs";
import { Application, Request, Response } from 'express';

import swaggerUI from 'swagger-ui-express';
import ErrorHandler from '../interfaces/ErrorHandler';
import CustomError from '../interfaces/CustomError';
import { FAVICON, SWAGGER_THEME_MATERIAL, SWAGGER_YML } from '../config/constants';


const swaggerYaml: string = readFileSync(SWAGGER_YML, 'utf-8');
const swaggerDocument: any = YAML.parse(swaggerYaml);

const customCss: string = readFileSync(SWAGGER_THEME_MATERIAL, 'utf-8');
const customSiteTitle: string = 'Ticket Application | Documentation';

const options: swaggerUI.SwaggerUiOptions = {
    explorer: true,
    customCss,
    customSiteTitle,
    customfavIcon: FAVICON,
    isExplorer: true,
    swaggerOptions: {
        displayRequestDuration: true
    }
};


const jsonDocument = (req: Request, res: Response, next: ErrorHandler) => {
    try {
        res.status(200).send(swaggerDocument);
    }
    catch (error) {
        next(error as CustomError);
    }
};


const swagger = (app: Application): void => {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));
    app.use('/api-docs.json', jsonDocument);
};


export default swagger;