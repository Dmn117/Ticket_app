import { model, Schema } from "mongoose";
import IFile from "../interfaces/File.interfaces";



const fileSchema: Schema = new Schema<IFile>(
    {
        path: {
            type: String,
            default: ''
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        enabled: {
            type: Boolean,
            default: true
        },
        originalName: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);


const FileSchema = model<IFile>('File', fileSchema);


export default FileSchema;