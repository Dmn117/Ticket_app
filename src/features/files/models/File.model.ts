import path from 'path';
import boom from '@hapi/boom';
import mongoose, { FilterQuery } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

import User from '../../users/models/User.model';
import FileSchema from '../schemas/File.schema';

import IFile, { FileEntry } from '../interfaces/File.interfaces';
import { FILE_NOT_FOUND } from '../../../shared/config/constants';
import { deleteFilesWithSameBaseName } from '../../../shared/utils/lib/FileSystem';



class File {
    //! Private

    //? Validate Data
    private static validations = async (data: FilterQuery<IFile>): Promise<void> => {
        const validations: Promise<any>[] = [];

        if (data.owner) {
            validations.push(User.findById(data.owner, false));
        }

        await Promise.all(validations);
    };


    //! Public 

    //? Find File Records by Query Parameters
    public static find = async (params: FilterQuery<IFile>, admin: boolean = false): Promise<IFile[]> => {
        if (!admin) params.enabled = true;

        const files: IFile[] = await FileSchema.find(params);

        if (files.length === 0) throw boom.notFound('Archivos no encontrados');

        return files;
    };


    //? Find File Record by ID
    public static findById = async (id: string, admin: boolean = false): Promise<IFile> => {
        let file: IFile | null = await FileSchema.findById(id);

        if (!admin) file = file?.enabled ? file : null;

        if (!file) throw boom.notFound('Archivo no encontrado');

        return file;
    };


    //? Find File by ID
    public static findFileById = async (id: string, admin: boolean = false, onlyPublic?: boolean): Promise<{ filePath: string, success: boolean }> => {
        let file: IFile | null = onlyPublic 
            ? await FileSchema.findById(id, null,  { public: true }) 
            : await FileSchema.findById(id);

        if (!admin) file = file?.enabled ? file : null;

        if (!file || !file.path) {
            return { 
                filePath: path.resolve(FILE_NOT_FOUND), 
                success: false 
            }
        }

        return {
            filePath: path.join(__dirname, '../../../..', file.path),
            success: true
        };
    };


    //? Validate if File exists
    public static exists = async (field: string, value: string): Promise<mongoose.Types.ObjectId> => {
        const file = await FileSchema.exists({ [field]: value });

        if (!file) throw boom.notFound('Archivo no encontrado');

        return file._id;
    };


    //? Create a new File Record
    public static create = async (data: Partial<FileEntry>): Promise<IFile> => {
        await this.validations(data);

        const file: IFile = await FileSchema.create(data);
        return file;
    };


    //? Update File Record by Id
    public static update = async (id: string, data: Partial<FileEntry>): Promise<IFile> => {
        const file: IFile | null = await FileSchema.findByIdAndUpdate(id, data, { new: true });

        if (!file) throw boom.notFound('Archivo no encontrado');

        return file;
    };


    //? Enabled / Disabled File Record by Id
    public static enableDisable = async (
        id: string, 
        enabled: boolean, 
        user: JwtPayload | undefined
    ): Promise<IFile> => {
        if (!user) 
            throw boom.badRequest('Payload incompleto o mal estructurado: Recupearando User');
        
        const file: IFile | null = await this.findById(id, true);

        if (!enabled && file.owner.toHexString() !== user.sub)
            throw boom.unauthorized('El contenido que deseas eliminar no te pertence');

        file.enabled = enabled;

        await file.save();

        return file;
    };


    //? Delete File by ID
    public static delete = async (id: string): Promise<IFile> => {
        const file: IFile = await File.findById(id, true);

        const filename: string = path.basename(file.path);
        const dirname: string = path.dirname(file.path);
        await deleteFilesWithSameBaseName(dirname, filename);

        const fileDeleted: IFile | null = await FileSchema.findByIdAndDelete(id, { new: true });

        if (!fileDeleted) throw boom.notFound('Archivo no encontrado');

        return fileDeleted;
    };
}

export default File;