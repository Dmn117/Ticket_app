import { Router } from "express";
import passport from "passport";

import TicketController from "../controllers/Ticket.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { checkRoles } from "../../../shared/middlewares/auth.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import { createTicketSchema, getTicketSchema, getTicketsSchema, addItemSchema, updateTicketSchema, removeItemSchema, rateTicketSchema } from "../validators/Ticket.validators";



const TicketRoutes: Router = Router();

//? GET
TicketRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getTicketsSchema, RequestProperties.query),
    TicketController.getAll
);

TicketRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getTicketSchema, RequestProperties.params),
    TicketController.getById
);

//? POST
TicketRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createTicketSchema, RequestProperties.body),
    TicketController.create
);

//? PUT
TicketRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getTicketSchema, RequestProperties.params),
    validatorHandler(updateTicketSchema, RequestProperties.body),
    TicketController.update
);

//? PATCH
TicketRoutes.patch(
    '/add/item/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getTicketSchema, RequestProperties.params),
    validatorHandler(addItemSchema, RequestProperties.body),
    TicketController.addItem
);

TicketRoutes.patch(
    '/remove/item/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getTicketSchema, RequestProperties.params),
    validatorHandler(removeItemSchema, RequestProperties.body),
    TicketController.removeItem
);

TicketRoutes.patch(
    '/rate/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getTicketSchema, RequestProperties.params),
    validatorHandler(rateTicketSchema, RequestProperties.body),
    TicketController.rate
);


//? DELETE
TicketRoutes.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getTicketSchema, RequestProperties.params),
    TicketController.delete
);


export default TicketRoutes;