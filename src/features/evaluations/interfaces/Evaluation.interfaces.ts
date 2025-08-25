import mongoose, { Document } from "mongoose";
import { ShortUser } from "../../users/interfaces/User.interfaces";




export interface IEvaluation extends Document {
    _id: mongoose.Types.ObjectId;

    rate: number;
    comments: string;
    rated: boolean;

    month: number;
    year: number;

    agent: mongoose.Types.ObjectId;
    evaluator: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}



export interface EvaluationEntry {
    rate: number;
    comments: string;
    rated: boolean;

    month: number;
    year: number;

    agent: string;
    evaluator: string;
}


export interface EvaluationWithPopulate extends Document {
    _id: mongoose.Types.ObjectId;

    rate: number;
    comments: string;
    rated: boolean;

    month: number;
    year: number;

    agent: ShortUser;
    evaluator: ShortUser;

    createdAt: Date;
    updatedAt: Date;
}