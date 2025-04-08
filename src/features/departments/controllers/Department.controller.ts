import { QueryOptions } from "mongoose";
import { Request, Response } from "express";

import Department from "../models/Department.model";
import IDepartment from "../interfaces/Department.interfaces";
import CustomError from "../../../shared/interfaces/CustomError";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import DepartmentQueryParams from "../interfaces/DepartmentQueryParams";



class DepartmentController {
    //! Private

    //? Assemble Query Parameters
    private static assembleQueryParams = (req: Request): Partial<DepartmentQueryParams> => {
        const params: Partial<DepartmentQueryParams> = {};

        if (req.query.name) params.name = { $regex: req.query.name.toString(), $options: 'i' };

        if (req.query.enabled) params.enabled = req.query.enabled.toString() === 'true';

        if (req.query.organization) params.organization = req.query.organization.toString();

        if (req.query.owner) params.owner = req.query.owner.toString();
        
        return params;
    };


    //? Assemble Query Options
    private static assembleQueryOptions = (req: Request): Partial<QueryOptions> => {
        const options: QueryOptions = {};

        if (req.query.populateOrganization === 'true') options.populate = [{ path: 'organization', select: '_id name' }];

        return options;
    };

    //! Public 

    //! GET Methods

    //? Get All Departments or some by Query Parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: Partial<DepartmentQueryParams> = this.assembleQueryParams(req);
            const options: Partial<QueryOptions> = this.assembleQueryOptions(req);
            const departments: IDepartment[] = await Department.find(params, options);

            res.status(200).json({
                message: 'Departamentos recuperados exitosamente',
                departments
            });
        }
        catch (error) {
            next(error as CustomError)
        }
    };


    //? Get Department by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const department: IDepartment = await Department.findById(id);

            res.status(200).json({
                message: 'Departamento recuperado exitosamente',
                department
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! POST Methods

    //? Create a new Department
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const department: IDepartment = await Department.create(body);

            res.status(201).json({
                message: 'Departamento registrado exitosamente',
                department
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! PUT Methods

    //? Update Department by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const department: IDepartment = await Department.update(id, body);

            res.status(200).json({
                message: 'Departamento actualizado exitosamente',
                department
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! PATCH Methods

    //? Enable Department by Id
    public static enable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const department = await Department.enableDisable(id, true);
            
            res.status(200).json({
                message: 'Departamento habilitado exitosamente',
                department
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Disable Department by Id
    public static disable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const department = await Department.enableDisable(id, false);
            
            res.status(200).json({
                message: 'Departamento deshabilitado exitosamente',
                department
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };
}

export default DepartmentController;