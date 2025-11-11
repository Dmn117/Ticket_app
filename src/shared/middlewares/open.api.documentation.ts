import swaggerUI from 'swagger-ui-express';
import SwaggerParser from '@apidevtools/swagger-parser';

import { readFileSync } from "fs";
import { apiReference, ApiReferenceConfiguration } from "@scalar/express-api-reference";
import { Application, NextFunction, Request, Response } from 'express';

import { FAVICON, SWAGGER_THEME_MATERIAL, OPEN_API_YML } from '../config/constants';


const customCss: string = readFileSync(SWAGGER_THEME_MATERIAL, 'utf-8');
const customSiteTitle: string = 'MasteryTickets | Documentation';

const swaggerUIOptions: swaggerUI.SwaggerUiOptions = {
    explorer: true,
    customCss,
    customSiteTitle,
    customfavIcon: FAVICON,
    swaggerOptions: {
        displayRequestDuration: true
    }
};


const scalarUIOptions: Partial<ApiReferenceConfiguration> = { 
    url: '/api-docs.json', 
    theme: 'bluePlanet',
    hideClientButton: true,
    metaData: {
        title: customSiteTitle,
        favicon: FAVICON
    }
};


const openAPI = async (app: Application): Promise<void> => {
    const openApiDocument = await SwaggerParser.dereference(OPEN_API_YML);

    app.use('/api-docs/swagger', swaggerUI.serve, swaggerUI.setup(openApiDocument, swaggerUIOptions));

    app.use('/api-docs/scalar', apiReference(scalarUIOptions));

    app.get('/api-docs.json', (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).send(openApiDocument);
        } catch (error) {
            next(error);
        }
    });
};


export default openAPI;