import mongoose, { Document } from "mongoose"


export interface ICounter extends Omit<Document, "model"> {
    _id: mongoose.Types.ObjectId;

    model: string;
    sequenceValue: number;

    createdAt: Date;
    updatedAt: Date;
}