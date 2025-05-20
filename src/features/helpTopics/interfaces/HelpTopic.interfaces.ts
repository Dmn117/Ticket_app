import { Document, Types } from "mongoose";



export interface HelpTopicBase {
    name: string;
    expIn: number;
    tags: string[];
    
    enabled: boolean;

    classification: number;
    examples: string[];
    
    department: string;
}


export interface IHelpTopic extends Document, Omit<HelpTopicBase, 
    'department'
> {
    _id: Types.ObjectId;

    department: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}