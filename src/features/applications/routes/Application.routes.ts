//! CLI by https://github.com/Dmn117

import { Router } from "express";
import passport from "passport";
import { checkRoles } from "../../../shared/middlewares/auth.handler";
import validatorHandler from "../../../shared/middlewares/validator.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import { getAppByQuerySchema, getAppByIdSchema, createAppSchema } from "../validators/Application.validators";
import ApplicationController from "../controllers/Application.controller";



const ApplicationRoutes: Router = Router();

//* GET
ApplicationRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getAppByIdSchema, RequestProperties.params),
    ApplicationController.getById
);

ApplicationRoutes.get(
    '/get/one',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getAppByQuerySchema, RequestProperties.query),
    ApplicationController.getByQueryParams
);

//* POST
ApplicationRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(createAppSchema, RequestProperties.body),
    ApplicationController.create
);

//* PATCH
ApplicationRoutes.patch(
    '/enable-disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getAppByIdSchema, RequestProperties.params),
    ApplicationController.enableDisable
);

//* DELETE

ApplicationRoutes.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getAppByIdSchema, RequestProperties.params),
    ApplicationController.delete
);



export default ApplicationRoutes;