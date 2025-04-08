import Joi, { Schema } from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId();

const name = Joi.string().min(3);
const enabled = Joi.boolean();
const director = ExtendedJoi.objectId();


export const createOrganizationSchema: Schema = Joi.object({
    name: name.required(),
    director
});


export const updateOrganizationSchema: Schema = Joi.object({
    name,
    director,
});


export const getOrganizationsSchema: Schema = Joi.object({
    name,
    enabled,
    director
});


export const getOrganizationSchema: Schema = Joi.object({
    id: id.required()
});