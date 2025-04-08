import mongoose, { Document } from "mongoose";


export interface ITransfer extends Document {
    _id: mongoose.Types.ObjectId;

    nextDepartment: mongoose.Types.ObjectId;
    nextAssigned: mongoose.Types.ObjectId;
    nextHelpTopic: mongoose.Types.ObjectId;

    preDepartment: mongoose.Types.ObjectId;
    preAssigned: mongoose.Types.ObjectId;
    preHelpTopic: mongoose.Types.ObjectId;

    ticket: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}


export interface TransferEntry {
    nextDepartment: string;
    nextAssigned: string;
    nextHelpTopic: string;

    preDepartment: string;
    preAssigned: string;
    preHelpTopic: string;

    ticket: string;
}

