import { model, Schema } from "mongoose";
import Permission, { IPermissionGroup } from "../interfaces/PermissionGroup.interfaces";


const permissionSchema: Schema = new Schema<Permission>(
    {
        segment: String,
        permissions: [String]
    },
    {
        _id: false,
        timestamps: false
    }
);


const schema: Schema = new Schema<IPermissionGroup>(
    {
        profile: {
            type: String,
            unique: true,
            required: [true, 'El campo "profile" es requerido']
        },
        enabled: {
            type: Boolean,
            default: true
        },
        permissions: [permissionSchema],
    },
    {
        timestamps: true
    }
);


const permissionGroupSchema = model<IPermissionGroup>('PermissionGroup', schema);


export default permissionGroupSchema;