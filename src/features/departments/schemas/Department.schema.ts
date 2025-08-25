import { model, Schema } from "mongoose";
import IDepartment from "../interfaces/Department.interfaces";


const departmentSchema: Schema = new Schema<IDepartment>(
    {
        name: {
            type: String,
            required: [true, 'The "name" field is required']
        },
        enabled: {
            type: Boolean,
            default: true
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: [true, 'The "organization" field is required'],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'The "owner" field is required'],
        }
    },
    {
        timestamps: true
    }
);


const DepartmentSchema = model<IDepartment>('Department', departmentSchema);


export default DepartmentSchema;