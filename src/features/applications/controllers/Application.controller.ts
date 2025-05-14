//! CLI by https://github.com/Dmn117

import { Request, Response } from "express";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import CustomError from "../../../shared/interfaces/CustomError";
import Application from "../models/Application.model";
import { FilterQuery } from "mongoose";
import IApplication from "../interfaces/Application.interfaces";


class ApplicationController {

    //! Private

    //? Assemble Query Parameters
    private static assembleQueryParameters = (req: Request): FilterQuery<IApplication> => {
        const params: FilterQuery<IApplication> = {};

        if (req.query.name) params.name = { $regex: req.query.name.toString(), $options: 'i' };
        if (req.query.enabled) params.enabled = req.query.enabled.toString() === 'true';
        if (req.query.owner) params.owner = req.query.owner.toString();

        return params;
    };


    //! Public


    //* GET Methods

    
    //? Get an application by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const application = await Application.findById(id, true);

            res.status(200).json({
                message: 'Aplicacion recuperada exitosamente',
                application
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Get an application by Query Parameters
    public static getByQueryParams = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params = this.assembleQueryParameters(req);
            const application = await Application.findOne(params, true);

            res.status(200).json({
                message: 'Aplicacion recuperada exitosamente',
                application
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //* POST Methods
    

    //? Create a new application 
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const application = await Application.create(body);

            res.status(201).json({
                message: 'Aplicacion registrada exitosamente',
                application
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //* PATCH Methods


    //? Create a new application 
    public static enableDisable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const application = await Application.enableDisable(id);

            res.status(200).json({
                message: `Aplicacion ${application.enabled ? 'habilitada' : 'deshabilitada'} exitosamente`,
                application
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //* DELETE Methods


    //? Create a new application 
    public static delete = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const application = await Application.delete(id);

            res.status(200).json({
                message: 'Aplicacion eliminada exitosamente',
                application
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };
};



export default ApplicationController;