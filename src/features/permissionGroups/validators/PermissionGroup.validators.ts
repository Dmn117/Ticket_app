import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const permissionSchema = Joi.object({
    segment: Joi.string(),
    permissions: Joi.array().items(Joi.string()).min(1)
});

const _id = ExtendedJoi.objectId();
const profile = Joi.string();
const permissions = Joi.array().items(permissionSchema).min(1);


export const getPermissionGroupSchema = Joi.object({
    id: _id.required()
});


export const getPermissionGroupsSchema = Joi.object({
    profile,
    segment: Joi.string(),
    permissions: Joi.string()
});


export const createPermissionGroupSchema = Joi.object({
    profile: profile.required(),
    permissions: permissions.required()
});


export const updatePermissionGroupSchema = Joi.object({
    profile,
    permissions
});