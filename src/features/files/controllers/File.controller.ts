import boom from '@hapi/boom';
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";

import File from "../models/File.model";
import IFile from "../interfaces/File.interfaces";
import FileQueryParams from '../interfaces/FileQueryParams';
import CustomError from "../../../shared/interfaces/CustomError";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";

import { Roles } from '../../../shared/config/enumerates';

class FileController {

    //! Private 

    private static assembleQueryParams = (req: Request): Partial<FileQueryParams> => {
        const params: Partial<FileQueryParams> = {};

        if (req.query.owner) params.owner = req.query.owner.toString();

        if (req.query.enabled) params.enabled = req.query.enabled.toString() === 'true';

        return params;
    };


    //! Public

    //! GET Methods

    //? Get All Files or some by Query Parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: Partial<FileQueryParams> = this.assembleQueryParams(req);
            const files: IFile[] = await File.find(params);

            res.status(200).json({
                message: 'Archivos recuperados exitosamente',
                files
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    } 

    //? Get File Record by ID
    public static getByID = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const user: JwtPayload | undefined = req.user;

            const file: IFile = await File.findById(id, user?.role === Roles.ADMIN || false);

            res.status(200).json({
                message: 'Archivo recuperado exitosamente',
                file
            });
        } catch (error) {
            next(error as CustomError);
        }
    };

    //? Get File by ID
    public static getFileByID = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const user: JwtPayload | undefined = req.user;

            const { filePath, success } = await File.findFileById(id, user?.role === Roles.ADMIN || false);

            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.status(success ? 200 : 404).sendFile(filePath);
        } catch (error) {
            next(error as CustomError);
        }
    };

    //! POST Methods

    //? Create and Upload a new File Record
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { file } = req;
            
            if (!file) throw boom.internal('Error cargando el archivo, no se recupero el id');

            const id: string = file.filename.split('.')[0];
            const data = { path: file.path };

            const fileRecord: IFile = await File.update(id, data);

            res.status(201).json({
                message: 'Archivo registrado exitosamente',
                file: fileRecord
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! PUT Methods

    //? Update File by ID
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const { file } = req;
            const data = { path: file?.path };

            const updatedFile: IFile = await File.update(id, data);

            res.status(200).json({
                message: 'Archivo actualizado exitosamente',
                file: updatedFile
            });
        } catch (error) {
            next(error as CustomError);
        }
    };

    //! PATCH Methods

    //? Enable File by Id
    public static enable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const user: JwtPayload | undefined = req.user;

            const organization = await File.enableDisable(id, true, user);
            
            res.status(200).json({
                message: 'Archivo recuperado exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Disable File by Id
    public static disable = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const user: JwtPayload | undefined = req.user;

            const organization = await File.enableDisable(id, false, user);
            
            res.status(200).json({
                message: 'Archivo eliminado exitosamente',
                organization
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };



    //! DELETE Methods

    //? Enable File by ID
    public static delete = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;

            const file: IFile = await File.delete(id);

            res.status(200).json({
                message: 'Archivo eliminado exitosamente',
                file
            });
        } catch (error) {
            next(error as CustomError);
        }
    };
}

export default FileController;