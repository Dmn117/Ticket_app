import { Router } from "express";
import passport from "passport";

import DepartmentController from "../controllers/Department.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { checkRoles } from "../../../shared/middlewares/auth.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import { createDepartmentSchema, getDepartmentSchema, getDepartmentsSchema, updateDepartmentSchema } from "../validators/Department.validators";



const DepartmentRoutes: Router = Router();

//? GET
DepartmentRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getDepartmentsSchema, RequestProperties.query),
    DepartmentController.getAll
);

DepartmentRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getDepartmentSchema, RequestProperties.params),
    DepartmentController.getById
);


//? POST
DepartmentRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR, Roles.BOSS),
    validatorHandler(createDepartmentSchema, RequestProperties.body),
    DepartmentController.create
);

//? PUT
DepartmentRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR, Roles.BOSS),
    validatorHandler(getDepartmentSchema, RequestProperties.params),
    validatorHandler(updateDepartmentSchema, RequestProperties.body),
    DepartmentController.update
);

//? PATCH
DepartmentRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getDepartmentSchema, RequestProperties.params),
    DepartmentController.enable
);

DepartmentRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getDepartmentSchema, RequestProperties.params),
    DepartmentController.disable
);

export default DepartmentRoutes;