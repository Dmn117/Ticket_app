import { model, Schema } from "mongoose";
import IOrganization from "../interfaces/Organization.interfaces";


const organizationSchema: Schema = new Schema<IOrganization>(
    {
        name: {
            type: String,
            required: [true, 'The "name" field is required'],
            unique: true
        },
        enabled: {
            type: Boolean,
            default: true
        },
        director: {
            type: Schema.Types.ObjectId,
            required: [true, 'The "director" field is required'],
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);


const OrganizationSchema = model<IOrganization>('Organization', organizationSchema);


export default OrganizationSchema;