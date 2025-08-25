import passport from "passport";
import { Router } from "express";

import EvaluationController from "../controllers/Evaluation.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { checkRoles } from "../../../shared/middlewares/auth.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import { createEvaluationSchema, getEvaluationSchema, getEvaluationsSchema, massCreationOfEvaluationsSchema, updateEvaluationSchema } from "../validators/Evaluation.validators";



const EvaluationRoutes: Router = Router();

//? GET
EvaluationRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getEvaluationsSchema, RequestProperties.query),
    EvaluationController.getAll
);

EvaluationRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getEvaluationSchema, RequestProperties.params),
    EvaluationController.getById
);

EvaluationRoutes.get(
    '/get/boss/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getEvaluationSchema, RequestProperties.params),
    EvaluationController.getByBossId
);

//? POST
EvaluationRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createEvaluationSchema, RequestProperties.body),
    EvaluationController.create
);

EvaluationRoutes.post(
    '/create/in-bulk',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(massCreationOfEvaluationsSchema, RequestProperties.body),
    EvaluationController.createMonthlyEvaluations
);


//? PUT
EvaluationRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getEvaluationSchema, RequestProperties.params),
    validatorHandler(updateEvaluationSchema, RequestProperties.body),
    EvaluationController.update
);


//? DELETE
EvaluationRoutes.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getEvaluationSchema, RequestProperties.params),
    EvaluationController.delete
);


export default EvaluationRoutes;