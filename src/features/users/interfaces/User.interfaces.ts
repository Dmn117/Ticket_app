import { Document, Types } from "mongoose";

import { IPermissionGroup, PermissionGroupEntry } from "../../permissionGroups/interfaces/PermissionGroup.interfaces";


export interface UserBase {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    role: string;
    
    verificationCode: string;
    codeExpirationDate: Date;
    
    validated: boolean;
    enabled: boolean;
    validationAttempts: number;
}


export interface IUser extends Document, UserBase {
    _id: Types.ObjectId;

    avatar: Types.ObjectId;
    boss: Types.ObjectId;
    permissions: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}


export interface UserWithPopulate extends Omit<IUser, 'permissions'>{
    permissions: IPermissionGroup;
};


export interface ShortUser extends Omit<
    UserBase, 
    'password' | 
    'verificationCode' | 
    'codeExpirationDate' | 
    'validationAttempts' | 
    'validated' | 
    'permissions'
> {
    _id: Types.ObjectId;

    avatar: Types.ObjectId;
    boss: Types.ObjectId;
    permissions: Types.ObjectId | IPermissionGroup;

    createdAt: Date;
    updatedAt: Date;
}


export interface UserEntry extends Omit<
    UserBase, 
    'verificationCode' | 
    'codeExpirationDate' | 
    'validationAttempts'
> {
    avatar: string;
    boss: string;
    permissions: string | PermissionGroupEntry;
}

export default IUser;