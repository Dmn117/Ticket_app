import { Request, Response } from "express";
import IncidentQueryParams from "../interfaces/IncidentQueryParams";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import CustomError from "../../../shared/interfaces/CustomError";
import { IIncidence, IncidenceWithPopulate } from "../interfaces/Incident.interfaces";
import Incidence from "../models/Incidence.model";



class IncidentController {

    //! Private

    //? Assemble Query Paramaters
    private static assembleQueryParams = (req: Request): Partial<IncidentQueryParams> => {
        const params: Partial<IncidentQueryParams> = {};

        const date: typeof params.createdAt = {};

        if (req.query.title) params.title = { $regex: req.query.title.toString(), $options: 'i' };

        if (req.query.description) params.description = { $regex: req.query.description.toString(), $options: 'i' };
        
        if (req.query.severity) {
            let numbers: number[] = req.query.severity
                .toString()
                .split(',')
                .map(item => Number(item.trim()))

            if (req.query.includesSeverity === 'false') 
                params.severity = { $nin: numbers }
            else 
                params.severity = { $in: numbers }
        }

        if (req.query.author) params.author = req.query.author.toString();

        if (req.query.agent) {
            let agents: string[] = req.query.agent
                .toString()
                .split(',')
                .map(agent => agent.trim());
            
            if (req.query.includesAgent === 'false') {
                params.agent = { $nin: agents };
            }
            else {
                params.agent = { $in: agents };
            }
        }
        
        if (req.query.startDate) date.$gte = new Date(req.query.startDate.toString());

        if (req.query.endDate) date.$lte = new Date(req.query.endDate.toString());
        
        if (date.$gte || date.$lte) params.createdAt = date;
        
        return params;
    };
    
    //! Public

    //? GET Methods

    //? Get all or some Incidents by Query Parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: Partial<IncidentQueryParams> = this.assembleQueryParams(req);
            const incidents = await Incidence.find(params);

            res.status(200).json({
                message: 'Incidencias recuperadas exitosamente',
                incidents
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Get Incidents by Boss Id
    public static getByBossId = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const incidents = await Incidence.findByBossId(id);

            res.status(200).json({
                message: 'Incidencias recuperadas exitosamente',
                incidents
            });
        } 
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Get Incidence by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const incidence = await Incidence.findById(id);

            res.status(200).json({
                message: 'Incidencia recuperada exitosamente',
                incidence
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? POST Methods

    //? Create a new Incidence
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const incidence: IIncidence = await Incidence.create(body);

            res.status(201).json({
                message: 'Incidencia registrada exitosamente',
                incidence
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? PUT Methods

    //? Update Incidence by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const incidence: IIncidence = await Incidence.update(id, body);

            res.status(200).json({
                message: 'Incidencia actualizada exitosamente',
                incidence
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? DELETE Methods

    //? Delete Incidence by Id
    public static delete = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;

            const incidence: IIncidence = await Incidence.delete(id);

            res.status(200).json({
                message: 'Incidencia eliminada exitosamente',
                incidence
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };
}


export default IncidentController;