import { Request, Response } from "express";
import TicketQueryParams from "../interfaces/TicketQueryParams";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import CustomError from "../../../shared/interfaces/CustomError";
import { ITicket } from "../interfaces/Ticket.interfaces";
import Ticket from "../models/Ticket.model";
import { TicketItemsTranslate } from "../../../shared/config/enumerates";
import { JwtPayload } from "jsonwebtoken";




class TicketController {
    //! Private

    //? Assemble Query Parameters
    private static assembleQueryParams = (req: Request): Partial<TicketQueryParams> => {
        const params: Partial<TicketQueryParams> = {};

        if (req.query.title) 
            params.title = { $regex: req.query.title.toString(), $options: 'i' };

        if (req.query.description) 
            params.description = { $regex: req.query.description.toString(), $options: 'i' };

        if (req.query.status) {
            if (req.query.includesStatus && req.query.includesStatus.toString() === 'true') {
                params.status = { $in: req.query.status.toString().split(', ') };
            }
            else {
                params.status = { $nin: req.query.status.toString().split(', ') };
            }
        }

        if (req.query.rating) {
            if (req.query.includesRatings && req.query.includesRatings.toString() === 'true') {
                params.rating = { 
                    $in: req.query.rating.toString().split(', ').map(rtg => Number(rtg)) 
                };
            }
            else {
                params.rating = { 
                    $nin: req.query.rating.toString().split(', ').map(rtg => Number(rtg)) 
                };
            }
        }

        if (req.query.owner) 
            params.owner = req.query.owner.toString();

        if (req.query.assignedTo) 
            params.assignedTo = req.query.assignedTo.toString();

        if (req.query.department) {
            if (req.query.includesDepartments && req.query.includesDepartments.toString() === 'true') {
                params.department = { $in: req.query.department.toString().split(', ') }
            }
            else {
                params.department = { $nin: req.query.department.toString().split(', ') }
            }
        }

        if (req.query.helpTopic) {
            if (req.query.includesHelpTopics && req.query.includesHelpTopics.toString() === 'true') {
                params.helpTopic = { $in: req.query.helpTopic.toString().split(', ') }
            }
            else {
                params.helpTopic = { $nin: req.query.helpTopic.toString().split(', ') }
            }
        }

        return params;
    };

    //! Public 

    //! GET Methods

    //? Get All or Some Ticket by Query Parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: Partial<TicketQueryParams> = this.assembleQueryParams(req);

            const tickets: ITicket[] = await Ticket.find(params);

            res.status(200).json({
                message: 'Tickets recuperados exitosamente',
                tickets
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Get Ticket by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const ticket: ITicket = await Ticket.findById(id, true) as ITicket;

            res.status(200).json({
                message: 'Ticket recuperado exitosamente',
                ticket
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //! POST Methods

    //? Create a new Ticket
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const ticket: ITicket = await Ticket.create(body);

            res.status(201).json({
                message: 'Ticket registrado exitosamente',
                ticket
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    
    //! PUT Methods

    //? Update Ticket by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;
            const user: JwtPayload | undefined = req.user;
        
            const ticket: ITicket = await Ticket.update(id, body, user);

            res.status(200).json({
                message: 'Ticket actualizado exitosamente',
                ticket
            });
        }
        catch (error){
            next(error as CustomError);
        }
    };


    //! PATCH Methods

    //? Add Items by Id
    public static addItem = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;
            const type = Object.keys(body)[0] as keyof typeof TicketItemsTranslate;
            const details = TicketItemsTranslate[type];
        
            const ticket: ITicket = await Ticket.addItem(id, body, type);

            res.status(200).json({
                message: `${details.text} vinculad${details.end} exitosamente`,
                ticket
            });
        }
        catch (error){
            next(error as CustomError);
        }
    };


    //? Remove Items by Id
    public static removeItem = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;
            const type = Object.keys(body)[0] as keyof typeof TicketItemsTranslate;
            const details = TicketItemsTranslate[type];
        
            const ticket: ITicket = await Ticket.removeItem(id, body, type);

            res.status(200).json({
                message: `${details.text} desvinculad${details.end} exitosamente`,
                ticket
            });
        }
        catch (error){
            next(error as CustomError);
        }
    };


    //? Assign or Transfer Ticket
    public static assignOrTransfer = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;
            const type = Object.keys(body)[0] as keyof typeof TicketItemsTranslate;
            const details = TicketItemsTranslate[type];
        
            const ticket: ITicket = await Ticket.addItem(id, body, type);

            res.status(200).json({
                message: `${details.text} desvinculad${details.end} exitosamente`,
                ticket
            });
        }
        catch (error){
            next(error as CustomError);
        }
    };


    //? Rate Ticket by Id
    public static rate = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;
            const user: JwtPayload | undefined = req.user;
        
            const ticket: ITicket = await Ticket.rateTicket(id, body, user);

            res.status(200).json({
                message: 'Ticket calificado exitosamente',
                ticket
            });
        }
        catch (error){
            next(error as CustomError);
        }
    };


    //! DELETE Methods

    //? Delete Ticket by Id
    public static delete = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
        
            const ticket: ITicket = await Ticket.delete(id);

            res.status(200).json({
                message: 'Ticket eliminado exitosamente',
                ticket
            });
        }
        catch (error){
            next(error as CustomError);
        }
    };
}


export default TicketController;