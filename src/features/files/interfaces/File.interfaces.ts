import mongoose, { Document } from "mongoose";


interface IFile extends Document {
    _id: mongoose.Types.ObjectId;

    path: string;
    owner: mongoose.Types.ObjectId;
    originalName: string,

    public: boolean;
    enabled: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface FileEntry {
    path: string;
    owner: string;
    originalName: string;
    public: boolean;
    enabled: boolean;
}

export default IFile;