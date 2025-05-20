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
        classification: {
            type: Number,
            required: [true, 'El campo "classification" es requerido']
        },
        examples: [{
            type: String
        }],
        department: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            required: [true, 'El campo "department" es requerido']
        }
    },
    {
        timestamps: true
    }
);


const HelpTopicSchema = model<IHelpTopic>('HelpTopic', helpTopicSchema);


export default HelpTopicSchema;