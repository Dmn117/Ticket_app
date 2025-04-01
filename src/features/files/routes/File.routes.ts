import passport from 'passport';
import { Router } from 'express';

import FileController from '../controllers/File.controller';
import validatorHandler from '../../../shared/middlewares/validator.handler';

import { Permissions, RequestProperties, Segments } from '../../../shared/config/enumerates';
import { fileCreateHandler, fileUpdateHandler } from '../../../shared/middlewares/file.handler';
import { createFileSchema, getFileSchema, getFilesSchema, updateFileSchema } from '../validators/File.validators';
import { checkPermission } from '../../../shared/middlewares/auth.handler';


const FileRoutes: Router = Router();

//? GET
FileRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.FIND),
    validatorHandler(getFilesSchema, RequestProperties.query),
    FileController.getAll
);

FileRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.FIND),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.getByID
);

FileRoutes.get(
    '/get/public/file/:id',
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.getPublicFileByID
);

FileRoutes.get(
    '/get/file/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.FIND),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.getFileByID
);

//? POST

FileRoutes.post(
    '/create/:owner/:foldername',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.CREATE),
    validatorHandler(createFileSchema, RequestProperties.params),
    fileCreateHandler.single('file'),
    FileController.create
);

//? PUT
FileRoutes.put(
    '/update/:id/:foldername',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.UPDATE),
    validatorHandler(updateFileSchema, RequestProperties.params),
    fileUpdateHandler.single('file'),
    FileController.update
);

//? PATCH 
FileRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.ENABLE),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.enable
);

FileRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.DISABLE),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.disable
);

//? DELETE
FileRoutes.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.FILES, Permissions.DELETE),
    validatorHandler(getFileSchema, RequestProperties.params),
    FileController.delete
);

export default FileRoutes;
