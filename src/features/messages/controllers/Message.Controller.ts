import { Request, Response } from "express";

import Message from "../models/Message.model";
import CustomError from "../../../shared/interfaces/CustomError";
import MessageQueryParams from "../interfaces/MessageQueryParams";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";

import { JwtPayload } from "jsonwebtoken";
import { IMessage } from "../interfaces/Message.interfaces";




class MessageController {

    //! Private

    //? Assemble Query Parameters
    private static assemblQueryParams = (req: Request): Partial<MessageQueryParams> => {
        const params: Partial<MessageQueryParams> = {};

        if (req.query.text) params.text = { $regex: req.query.text.toString(), $options: 'i' };

        if (req.query.owner) params.owner = req.query.owner.toString();
        
        return params;
    };
    
    //! Public

    
    //! GET Methods

    //? Get All or Some Messages by Query Parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: Partial<MessageQueryParams> = this.assemblQueryParams(req);
            const messages: IMessage[] = await Message.find(params);

            res.status(200).json({
                message: 'Mensajes recuperados exitosamente',
                messages
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Get Message by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const message: IMessage = await Message.findById(id);

            res.status(200).json({
                resMessage: 'Mensaje recuperado exitosamente',
                message
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! POST Methods

    //? Create a New Message
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const message: IMessage = await Message.create(body);

            res.status(201).json({
                resMessage: 'Mensaje registrado exitosamente',
                message
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //! PUT Methods

    //? Update Message by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;
            const user: JwtPayload | undefined = req.user;

            const message: IMessage = await Message.update(id, body, user);

            res.status(200).json({
                resMessage: 'Mensaje actualizado exitosamente',
                message
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! DELETE Methods

    //? Update Message by Id
    public static delete = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;

            const message: IMessage = await Message.delete(id);

            res.status(200).json({
                resMessage: 'Mensaje eliminado exitosamente',
                message
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };
}


export default MessageController;