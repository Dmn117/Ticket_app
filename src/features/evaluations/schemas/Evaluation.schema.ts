import { model, Schema } from "mongoose";
import { IEvaluation } from "../interfaces/Evaluation.interfaces";




const evaluationSchema: Schema = new Schema<IEvaluation>(
    {
        rate: {
            type: Number,
            default: 0
        },
        comments: {
            type: String,
            default: ''
        },
        rated: {
            type: Boolean,
            default: false
        },
        month: {
            type: Number,
            required: [true, 'El campo "month" es requerido']
        },
        year: {
            type: Number,
            required: [true, 'El campo "year" es requerido']
        },
        agent: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "agent" es requerido'],
            ref: 'User'
        },
        evaluator: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'User'
        },
    },
    {
        timestamps: true
    }
);


const EvaluationSchema = model<IEvaluation>('Evaluation', evaluationSchema);


export default EvaluationSchema;