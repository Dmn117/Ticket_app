import multer from 'multer';

import File from '../../features/files/models/File.model';
import IFile from '../../features/files/interfaces/File.interfaces';

import { UPLOADS } from '../config/constants';
import { createFolder } from '../utils/lib/FileSystem';
import { Request } from 'express';
import { FileTypes, MimeTypes } from '../config/enumerates';

const dest: string = UPLOADS;



const prepareFolder = (section: string): string => {
    createFolder(dest);
    const folder: string = `${dest}/${section}`;
    createFolder(folder);
    return folder;
};


const getExceptcionalType = (type: string): string => {
    switch (type) {
        case MimeTypes.WORD:
            return FileTypes.WORD;
        case MimeTypes.EXCEL:
            return FileTypes.EXCEL;
        default:
            return type;
    }
};


const destination = (req: Request, file: Express.Multer.File, cb: Function): void => {
    try {
        const foldername = req.params.foldername || 'defaultFolder'; 
        const folder: string = prepareFolder(foldername);

        cb(null, folder);
    }
    catch (error) {
        cb(error, null);
    }
};


const filename = async (req: Request, file: Express.Multer.File, cb: Function): Promise<void> => {
    try {
        const owner: string = req.params.owner;
        const type: string = getExceptcionalType(file.mimetype.split('/')[1]);
        
        const fileRecord: IFile = await File.create({ 
            owner, 
            originalName: file.originalname
        });
        
        cb(null, `${fileRecord._id.toString()}.${type}`);
    }
    catch (error){
        cb(error, null)
    }
};


const filenameWithouId = async (req: Request, file: Express.Multer.File, cb: Function): Promise<void> => {
    try {
        const type: string = getExceptcionalType(file.mimetype.split('/')[1]);
        cb(null, `${req.params.id}.${type}`);
    }
    catch (error){
        cb(error, null)
    }
};


const fileStorage = multer.diskStorage({
    destination,
    filename
});


const fileUpdate = multer.diskStorage({
    destination,
    filename: filenameWithouId
});


export const fileCreateHandler = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});


export const fileUpdateHandler = multer({
    storage: fileUpdate,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});