import Joi, { Schema } from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";

import { VCODE_LENGTH } from "../../../shared/config/constants";
import { createPermissionGroupSchema } from "../../permissionGroups/validators/PermissionGroup.validators";

const firstName = ExtendedJoi.string().label('El Nombre del Usuario');
const lastName = ExtendedJoi.string().label('El Apellido del Usuario');


const email = ExtendedJoi.email().label('El Email');


const password = ExtendedJoi.password().label('La Contraseña').messages({
    'any.required': '"{{#label}}" es obligatoria.'
});

const includesRoles = Joi.boolean();
const role = Joi.string();

const validated = Joi.boolean();
const enabled = Joi.boolean();

const permissions = Joi.alternatives().try(createPermissionGroupSchema, ExtendedJoi.objectId(), Joi.string());

const _id = ExtendedJoi.objectId();

const verificationCode = Joi.string().length(VCODE_LENGTH);

export const getUsersSchema: Schema = Joi.object({
    firstName,
    lastName,
    email,
    includesRoles,
    role,
    validated, 
    enabled, 
    boss: _id,
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
    avatar: _id.allow(null),
    boss: _id.allow(null),
    permissions: permissions.required()
});


export const createUsersArraySchema: Schema = Joi.array().items(createUserSchema);


export const updateUserSchema: Schema = Joi.object({
    firstName,
    lastName,
    email,
    password,
    role,
    avatar: _id.allow(null),
    boss: _id.allow(null),
    permissions
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