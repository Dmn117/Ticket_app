import { Router } from "express";
import passport from "passport";
import { checkRoles } from "../../../shared/middlewares/auth.handler";
import { RequestProperties, Roles } from "../../../shared/config/enumerates";
import validatorHandler from "../../../shared/middlewares/validator.handler";
import { createTransferSchema, getTransferSchema, getTransfersSchema, updateTransferSchema } from "../validators/Transfer.validators";
import TransferController from "../controllers/Transfer.controller";




const TransferRoutes: Router = Router();

//? GET
TransferRoutes.get(
    '/get/all',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getTransfersSchema, RequestProperties.query),
    TransferController.getAll
);

TransferRoutes.get(
    '/get/id/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getTransferSchema, RequestProperties.params),
    TransferController.getById
);

//? POST
TransferRoutes.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(createTransferSchema, RequestProperties.body),
    TransferController.create
);


//? PUT
TransferRoutes.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getTransferSchema, RequestProperties.params),
    validatorHandler(updateTransferSchema, RequestProperties.body),
    TransferController.update
);


//? DELETE
TransferRoutes.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRoles(Roles.ADMIN),
    validatorHandler(getTransferSchema, RequestProperties.params),
    TransferController.delete
);

export default TransferRoutes;