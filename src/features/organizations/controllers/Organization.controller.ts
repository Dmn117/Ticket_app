import { Request, Response } from "express";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import CustomError from "../../../shared/interfaces/CustomError";
import IOrganization from "../interfaces/Organization.interfaces";
import Organization from "../models/Organization.model";
import OrganizationQueryParams from "../interfaces/OrganizationQueryParams";



class OrganizationController {
    //! Private

    //? Assemble Query Parameters
    private static assembleQueryParameters = (req: Request): Partial<OrganizationQueryParams> => {
        const params: Partial<OrganizationQueryParams> = {};

        if (req.query.name) params.name = { $regex: req.query.name.toString(), $options: 'i' };

        if (req.query.enabled) params.enabled = req.query.enabled.toString() === 'true';

        if (req.query.director) params.director = req.query.director.toString();

        return params;
    };

    //! Public 


    //! GET Methods

    //? Get All Organizations or some by query paramters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params = this.assembleQueryParameters(req);

            const organizations: IOrganization[] = await Organization.find(params);

            res.status(200).json({
                message: 'Organizaciones recuperadas exitosamente',
                organizations
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Get Organization by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const organization: IOrganization = await Organization.findById(id);

            res.status(200).json({
                message: 'Organización recuperada exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! POST Methods

    //? Create new Organization
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const organization = await Organization.create(body);
            
            res.status(201).json({
                message: 'Organización registrada exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //! PUT Methods

    //? Update Organization by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const organization = await Organization.update(id, body);
            
            res.status(200).json({
                message: 'Organización actualizada exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //! PATCH Methods

    //? Enable Organization by Id
    public static enable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const organization = await Organization.enableDisable(id, true);
            
            res.status(200).json({
                message: 'Organización habilitada exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Disable Organization by Id
    public static disable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const organization = await Organization.enableDisable(id, false);
            
            res.status(200).json({
                message: 'Organización deshabilitada exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

}



export default OrganizationController;