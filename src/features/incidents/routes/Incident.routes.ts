import passport from "passport";
import { Router } from "express";

import IncidentController from "../controllers/Incident.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { checkRoles } from "../../../shared/middlewares/auth.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import { createIncidenceSchema, getIncidenceSchema, getIncidentsSchema, updateIncidenceSchema } from "../validators/Incident.validators";



const IncidentRoutes: Router = Router();

//? GET
IncidentRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getIncidentsSchema, RequestProperties.query),
    IncidentController.getAll
);

IncidentRoutes.get(
    '/get/boss/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getIncidenceSchema, RequestProperties.params),
    IncidentController.getByBossId
);

IncidentRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getIncidenceSchema, RequestProperties.params),
    IncidentController.getById
);


//? POST
IncidentRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createIncidenceSchema, RequestProperties.body),
    IncidentController.create
);


//? PUT
IncidentRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getIncidenceSchema, RequestProperties.params),
    validatorHandler(updateIncidenceSchema, RequestProperties.body),
    IncidentController.update
);


//? DELETE
IncidentRoutes.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getIncidenceSchema, RequestProperties.params),
    IncidentController.delete
);


export default IncidentRoutes;