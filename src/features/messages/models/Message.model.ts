import boom from '@hapi/boom';

import File from '../../files/models/File.model';
import User from '../../users/models/User.model';
import MessageSchema from "../schemas/Message.schema";
import MessageQueryParams from "../interfaces/MessageQueryParams";

import { JwtPayload } from 'jsonwebtoken';
import { IMessage, MessageEntry } from "../interfaces/Message.interfaces";
import { Roles } from '../../../shared/config/enumerates';


class Message {

    //! Private

    //? Validate Data Entry
    private static validations = async (data: Partial<MessageEntry>): Promise<void> => {
        const promises: Promise<any>[] = [];

        if (data.owner) promises.push(User.findById(data.owner, false));

        if (data.attachment) promises.push(File.findById(data.attachment, false));

        await Promise.all(promises);
    };   

    //! Public


    //? Find All or some messages by Query Parameters
    public static find = async (params: Partial<MessageQueryParams>): Promise<IMessage[]> => {
        const messages: IMessage[] = await MessageSchema.find(params);

        if (messages.length === 0) throw boom.notFound('Mensajes no encontrados');

        return messages;
    };

    //? Find Message by Id
    public static findById = async (id: string): Promise<IMessage> => {
        const message: IMessage | null = await MessageSchema.findById(id);

        if (!message) throw boom.notFound('Mensaje no encontrado');

        return message;
    };

    //? Create a new Message
    public static create = async (data: Partial<MessageEntry>): Promise<IMessage> => {
        await this.validations(data);

        const message: IMessage = await MessageSchema.create(data);

        return message;
    };

    //? Update Message by Id
    public static update = async (
        id: string, 
        data: Partial<MessageEntry>,
        user: JwtPayload | undefined
    ): Promise<IMessage> => {
        if (!user) throw boom.badRequest('Payload incompleto o mal estructurado: Recupearando User');

        await this.validations(data);
        
        const message: IMessage = await this.findById(id);

        if (message.owner.toString() !== user.sub && user.role !== Roles.ADMIN) 
            throw boom.unauthorized('Solo el autor del mensaje lo puede editar');

        if (data.text) {
            message.isEdited = true;
            message.previousTexts.push(message.text);
            message.text = data.text
        }

        message.visibility = data.visibility || message.visibility;
        message.attachment = data.attachment || message.attachment as any;
        message.attachmentType = data.attachmentType || message.attachmentType;
        
        await message.save();

        return message;
    };

    //? Delete Messages by Id
    public static delete = async (id: string): Promise<IMessage> => {
        const message: IMessage | null = await MessageSchema.findByIdAndDelete(id);

        if (!message) throw boom.notFound('Mensaje no encontrado');
        
        return message;
    };
}


export default Message;