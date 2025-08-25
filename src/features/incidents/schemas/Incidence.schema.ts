import { model, Schema } from "mongoose";

import { IIncidence } from "../interfaces/Incident.interfaces";


const incidentSchema: Schema = new Schema<IIncidence>(
    {
        title: {
            type: String,
            required: [true, 'El campo "title" es requerido']
        },
        description: {
            type: String,
            required: [true, 'El campo "description" es requerido']
        },
        severity: {
            type: Number,
            default: 1
        },
        author: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "author" es requerido'],
            ref: 'User'
        },
        agent: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "agent" es requerido'],
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);


const IncidentSchema = model<IIncidence>('Incidence', incidentSchema);


export default IncidentSchema;