import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId();


export const getTransfersSchema = Joi.object({
    ticket: id
});


export const getTransferSchema = Joi.object({
    id: id
});


export const createTransferSchema = Joi.object({
    nextDepartment: id,
    nextAssigned: id,
    nextHelpTopic: id,
    preDepartment: id,
    preAssigned: id,
    preHelpTopic: id,
    ticket: id.required(),
});


export const updateTransferSchema = Joi.object({
    nextDepartment: id,
    nextAssigned: id,
    nextHelpTopic: id,
    preDepartment: id,
    preAssigned: id,
    preHelpTopic: id,
    ticket: id,
});