import mongoose, { Document } from "mongoose";


export interface IDepartment extends Document {
    _id: mongoose.Types.ObjectId;

    name: string;
    enabled: boolean;

    organization: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;

    creatdAt: Date;
    updateAt: Date;
};


export default IDepartment;