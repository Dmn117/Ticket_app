import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";
import { MessageAttachmentType, MessageVisibility } from "../../../shared/config/enumerates";



const id = ExtendedJoi.objectId();

const text = Joi.string().min(1);
const visibility = Joi.string().valid(...Object.keys(MessageVisibility));
const attachmentType = Joi.string().valid(...Object.keys(MessageAttachmentType));



export const getMessagesSchema = Joi.object({
    text,
    owner: id
});


export const getMessageSchema = Joi.object({
    id
});


export const createMessageSchema = Joi.object({
    text: text.required(),
    owner: id.required(),
    visibility,
    attachment: id,
    attachmentType
});

export const updateMessageSchema = Joi.object({
    text,
    visibility,
    attachment: id,
    attachmentType,
});


