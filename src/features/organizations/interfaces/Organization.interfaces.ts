import mongoose, { Document } from "mongoose";


interface IOrganization extends Document {
    _id: mongoose.Types.ObjectId;

    name: string;
    enabled: boolean;

    director: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
};


export default IOrganization;