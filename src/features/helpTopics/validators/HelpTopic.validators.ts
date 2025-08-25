import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId().label('El Id');
const name = ExtendedJoi.string().min(5).max(100).label('El nombre');

const includesTags = ExtendedJoi.boolean().label('Incluir etiquetas');
const tags = ExtendedJoi.array().items(Joi.string().min(3).max(20)).label('Las etiquetas');
const expIn = ExtendedJoi.number().min(1).label('El tiempo de expiracion');

const enabled = ExtendedJoi.boolean().label('El estado');

const department = ExtendedJoi.objectId().label('El Id del departamento');

const includesDepartments = ExtendedJoi.boolean();
const departmentsQuery = ExtendedJoi.string().label('Los Ids de los departamentos');

const examples = ExtendedJoi.array().items(ExtendedJoi.string()).label('Los Ejemplos');


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
    examples: examples.required(),
    department: department.required(),
});


export const updateHelpTopicSchema = Joi.object({
    name,
    expIn,
    tags,
    examples,
    department,
});