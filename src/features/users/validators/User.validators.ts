import Joi, { Schema } from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";
import { Roles, SpecialPermissions } from "../../../shared/config/enumerates";
import { MAX_TICKET_RATING, MIN_TICKET_RATING, VCODE_LENGTH } from "../../../shared/config/constants";

const firstName = Joi.string().min(3).max(50);
const lastName = Joi.string().min(3).max(50);
const email = Joi.string().email();
const password = Joi.string().min(8);

const role = Joi.string().valid(...(Object.values(Roles)));
const specialPermissions = Joi.array().items(Joi.string().valid(...(Object.values(SpecialPermissions))));

const includesRoles = Joi.boolean();
const roleQuery = Joi.string().min(3);

const reporter = Joi.boolean();
const validated = Joi.boolean();
const enabled = Joi.boolean();

const departments = Joi.array().items(ExtendedJoi.objectId());

const includesDepartments = Joi.boolean();
const departmentsQuery = Joi.string().min(24);

const _id = ExtendedJoi.objectId();

const verificationCode = Joi.string().length(VCODE_LENGTH);

const rating = Joi.number().min(MIN_TICKET_RATING).max(MAX_TICKET_RATING);

export const getUsersSchema: Schema = Joi.object({
    firstName,
    lastName,
    email,
    includesRoles,
    role: roleQuery,
    reporter,
    validated, 
    enabled, 
    boss: _id,
    includesDepartments,
    departments: departmentsQuery,
    ratingLte: rating,
    ratingGte: rating,
});


export const getUserSchema: Schema = Joi.object({
    id: _id.required()
});


export const loginUserSchema: Schema = Joi.object({
    email: email.required(),
    password: password.required()
});


export const createUserSchema: Schema = Joi.object({
    firstName: firstName.required(),
    lastName: lastName.required(),
    email: email.required(),
    password: password.required(),
    role,
    reporter,
    specialPermissions,
    avatar: _id,
    boss: _id,
    departments
});


export const createUsersArraySchema: Schema = Joi.array().items(createUserSchema);


export const updateUserSchema: Schema = Joi.object({
    firstName,
    lastName,
    email,
    password,
    role,
    reporter,
    specialPermissions,
    avatar: _id,
    boss: _id,
    departments
});


export const getUserByEmailSchema: Schema = Joi.object({
    email: email.required()
});

export const validateUserSchema: Schema = Joi.object({
    verificationCode: verificationCode.required()
});


export const recoverPassworSchema: Schema = Joi.object({
    verificationCode: verificationCode.required(),
    password: password.required()
});