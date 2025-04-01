import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";


const id = ExtendedJoi.objectId();
const owner = ExtendedJoi.objectId();
const foldername = Joi.string().min(3);
const enabled = Joi.boolean();


export const createFileSchema = Joi.object({
    owner: owner.required(),
    foldername: foldername.required(),
    public: Joi.boolean(),
});


export const getFilesSchema = Joi.object({
    owner,
    enabled
});

export const getFileSchema = Joi.object({
    id: id.required()
});


export const updateFileSchema = Joi.object({
    id: id.required(),
    foldername: foldername.required(),
    public: Joi.boolean(),
});