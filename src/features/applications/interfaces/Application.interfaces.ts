//! CLI by https://github.com/Dmn117

import { Document, Types } from "mongoose";
import { UserPublicFields } from "../../users/interfaces/User.interfaces";



export interface ApplicationBase {
    name: string;
    enabled: boolean;
    token: string;
    owner: string;
}


interface IApplication extends Document, Omit<ApplicationBase, 'owner'> {
    _id: Types.ObjectId;

    owner: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}


export interface ApplicationWithPopulate extends Omit<IApplication, 'owner'> {
    owner: UserPublicFields;
}


export default IApplication;