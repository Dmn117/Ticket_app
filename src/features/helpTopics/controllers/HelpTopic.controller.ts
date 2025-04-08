import { Request, Response } from "express";
import HelpTopicQueryParams from "../interfaces/HelpTopicQueryParams";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import CustomError from "../../../shared/interfaces/CustomError";
import { IHelpTopic } from "../interfaces/HelpTopic.interfaces";
import HelpTopic from "../models/HelpTopic.model";
import { date } from "joi";




class HelpTopicController {

    //! Private

    //? Assemeble Query Parameters
    public static assembleQueryParams = (req: Request): Partial<HelpTopicQueryParams> => {
        const params: Partial<HelpTopicQueryParams> = {};

        if (req.query.name) params.name = { $regex: req.query.name.toString(), $options: 'i'};

        if (req.query.expIn) params.expIn = Number(req.query.expIn);

        if (req.query.tags) {
            if (!req.query.includesTags || req.query.includesTags === 'true') {
                params.tags = { $in: req.query.tags.toString().split(', ')};
            }
            else {
                params.tags = { $nin: req.query.tags.toString().split(', ')};
            }
        }

        if (req.query.enabled) params.enabled = req.query.enabled === 'true';

        if (req.query.department) {
            if (!req.query.includesDepartments || req.query.includesDepartments === 'true') {
                params.department = { $in: req.query.department.toString().split(', ') }
            }
            else {
                params.department = { $nin: req.query.department.toString().split(', ') }
            }
        }


        return params;
    };

    //! Public

    //! GET Methods

    //? Get all or some help topics by Query parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: Partial<HelpTopicQueryParams> = this.assembleQueryParams(req);
            const helpTopics: IHelpTopic[] = await HelpTopic.find(params);

            res.status(200).json({
                message: 'Temas de ayuda recuperados exitosamente',
                helpTopics
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    
    //? Get Help Topic by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const helpTopic: IHelpTopic = await HelpTopic.findById(id);

            res.status(200).json({
                message: 'Tema de ayuda recuperado exitosamente',
                helpTopic
            });
        }  
        catch (error) {
            next(error as CustomError);
        }
    };

    //! POST Methods

    //? Create a new Help Topic
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const helpTopic: IHelpTopic = await HelpTopic.create(body);

            res.status(201).json({
                message: 'Tema de ayuda registrado exitosamente',
                helpTopic
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! PUT Methods

    //? Update Help Topic by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const helpTopic: IHelpTopic = await HelpTopic.update(id, body);
            
            res.status(200).json({
                message: 'Tema de ayuda actualizado exitosamente',
                helpTopic
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! PATCH Methods

    //? Enable Help Topic by Id
    public static enable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const organization = await HelpTopic.enableDisable(id, true);
            
            res.status(200).json({
                message: 'Tema de ayuda habilitado exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Disable Help Topic by Id
    public static disable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const organization = await HelpTopic.enableDisable(id, false);
            
            res.status(200).json({
                message: 'Tema de ayuda deshabilitado exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

}


export default HelpTopicController;