import { Router } from "express";
import passport from "passport";
import validatorHandler from "../../../shared/middlewares/validator.handler";
import { createHelpTopicSchema, getHelpTopicSchema, getHelpTopicsSchema, updateHelpTopicSchema } from "../validators/HelpTopic.validators";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import HelpTopicController from "../controllers/HelpTopic.controller";
import { checkRoles } from "../../../shared/middlewares/auth.handler";



const HelpTopicRoutes: Router = Router();


//? GET
HelpTopicRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getHelpTopicsSchema, RequestProperties.query),
    HelpTopicController.getAll
);

HelpTopicRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getHelpTopicSchema, RequestProperties.params),
    HelpTopicController.getById
);

//? POST
HelpTopicRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR, Roles.BOSS, Roles.AGENT),
    validatorHandler(createHelpTopicSchema, RequestProperties.body),
    HelpTopicController.create
);

//? PUT
HelpTopicRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR, Roles.BOSS, Roles.AGENT),
    validatorHandler(getHelpTopicSchema, RequestProperties.params),
    validatorHandler(updateHelpTopicSchema, RequestProperties.body),
    HelpTopicController.update
);

//? PATCH
HelpTopicRoutes.patch(
    '/enable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR, Roles.BOSS),
    validatorHandler(getHelpTopicSchema, RequestProperties.params),
    HelpTopicController.enable
);

HelpTopicRoutes.patch(
    '/disable/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN, Roles.DIRECTOR, Roles.BOSS),
    validatorHandler(getHelpTopicSchema, RequestProperties.params),
    HelpTopicController.disable
);

export default HelpTopicRoutes;