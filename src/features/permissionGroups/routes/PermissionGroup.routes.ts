import passport from "passport";
import { Router } from "express";

import validatorHandler from "../../../shared/middlewares/validator.handler";
import PermissionGroupController from "../controllers/PermissionGroup.controller";

import { checkPermission } from "../../../shared/middlewares/auth.handler";
import { Permissions, RequestProperties, Segments } from "../../../shared/config/enumerates";
import { createPermissionGroupSchema, getPermissionGroupSchema, getPermissionGroupsSchema, updatePermissionGroupSchema } from "../validators/PermissionGroup.validators";


const PermissionGroupRoutes: Router = Router();

//* GET
PermissionGroupRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.PERMISSION_GROUPS, Permissions.FIND),
    validatorHandler(getPermissionGroupsSchema, RequestProperties.query),
    PermissionGroupController.getAll
);

PermissionGroupRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.PERMISSION_GROUPS, Permissions.FIND),
    validatorHandler(getPermissionGroupSchema, RequestProperties.params),
    PermissionGroupController.getbyId
);

//* POST
PermissionGroupRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.PERMISSION_GROUPS, Permissions.CREATE),
    validatorHandler(createPermissionGroupSchema, RequestProperties.body),
    PermissionGroupController.create
);

//* PUT
PermissionGroupRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.PERMISSION_GROUPS, Permissions.UPDATE),
    validatorHandler(getPermissionGroupSchema, RequestProperties.params),
    validatorHandler(updatePermissionGroupSchema, RequestProperties.body),
    PermissionGroupController.update
);

//* PATCH
PermissionGroupRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.PERMISSION_GROUPS, Permissions.ENABLE),
    validatorHandler(getPermissionGroupSchema, RequestProperties.params),
    PermissionGroupController.enable
);

PermissionGroupRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.PERMISSION_GROUPS, Permissions.DISABLE),
    validatorHandler(getPermissionGroupSchema, RequestProperties.params),
    PermissionGroupController.disable
);


export default PermissionGroupRoutes;