import passport from "passport";
import { Router } from "express";

import OrganizationController from "../controllers/Organization.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { checkRoles } from "../../../shared/middlewares/auth.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import { createOrganizationSchema, getOrganizationSchema, getOrganizationsSchema, updateOrganizationSchema } from "../validators/Organization.validators";


const OrganizationRoutes: Router = Router();

//? GET
OrganizationRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getOrganizationsSchema, RequestProperties.query),
    OrganizationController.getAll
);

OrganizationRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getOrganizationSchema, RequestProperties.params),
    OrganizationController.getById
);


//? POST
OrganizationRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR),
    validatorHandler(createOrganizationSchema, RequestProperties.body),
    OrganizationController.create
);

//? PUT
OrganizationRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR),
    validatorHandler(getOrganizationSchema, RequestProperties.params),
    validatorHandler(updateOrganizationSchema, RequestProperties.body),
    OrganizationController.update
);

//? PATCH
OrganizationRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getOrganizationSchema, RequestProperties.params),
    OrganizationController.enable
);

OrganizationRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getOrganizationSchema, RequestProperties.params),
    OrganizationController.disable
);

export default OrganizationRoutes;