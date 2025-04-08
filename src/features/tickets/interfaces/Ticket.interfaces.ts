import mongoose, { Document } from "mongoose";

import IUser from "../../users/interfaces/User.interfaces";
import IDepartment from "../../departments/interfaces/Department.interfaces";

import { IHelpTopic } from "../../helpTopics/interfaces/HelpTopic.interfaces";
import { MessageWithPopulate } from "../../messages/interfaces/Message.interfaces";

export interface ITicket extends Document {
    _id: mongoose.Types.ObjectId;

    title: string;
    description: string;

    number: number;
    status: string;

    rating: number;
    comment: string;

    justification: string;

    owner: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId;

    department: mongoose.Types.ObjectId;
    helpTopic: mongoose.Types.ObjectId;
    
    messages: mongoose.Types.ObjectId[];
    files: mongoose.Types.ObjectId[];
    transfers: mongoose.Types.ObjectId[];

    assignedAt: Date;
    answeredAt: Date;
    completedAt: Date;

    createdAt: Date;
    updateAt: Date;
}


export interface TicketEntry {
    title: string;
    description: string;

    status: string;

    rating: number;
    comment: string;
    
    justification: string;

    owner: string;
    assignedTo: string;

    department: string;
    helpTopic: string;
    
    messages: string[];
    files: string[];
    transfers: string[];

    message: string;    
    file: string;
    transfer: string;

    assignedAt: Date;
    answeredAt: Date;
    completedAt: Date;

    createdAt: Date;
    updateAt: Date;
}


export interface TicketWithPopulate {
    _id: mongoose.Types.ObjectId;

    title: string;
    description: string;

    number: number;
    status: string;

    rating: number;
    comment: string;

    owner: IUser;
    assignedTo: IUser;

    department: IDepartment;
    helpTopic: IHelpTopic;
    
    messages: MessageWithPopulate[];
    files: mongoose.Types.ObjectId[];
    transfers: mongoose.Types.ObjectId[];

    assignedAt: Date;
    answeredAt: Date;
    completedAt: Date;

    createdAt: Date;
    updateAt: Date;
}