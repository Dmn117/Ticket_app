import boom from '@hapi/boom';
import { RootFilterQuery } from 'mongoose';

import User from "../../users/models/User.model";
import Ticket from '../../tickets/models/Ticket.model';
import TransferSchema from "../schemas/Transfer.schemas";
import HelpTopic from '../../helpTopics/models/HelpTopic.model';
import Department from "../../departments/models/Department.model";

import { ITransfer, TransferEntry } from "../interfaces/Transfer.interfaces";



class Transfer {

    //! Private

    //? Validate Data Entry
    private static validations = async (data: Partial<TransferEntry>): Promise<void> => {
        const promises: Promise<any>[] = [];

        data.nextDepartment && promises.push(Department.findById(data.nextDepartment));
        data.nextAssigned && promises.push(User.findById(data.nextAssigned, false));
        data.nextHelpTopic && promises.push(HelpTopic.findById(data.nextHelpTopic));

        data.preDepartment && promises.push(Department.findById(data.preDepartment));
        data.preAssigned && promises.push(User.findById(data.preAssigned, false));
        data.preHelpTopic && promises.push(HelpTopic.findById(data.preHelpTopic));

        data.ticket && promises.push(Ticket.findById(data.ticket, false));
        
        await Promise.all(promises);
    };

    //! Public

    //? Find All or Some Transfers by Query Parameters
    public static find = async (params: RootFilterQuery<ITransfer>): Promise<ITransfer[]> => {
        const transfers: ITransfer[] = await TransferSchema.find(params);

        if (transfers.length === 0) throw boom.notFound('Transferencias no encontradas');

        return transfers;
    };

    //? Find Transfer by Id
    public static findById = async (id: string): Promise<ITransfer> => {
        const transfer: ITransfer | null = await TransferSchema.findById(id);

        if (!transfer) throw boom.notFound('Transferencia no encontrada');

        return transfer;
    };

    //? Create a new Transfer
    public static create = async (data: Partial<TransferEntry>): Promise<ITransfer> => {
        await this.validations(data);
        
        const transfer: ITransfer = await TransferSchema.create(data);

        return transfer;
    };


    //? Update Transfer by Id
    public static update = async (id: string, data: Partial<TransferEntry>): Promise<ITransfer> => {
        await this.validations(data);
        
        const transfer: ITransfer | null = await TransferSchema.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!transfer) throw boom.notFound('Transferencia no encontrada');
        
        return transfer;
    };


    //? Delete Transfer by Id
    public static delete = async (id: string): Promise<ITransfer> => {
        const transfer: ITransfer | null = await TransferSchema.findByIdAndDelete(id);

        if (!transfer) throw boom.notFound('Transferencia no encontrada');
        
        return transfer;
    };
}


export default Transfer;