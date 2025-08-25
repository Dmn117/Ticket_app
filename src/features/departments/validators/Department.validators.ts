import Joi, { Schema } from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId();
const name = Joi.string().min(2);
const enabled = Joi.boolean();
const organization = ExtendedJoi.objectId();
const owner = ExtendedJoi.objectId();
const populateOrganization = Joi.boolean();


export const createDepartmentSchema: Schema = Joi.object({
    name: name.required(),
    organization: organization.required(),
    owner: owner.required()
});


export const updateDepartmentSchema: Schema = Joi.object({
    name,
    organization,
    owner
});


export const getDepartmentsSchema: Schema = Joi.object({
    name,
    enabled,
    organization,
    owner,
    populateOrganization
});


export const getDepartmentSchema: Schema = Joi.object({
    id: id.required()
});