import { model, Schema } from "mongoose";
import { IMessage } from "../interfaces/Message.interfaces";
import { MessageVisibility } from "../../../shared/config/enumerates";


const messageSchema: Schema = new Schema<IMessage>(
    {
        text: {
            type: String,
            required: [true, 'El campo "text" es requerido'],
        },
        visibility: {
            type: String,
            default: MessageVisibility.TO_ALL
        },
        isEdited: {
            type: Boolean,
            default: false
        },
        previousTexts: [{
            type: String
        }],
        attachment: {
            type: Schema.Types.ObjectId,
            ref: 'File',
            default: null
        },
        attachmentType: {
            type: String,
            default: ''
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "owner" es requerido'],
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);


const MessageSchema = model<IMessage>('Message', messageSchema);


export default MessageSchema;