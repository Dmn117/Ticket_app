import passport from "passport";
import { Router } from "express";

import ClassifierController from "../controllers/Classifier.controller";
import validatorHandler from "../../../shared/middlewares/validator.handler";

import { trainScheme } from "../validators/Classifier.validators";
import { checkRoles } from "../../../shared/middlewares/auth.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";




const ClassifierRoutes: Router = Router();


//? PATCH
ClassifierRoutes.patch(
    '/train',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(trainScheme, RequestProperties.body),
    ClassifierController.train
);

ClassifierRoutes.patch(
    '/train/automatic',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    ClassifierController.automaticTraining
);



export default ClassifierRoutes;