import mongoose, { Document } from "mongoose";
import { ShortUser } from "../../users/interfaces/User.interfaces";



export interface IIncidence extends Document {
    _id: mongoose.Types.ObjectId;

    title: string;
    description: string;
    severity: number;

    author: mongoose.Types.ObjectId;
    agent: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}


export interface IncidenceEntry {
    title: string;
    description: string;
    severity: number;

    author: string;
    agent: string;
}


export interface IncidenceWithPopulate extends Document {
    _id: mongoose.Types.ObjectId;

    title: string;
    description: string;
    severity: number;

    author: ShortUser;
    agent: ShortUser;

    createdAt: Date;
    updatedAt: Date;
}