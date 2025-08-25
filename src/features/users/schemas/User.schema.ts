import { model, Schema } from "mongoose";

import IUser from "../interfaces/User.interfaces";
import { Roles } from "../../../shared/config/enumerates";
import { VCODE_LENGTH } from "../../../shared/config/constants";
import { generateVerificationCode } from "../../../shared/utils/lib/VerificationCode";


const schema: Schema = new Schema<IUser>(
    {
        firstName: { 
            type: String, 
            required: [true, 'The "firstName" field is required'] 
        },
        lastName: {
            type: String,
            required: [true, 'The "lastName" filed is required']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'The "email" field is required']
        },
        password: {
            type: String,
            required: [true, 'The "password" field is required']
        },
        role: {
            type: String,
            default: Roles.USER
        },
        specialPermissions: [{
            type: String
        }],
        rating: {
            type: Number,
            default: 0
        },
        evaluatedTickets: {
            type: Number,
            default: 0
        },
        closedTickets: {
            type: Number,
            default: 0
        },
        reporter: {
            type: Boolean,
            default: false
        },
        verificationCode: {
            type: String,
            default: generateVerificationCode(VCODE_LENGTH)
        },
        codeExpirationDate: {
            type: Date,
            default: Date.now
        },
        validated: {
            type: Boolean,
            default: false
        },
        enabled: {
            type: Boolean,
            default: true
        },
        validationAttempts: {
            type: Number,
            default: 0
        },
        avatar: {
            type: Schema.Types.ObjectId,
            ref: 'File',
            default: null
        },
        boss: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        departments: [{
            type: Schema.Types.ObjectId,
            ref: 'Department'
        }]
    },
    {
        timestamps: true
    }
);


const UserSchema = model<IUser>('User', schema);


export default UserSchema;