import { model, Schema } from "mongoose";

import IUser from "../interfaces/User.interfaces";

import { VCODE_LENGTH } from "../../../shared/config/constants";
import { generateVerificationCode } from "../../../shared/utils/lib/VerificationCode";


const schema: Schema = new Schema<IUser>(
    {
        firstName: { 
            type: String, 
            required: [true, 'El "firstName" es requerido'] 
        },
        lastName: {
            type: String,
            required: [true, 'El "lastName" es requerido']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'El campo "email" es requerido']
        },
        password: {
            type: String,
            required: [true, 'El campo "password" es requerido']
        },
        role: {
            type: String,
            default: 'Usuario'
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
        permissions: {
            type: Schema.Types.ObjectId,
            ref: 'PermissionGroup'
        }
    },
    {
        timestamps: true
    }
);


const UserSchema = model<IUser>('User', schema);


export default UserSchema;