import { model, Schema } from "mongoose";
import { ITransfer } from "../interfaces/Transfer.interfaces";


const transferSchema: Schema = new Schema<ITransfer>(
    {
        nextDepartment: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'Department'
        },
        nextAssigned: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'User'
        },
        nextHelpTopic: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'HelpTopic'
        },
        preDepartment: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'Department'
        },
        preAssigned: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'User'
        },
        preHelpTopic: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'HelpTopic'
        },
        ticket: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "ticket" es requerido'],
            ref: 'Ticket'
        }
    },
    {
        timestamps: true
    }
);


const TransferSchema = model<ITransfer>('Transfer', transferSchema);


export default TransferSchema;