import mongoose, { Document } from "mongoose";


export interface IMessage extends Document {
    _id: mongoose.Types.ObjectId;

    text: string;
    visibility: string;
    
    isEdited: boolean;
    previousTexts: string[];

    attachment: mongoose.Types.ObjectId;
    attachmentType: string;

    owner: mongoose.Types.ObjectId;

    createdAt: Date;
    updateAt: Date;
}

export interface MessageEntry {
    text: string;
    visibility: string;

    attachment: string;
    attachmentType: string;

    owner: string;
}


export interface MessageWithPopulate {
    _id: string;

    text: string;
    visibility: string;
    
    isEdited: boolean;
    previousTexts: string[];

    attachment: MessageAttachment;
    attachmentType: string;

    owner: MessageOwner;

    createdAt: Date;
    updateAt: Date;
}

export interface MessageOwner {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar: string;
}


export interface MessageAttachment {
    _id: string;
    originalName: string;
}


