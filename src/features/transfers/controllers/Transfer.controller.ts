import { RootFilterQuery } from "mongoose";
import { Request, Response } from "express";

import Transfer from "../models/Transfer.model";
import CustomError from "../../../shared/interfaces/CustomError";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";

import { ITransfer } from "../interfaces/Transfer.interfaces";


class TransferController {

    //! Private

    //? Assemble Query parameters
    private static assembleQueryParams = (req: Request): RootFilterQuery<ITransfer> => {
        const params: RootFilterQuery<ITransfer> = {};

        if (req.query.ticket) params.ticket = req.query.ticket.toString();

        return params;
    };

    //! Public 


    //! GET Methods

    //? Get all or some Transfers by query parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: RootFilterQuery<ITransfer> = this.assembleQueryParams(req);
            const transfers: ITransfer[] = await Transfer.find(params);

            res.status(200).json({
                message: 'Transferencias recuperadas exitosamente',
                transfers
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Get Transfer by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const transfer: ITransfer = await Transfer.findById(id);

            res.status(200).json({
                message: 'Transferencia recuperada exitosamente',
                transfer
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! POST Methods

    //? Create a new Transfer
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const transfer: ITransfer = await Transfer.create(body);

            res.status(201).json({
                message: 'Transferencia registrada exitosamente',
                transfer
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! PUT Methods

    //? Update Transfer by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const transfer: ITransfer = await Transfer.update(id, body);

            res.status(200).json({
                message: 'Transferencia actualizada exitosamente',
                transfer
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //! DELETE Methods

    //? Delete Transfer by Id
    public static delete = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const transfer: ITransfer = await Transfer.delete(id);

            res.status(200).json({
                message: 'Transferencia eliminada exitosamente',
                transfer
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

}


export default TransferController;