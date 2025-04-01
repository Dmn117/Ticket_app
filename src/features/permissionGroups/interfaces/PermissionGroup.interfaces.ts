import mongoose, { Document } from "mongoose";

export interface Permission {
    segment: string;
    permissions: string[];
}


export interface PermissionGroupEntry {
    profile: string;
    enabled: boolean;
    permissions: Permission[];
}


export interface IPermissionGroup extends Document, PermissionGroupEntry {
    _id: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}


export default Permission;