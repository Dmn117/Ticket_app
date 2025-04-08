import { model, Schema } from "mongoose";
import { ITicket } from "../interfaces/Ticket.interfaces";
import { TicketStatus } from "../../../shared/config/enumerates";


const ticketSchema: Schema = new Schema<ITicket>(
    {
        title: {
            type: String,
            required: [true, 'El campo "title" es requerido']
        },
        description: {
            type: String,
            required: [true, 'El campo "description" es requerido']
        },
        number: {
            type: Number,
            required: [true, 'El campo "number" es requerido']
        },
        status: {
            type: String,
            default: TicketStatus.OPEN
        },
        rating: {
            type: Number,
            default: null
        },
        comment: {
            type: String,
            default: ''
        },
        justification: {
            type: String,
            default: ''
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "owner" es requerido'],
            ref: 'User',
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'User'
        },
        department: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "department" es requerido'],
            ref: 'Department',
        },
        helpTopic: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "helpTopic" es requerido'],
            ref: 'HelpTopic'
        },
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'Message',
        }],
        files: [{
            type: Schema.Types.ObjectId,
            ref: 'Files'
        }],
        transfers: [{
            type: Schema.Types.ObjectId,
            ref: 'Transfer'
        }],
        assignedAt: {
            type: Date,
            default: null
        },
        answeredAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


const TicketSchema = model<ITicket>('Ticket', ticketSchema);


export default TicketSchema;