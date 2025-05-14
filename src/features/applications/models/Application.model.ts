//! CLI by https://github.com/Dmn117

import boom from '@hapi/boom';
import Jwt from 'jsonwebtoken';
import { FilterQuery, PopulateOptions, Types } from "mongoose";

import User from '../../users/models/User.model';
import ApplicationSchema from "../schemas/Application.schema";
import CustomError from "../../../shared/interfaces/CustomError";

import { Roles } from '../../../shared/config/enumerates';
import { JWT_PRIVATE_KEY } from '../../../shared/config/constants';
import { USER_TEMPLATE } from '../../../shared/config/publicFields';
import IApplication, { ApplicationBase, ApplicationWithPopulate } from "../interfaces/Application.interfaces";


class Application {

    //! Private 

    //? Validate Data Entry
    private static validate = async (data: Partial<ApplicationBase>): Promise<void> => {
        const validations: Promise<any>[] = []
    
        if (data.owner) validations.push(User.exists('_id', data.owner));

        await Promise.all(validations);
    };

    //? Define The Populate Options
    private static populateOptions: PopulateOptions[] = [
        { path: 'owner', select: USER_TEMPLATE }
    ];

    //! Public 

    //? Find an application by Id
    public static findById = async (id: string, populate: boolean = false, error?: CustomError): Promise<IApplication | ApplicationWithPopulate> => {
        let query =  ApplicationSchema.findById(id);

        if (populate) query = query.populate(this.populateOptions);
        
        const app = await query;

        if (!app) throw (error || boom.notFound('Aplicacion no encontrada'));

        return app;
    };


    //? Find an application by Filter Query
    public static findOne = async (filter: FilterQuery<IApplication>, populate: boolean = false, error?: CustomError): Promise<IApplication | ApplicationWithPopulate> => {
        let query =  ApplicationSchema.findOne(filter);

        if (populate) query = query.populate(this.populateOptions);
        
        const app = await query;

        if (!app) throw (error || boom.notFound('Aplicacion no encontrada'));

        return app;
    };


    //? Validate if an application exists
    public static exists = async (field: keyof IApplication, value: any, error?: CustomError): Promise<Types.ObjectId> => {
        let exists = await ApplicationSchema.exists({ [field]: value });

        if (!exists) throw (error || boom.notFound('Aplicacion no encontrada'));

        return exists._id;
    };


    //? Create a new Application
    public static create = async (data: Partial<ApplicationBase>): Promise<IApplication> => {
        await this.validate(data);

        const app = await ApplicationSchema.create(data);

        const payload = {
            sub: app._id.toHexString(),
            role: Roles.APPLICATION
        };

        app.token = Jwt.sign(payload, JWT_PRIVATE_KEY, { algorithm: 'RS256' });

        await app.save();

        return app;
    };


    //? Enable | Disable an application by Id
    public static enableDisable = async (id: string, error?: CustomError): Promise<IApplication> => {
        const app = await this.findById(id, false, error) as IApplication;

        app.enabled = !app.enabled;

        await app.save();

        return app;
    };

    
    //? Delete an Application by Id
    public static delete = async (id: string, error?: CustomError): Promise<IApplication> => {
        const app = await ApplicationSchema.findByIdAndDelete(id);

        if (!app) throw (error || boom.notFound('Aplicacion no encontrada'));

        return app;
    };

    //? Authenticate Validations
    public static auth = async (id: string): Promise<void> => {
        const app = await this.findById(id) as IApplication;

        if (!app.enabled) throw boom.unauthorized('Aplicacion Deshabilitada');
    };
}



export default Application;