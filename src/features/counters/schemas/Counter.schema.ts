import { model, Schema } from "mongoose";
import { ICounter } from "../interfaces/Counter.interfaces";




const counterSchema: Schema = new Schema<ICounter>(
    {
        model: {
            type: String,
            required: [true, 'El campo "model" es requerido'],
            unique: true
        },
        sequenceValue: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);


const CounterSchema = model<ICounter>('Counter', counterSchema);


export default CounterSchema;