import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { IPermissionGroup } from "../interfaces/PermissionGroup.interfaces";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import CustomError from "../../../shared/interfaces/CustomError";
import PermissionGroup from "../models/PermissionGroup";




class PermissionGroupController {
    //! Private

    private static assembleQueryParamaters = (req: Request): FilterQuery<IPermissionGroup> => {
        const params: FilterQuery<IPermissionGroup> = {};



        return params;
    };

    //! Public


    //* GET Methods

    //? Get all or some permission groups by Query Parameters 
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params = this.assembleQueryParamaters(req);
            const permissionGroups = await PermissionGroup.find(params);

            res.status(200).json({
                message: 'Grupos de permisos recuperados exitosamente',
                permissionGroups
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Get Permission Group by Id
    public static getbyId = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const permissionGroup = await PermissionGroup.findById(id);

            res.status(200).json({
                message: 'Grupo de permisos recuperado exitosamente',
                permissionGroup
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //* POST Methods

    //? Create a new Permission Group
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const permissionGroup = await PermissionGroup.create(body);

            res.status(201).json({
                message: 'Grupos de permisos registrado exitosamente',
                permissionGroup
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //* PUT Methods

    //? Update Permission Group by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const permissionGroup = await PermissionGroup.update(id, body);

            res.status(200).json({
                message: 'Grupos de permisos actualizado exitosamente',
                permissionGroup
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //* PATCH Methods

    //? Enabled Permission Group by Id
    public static enable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;

            const permissionGroup = await PermissionGroup.update(id, { enabled: true });

            res.status(200).json({
                message: 'Grupos de permisos habilitado exitosamente',
                permissionGroup
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Disabled Permission Group by Id
    public static disable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;

            const permissionGroup = await PermissionGroup.update(id, { enabled: false });

            res.status(200).json({
                message: 'Grupos de permisos deshabilitado exitosamente',
                permissionGroup
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

}


export default PermissionGroupController;