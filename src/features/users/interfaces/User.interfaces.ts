import { Document, Types } from "mongoose";
import { Roles, SpecialPermissions } from "../../../shared/config/enumerates";


interface IUser extends Document {
    _id: Types.ObjectId;

    firstName: string;
    lastName: string;
    email: string;
    password: string;

    role: string | Roles;
    reporter: boolean;
    specialPermissions: SpecialPermissions[];

    rating: number;
    evaluatedTickets: number;
    closedTickets: number;

    verificationCode: string;
    codeExpirationDate: Date;
    
    validated: boolean;
    enabled: boolean;
    validationAttempts: number;

    avatar: Types.ObjectId;
    boss: Types.ObjectId;
    departments: Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}


export interface UserPublicFields {
    _id: Types.ObjectId;
    
    firstName: string;
    lastName: string;
    email: string;
    
    role: string;
    reporter: boolean;
    specialPermissions: SpecialPermissions[];

    rating: number;
    evaluatedTickets: number;
    closedTickets: number;

    enabled: boolean;

    avatar: Types.ObjectId;
    boss: Types.ObjectId;
    departments: Types.ObjectId[];
    
    createdAt: Date;
    updatedAt: Date;
}




export interface ShortUser {
    _id: Types.ObjectId;
    
    firstName: string;
    lastName: string;
    email: string;
}


export default IUser;