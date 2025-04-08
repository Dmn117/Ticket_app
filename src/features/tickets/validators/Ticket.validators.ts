import Joi from "joi";
import ExtendedJoi from "../../../shared/utils/lib/Extended.joi";
import { TicketItems, TicketStatus } from "../../../shared/config/enumerates";
import { MAX_TICKET_RATING, MIN_TICKET_RATING } from "../../../shared/config/constants";


const id = ExtendedJoi.objectId();

const title = Joi.string().min(1);
const description = Joi.string().min(1);

const rating = Joi.number().min(MIN_TICKET_RATING).max(MAX_TICKET_RATING);
const comment = Joi.string().min(1);
const justification = Joi.string();
const ratingQuery = Joi.string();

const includesStatus = Joi.boolean();
const status = Joi.string().valid(...(Object.keys(TicketStatus)));

const includesRatings = Joi.boolean();
const statusQuery = Joi.string();

const includesDepartments = Joi.boolean();
const departmentsQuery = Joi.string().min(24);

const includesHelpTopics = Joi.boolean();
const helpTopic = Joi.string().min(24);

const date = Joi.date();

export const getTicketSchema = Joi.object({
    id: id.required()
});


export const getTicketsSchema = Joi.object({
    title,
    description,
    includesStatus,
    status: statusQuery,
    includesRatings,
    rating: ratingQuery,
    owner: id,
    assignedTo: id,
    includesDepartments,
    department: departmentsQuery,
    includesHelpTopics,
    helpTopic,
});


export const createTicketSchema = Joi.object({
    title: title.required(),
    description: description.required(),
    owner: id.required(),
    department: id.required(),
    helpTopic: id.required(),
});


export const updateTicketSchema = Joi.object({
    title,
    description,
    status,
    justification,
});


export const rateTicketSchema = Joi.object({
    rating: rating.required(),
    comment: comment.required()
});


export const addItemSchema = Joi.object({
    message: id,
    file: id,
    department: id,
    transfer: id,
    assignedTo: id,
    helpTopic: id,
}).xor(...Object.keys(TicketItems));


export const removeItemSchema = Joi.object({
    message: id,
    file: id,
    transfer: id,
}).xor(
    TicketItems.message, 
    TicketItems.file, 
    TicketItems.transfer
);