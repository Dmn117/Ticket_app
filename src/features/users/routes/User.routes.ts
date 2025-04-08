import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/User.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";
import { createUserSchema, getUserSchema, getUsersSchema, loginUserSchema, getUserByEmailSchema, updateUserSchema, validateUserSchema, recoverPassworSchema, createUsersArraySchema } from "../validators/User.validators";
import { RequestProperties, Roles, SpecialPermissions } from "../../../shared/config/enumerates";
import { checkRoles, checkRolesAndPermissions } from "../../../shared/middlewares/auth.handler";


const UserRoutes: Router = Router();

//? GET 
UserRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getUsersSchema, RequestProperties.query),
    UserController.getUsers
);

UserRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
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
    // checkRolesAndPermissions([Roles.ADMIN], [SpecialPermissions.createUser]),
    validatorHandler(createUserSchema, RequestProperties.body),
    UserController.create
);

UserRoutes.post(
    '/create-in-bulk',
    passport.authenticate('jwt', { session: false }),
    checkRolesAndPermissions([Roles.ADMIN], [SpecialPermissions.createUser]),
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
    checkRolesAndPermissions([Roles.ADMIN], [SpecialPermissions.updateUser]),
    validatorHandler(getUserSchema, RequestProperties.params),
    validatorHandler(updateUserSchema, RequestProperties.body),
    UserController.update
);


//? PATCH
UserRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRolesAndPermissions([Roles.ADMIN], [SpecialPermissions.disableUser]),
    validatorHandler(getUserSchema, RequestProperties.params),
    UserController.disbled
);

UserRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRolesAndPermissions([Roles.ADMIN], [SpecialPermissions.enableUser]),
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


UserRoutes.patch(
    '/average/recalculate/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getUserSchema, RequestProperties.params),
    UserController.recalculateAverageById
);


export default UserRoutes;