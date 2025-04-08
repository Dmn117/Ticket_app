import Joi, { array } from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId();
const name = Joi.string().min(5).max(100);

const includesTags = Joi.boolean();
const tags = Joi.array().items(Joi.string().min(3).max(20));
const expIn = Joi.number().min(1);

const enabled = Joi.boolean();

const includesDepartments = Joi.boolean();
const departmentsQuery = Joi.string();


export const getHelpTopicsSchema = Joi.object({
    name,
    expIn,
    includesTags,
    tags,
    enabled,
    includesDepartments,
    department: departmentsQuery,
});


export const getHelpTopicSchema = Joi.object({
    id: id.required()
});


export const createHelpTopicSchema = Joi.object({
    name: name.required(),
    expIn,
    tags,
    department: id.required()
});


export const updateHelpTopicSchema = Joi.object({
    name,
    expIn,
    tags,
    department: id
});