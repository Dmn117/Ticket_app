import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";
import { MAX_AGENT_RATING, MIN_AGENT_RATING } from "../../../shared/config/constants";


const id = ExtendedJoi.objectId();

const title = Joi.string().min(5);
const description = Joi.string().min(10);
const severity = Joi.number().min(MIN_AGENT_RATING).max(MAX_AGENT_RATING);

const includesSeverity = Joi.boolean();

const severityQuery = Joi.string()
    .pattern(/^\d+(,\s*\d+)*,?$/)
    .message('La cadena debe contener solo números separados por comas.');

const startDate = Joi.date().iso();
const endDate = startDate.greater(Joi.ref('startDate')).message('La fecha final debe ser mayor que la fecha de inicio')

export const getIncidenceSchema = Joi.object({
    id: id.required()
});


export const getIncidentsSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    includesSeverity,
    severity: severityQuery,
    auhtor: id,
    includesAgent: Joi.boolean(),
    agent: id,
    startDate,
    endDate
});


export const createIncidenceSchema = Joi.object({
    title: title.required(),
    description: description.required(),
    severity,
    author: id.required(),
    agent: id.required()
});


export const updateIncidenceSchema = Joi.object({
    title,
    description,
    severity
});