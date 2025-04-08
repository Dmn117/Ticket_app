import { model, Schema } from "mongoose";
import { IHelpTopic } from "../interfaces/HelpTopic.interfaces";


const helpTopicSchema: Schema = new Schema<IHelpTopic>(
    {
        name: {
            type: String,
            required: [true, 'El campo "name" es requerido']
        },
        expIn: {
            type: Number,
            default: 60
        },
        tags: {
            type: [String],
            validate: {
                validator: (array: string[]) => {
                    return array.length === new Set(array).size;
                },
                message: 'El atributo "tags" no soporta etiquetas duplicadas'
            }
        },
        enabled: {
            type: Boolean,
            default: true
        },
        department: {
            type: Schema.Types.ObjectId,
            required: [true, 'El campo "department" es requerido'],
            ref: 'Department'
        }
    },
    {
        timestamps: true
    }
);


const HelpTopicSchema = model<IHelpTopic>('HelpTopic', helpTopicSchema);


export default HelpTopicSchema;