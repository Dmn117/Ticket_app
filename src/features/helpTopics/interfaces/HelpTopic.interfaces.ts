import mongoose, { Document } from "mongoose";



export interface IHelpTopic extends Document {
    _id: mongoose.Types.ObjectId;

    name: string;
    expIn: number;
    tags: string[];
    
    enabled: boolean;

    department: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

