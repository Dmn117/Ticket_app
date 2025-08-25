//! CLI by https://github.com/Dmn117

import { model, Schema } from "mongoose";
import IApplication from "../interfaces/Application.interfaces";


const schema: Schema = new Schema<IApplication>(
    {
        name: {
            type: String,
            required: [true, 'El campo "name" es requerido']
        },
        enabled: {
            type: Boolean,
            default: true
        },
        token: {
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


const ApplicationSchema = model<IApplication>('Application', schema);


export default ApplicationSchema;