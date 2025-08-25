import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId();
const ids = ExtendedJoi.objectIdList();

const rate = Joi.number().min(0).max(100);
const comments = Joi.string().min(5);
const rated = Joi.boolean();


const rateQuery = Joi.string()
    .pattern(/^\d+(,\s*\d+)*,?$/)
    .message('La cadena debe contener solo números separados por comas.');

const month = Joi.number().min(1).max(12);
const year = Joi.number().min(2000);


export const getEvaluationSchema = Joi.object({
    id: id.required()
});


export const getEvaluationsSchema = Joi.object({
    includesRate: Joi.boolean(),
    rate: rateQuery,
    comments: Joi.string(),
    rated,
    includesMonth: Joi.boolean(),
    month: rateQuery,
    includesYear: Joi.boolean(),
    year: rateQuery,
    includesAgent: Joi.boolean(),
    agent: ids,
    evaluator: id,
    boss: id
});


export const createEvaluationSchema = Joi.object({
    rate,
    comments,
    rated,
    month: month.required(),
    year: year.required(),
    agent: id.required(),
    evaluator: id
});


export const massCreationOfEvaluationsSchema = Joi.object({
    month: month.required(),
    year: year.required(),
});


export const updateEvaluationSchema = Joi.object({
    rate,
    comments,
    rated,
    month,
    year,
    evaluator: id
});