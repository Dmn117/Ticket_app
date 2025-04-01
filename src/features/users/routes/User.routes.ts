import passport from "passport";
import { Router } from "express";

import UserController from "../controllers/User.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { Permissions, RequestProperties, Segments } from "../../../shared/config/enumerates";
import { checkPermission } from "../../../shared/middlewares/auth.handler";
import { createUserSchema, getUserSchema, getUsersSchema, loginUserSchema, getUserByEmailSchema, updateUserSchema, validateUserSchema, recoverPassworSchema, createUsersArraySchema } from "../validators/User.validators";


const UserRoutes: Router = Router();

//? GET 
UserRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.USERS, Permissions.FIND),
    validatorHandler(getUsersSchema, RequestProperties.query),
    UserController.getUsers
);

UserRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.USERS, Permissions.FIND),
    validatorHandler(getUserSchema, RequestProperties.params),
    UserController.getUserById
);

//? POST
UserRoutes.post(
    '/login',
    validatorHandler(loginUserSchema, RequestProperties.body),
    passport.authenticate('local', { session: false }),
    UserController.login
);

UserRoutes.post(
    '/create',
    // passport.authenticate('jwt', { session: false }),
    // checkPermission(Segments.USERS, Permissions.CREATE),
    validatorHandler(createUserSchema, RequestProperties.body),
    UserController.create
);

UserRoutes.post(
    '/create-in-bulk',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.USERS, Permissions.CREATE),
    validatorHandler(createUsersArraySchema, RequestProperties.body),
    UserController.createInBulk
);

UserRoutes.post(
    '/send/verification-code/:email',
    // passport.authenticate('jwt', { session: false }),
    validatorHandler(getUserByEmailSchema, RequestProperties.params),
    UserController.sendVerificationCode
);

UserRoutes.post(
    '/validate/verification-code/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getUserSchema, RequestProperties.params),
    validatorHandler(validateUserSchema, RequestProperties.body),
    UserController.validateVerificationCode
);

//? PUT
UserRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.USERS, Permissions.UPDATE),
    validatorHandler(getUserSchema, RequestProperties.params),
    validatorHandler(updateUserSchema, RequestProperties.body),
    UserController.update
);


//? PATCH
UserRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.USERS, Permissions.DISABLE),
    validatorHandler(getUserSchema, RequestProperties.params),
    UserController.disbled
);

UserRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkPermission(Segments.USERS, Permissions.ENABLE),
    validatorHandler(getUserSchema, RequestProperties.params),
    UserController.enabled
);

UserRoutes.patch(
    '/validate/user/:email',
    // passport.authenticate('jwt', { session: false }),
    validatorHandler(getUserByEmailSchema, RequestProperties.params),
    validatorHandler(validateUserSchema, RequestProperties.body),
    UserController.validateUser
);


UserRoutes.patch(
    '/recover/password/:email',
    // passport.authenticate('jwt', { session: false }),
    validatorHandler(getUserByEmailSchema, RequestProperties.params),
    validatorHandler(recoverPassworSchema, RequestProperties.body),
    UserController.recoverPassword
);

export default UserRoutes;