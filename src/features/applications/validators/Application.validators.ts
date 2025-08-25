//! CLI by https://github.com/Dmn117

import Joi, { Schema } from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId();
const owner = ExtendedJoi.objectId();

const name = Joi.string();
const enabled = Joi.boolean();


export const getAppByIdSchema: Schema = Joi.object({
    id: id.required()
});


export const getAppByQuerySchema: Schema = Joi.object({
    name,
    enabled,
    owner
});


export const createAppSchema: Schema = Joi.object({
    name: name.required(),
    owner: owner.required()
});