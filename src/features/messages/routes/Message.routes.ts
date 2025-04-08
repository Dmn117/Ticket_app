import passport from "passport";
import { Router } from "express";

import MessageController from "../controllers/Message.Controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import { createMessageSchema, getMessageSchema, getMessagesSchema, updateMessageSchema } from "../validators/Message.validators";
import { checkRoles } from "../../../shared/middlewares/auth.handler";


const MessageRoutes: Router = Router();

//? GET
MessageRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getMessagesSchema, RequestProperties.query),
    MessageController.getAll
);

MessageRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getMessageSchema, RequestProperties.params),
    MessageController.getById
);

//? POST
MessageRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createMessageSchema, RequestProperties.body),
    MessageController.create
);

//? PUT
MessageRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getMessageSchema, RequestProperties.params),
    validatorHandler(updateMessageSchema, RequestProperties.body),
    MessageController.update
);

//? DELETE
MessageRoutes.put(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getMessageSchema, RequestProperties.params),
    MessageController.delete
);


export default MessageRoutes;