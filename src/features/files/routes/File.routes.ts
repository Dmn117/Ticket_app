import passport from 'passport';
import { Router } from 'express';

import FileController from '../controllers/File.controller';
import validatorHandler from '../../../shared/middlewares/validator.handler';

import { checkRoles } from '../../../shared/middlewares/auth.handler';
import { RequestProperties, Roles } from '../../../shared/config/enumerates';
import { fileCreateHandler, fileUpdateHandler } from '../../../shared/middlewares/file.handler';
import { createFileSchema, getFileSchema, getFilesSchema, updateFileSchema } from '../validators/File.validators';


const FileRoutes: Router = Router();

//? GET
FileRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getFilesSchema, RequestProperties.query),
    FileController.getAll
);

FileRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.getByID
);

FileRoutes.get(
    '/get/public/file/:id',
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.getFileByID
);

FileRoutes.get(
    '/get/file/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.getFileByID
);

//? POST

FileRoutes.post(
    '/create/:owner/:foldername',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createFileSchema, RequestProperties.params),
    fileCreateHandler.single('file'),
    FileController.create
);

//? PUT
FileRoutes.put(
    '/update/:id/:foldername',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(updateFileSchema, RequestProperties.params),
    fileUpdateHandler.single('file'),
    FileController.update
);

//? PATCH 
FileRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.enable
);

FileRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.disable
);

//? DELETE
FileRoutes.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.delete
);

export default FileRoutes;
