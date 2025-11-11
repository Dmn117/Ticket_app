import boom from '@hapi/boom';
import { JwtPayload } from 'jsonwebtoken';
import { Types, PopulateOptions, RootFilterQuery } from 'mongoose';

import User from '../../users/models/User.model';
import File from '../../files/models/File.model';
import TicketSchema from '../schemas/Ticket.schema';
import Counter from '../../counters/models/Counter.model';
import Message from '../../messages/models/Message.model';
import SMTP from '../../../shared/services/email.service';
import IFile from '../../files/interfaces/File.interfaces';
import IUser from '../../users/interfaces/User.interfaces';
import Transfer from '../../transfers/models/Transfer.model';
import TicketQueryParams from '../interfaces/TicketQueryParams';
import HelpTopic from '../../helpTopics/models/HelpTopic.model';
import Classifier from '../../classifier/models/Classifier.model';
import Department from '../../departments/models/Department.model';
import IDepartment from '../../departments/interfaces/Department.interfaces';

import { SentMessageInfo } from 'nodemailer';
import { USER_TEMPLATE } from '../../../shared/utils/lib/PublicFields';
import { IMessage } from '../../messages/interfaces/Message.interfaces';
import { IHelpTopic } from '../../helpTopics/interfaces/HelpTopic.interfaces';
import { TrainingData } from '../../classifier/interfaces/Classifier.interfaces';
import { ITransfer, TransferEntry } from '../../transfers/interfaces/Transfer.interfaces';
import { ITicket, TicketEntry, TicketWithPopulate } from '../interfaces/Ticket.interfaces';
import { FRONTEND_URL, MIN_TICKET_RATING, SMTP_USER } from '../../../shared/config/constants';
import { assignedTicketForAgent, assignedTicketForAuthor, ticketClosingTemplate, ticketCreationTemplate } from '../../../shared/config/pages';
import { ModelsWithCounters, Roles, TicketItems, TicketNotificationEMail, TicketStatus, UserCounters } from '../../../shared/config/enumerates';



class Ticket {

    //! Private

    //? Populate Options
    private static populateOptions: PopulateOptions[] = [
        { path: 'owner', select: USER_TEMPLATE },
        { path: 'assignedTo', select: USER_TEMPLATE },
        { path: 'department' },
        { path: 'helpTopic' },
        { 
            path: 'messages', 
            populate: [
                { path: 'owner', select: '_id firstName lastName role avatar' },
                { path: 'attachment', select: '_id originalName' }
            ]
        }
    ];

    //? Execute callbacks in asyncronus and controlled way
    private static async executeCallback(callback: Function): Promise<void> {
        try {
            await callback();
        }
        catch (error) {
            console.log(`Error executing callback: ${error}`);
        }
    }

    //? Validate Data and References
    private static validations = async (data: Partial<TicketEntry>): Promise<any[]> => {
        const promises: Promise<any>[] = [];

        if (data.owner) {
            promises.push(User.findById(data.owner, false));
        }
        if (data.assignedTo) {
            promises.push(User.findById(data.assignedTo, false));
        }
        if (data.department) {
            promises.push(Department.findById(data.department));
        }
        if (data.helpTopic) {
            promises.push(HelpTopic.findById(data.helpTopic));
        }
        if (data.message) {
            promises.push(Message.findById(data.message));
        }
        if (data.file) {
            promises.push(File.findById(data.file, false));
        }
        if (data.transfer) {
            promises.push(Transfer.findById(data.transfer));
        }

        return await Promise.all(promises);
    };

    //? Validate User (Agent) Departments
    private static validateUserDepartments = async (ticket: ITicket, departments: Types.ObjectId[]): Promise<void> => {
        if (ticket.assignedTo) {
            const includeDepartments = await User.validateDepartmentsIncluded(
                ticket.assignedTo.toString(), 
                departments
            );
            
            if (!includeDepartments) {
                ticket.assignedTo = null as any;
                ticket.status = TicketStatus.OPEN;
                ticket.assignedAt = null as any;
                
                this.executeCallback(
                    () => this.sendNotificationMail(ticket._id.toHexString(), TicketNotificationEMail.CREATION)
                );
            }
        }
    };

    //? Delete Items (Messages or Files)
    private static deleteItems = async (
        items: (Types.ObjectId)[], 
        deleteCb: Function
    ): Promise<void> => {
        if (items.length === 0) return;

        const promises: Promise<any>[] = items.map(item => deleteCb(item._id.toHexString()));

        await Promise.allSettled(promises);
    };


    //? Send Mail 
    private static sendMail = async (
        url: string, 
        ticketNumber: string, 
        ticketTitle: string, 
        helpTopic: string,
        description: string,
        email: string,
        template: string,
        subject: string,
        author?: string,
        agent?: string,
    ): Promise<SentMessageInfo> => {
        let html: string = template
            .replace('{{ticketNumber}}', ticketNumber)
            .replace('{{ticketTitle}}', ticketTitle)
            .replace('{{url}}', url)
            .replace('{{helpTopic}}', helpTopic)
            .replace('{{description}}', description);
        
        if (author) html = html.replace('{{author}}', author);
        if (agent) html = html.replace('{{agent}}', agent);

        const response = await SMTP.send({
            from: `MasteryTickets 😎" <${SMTP_USER}>`,
            to: email,
            subject: `${subject} | Tickets`,
            html
        });

        return response;
    };


    private static sendNotificationMail = async (
        id: string,
        type: TicketNotificationEMail
    ): Promise<SentMessageInfo> => {
        const ticket = await this.findById(id, true) as TicketWithPopulate;

        switch (type) {
            case TicketNotificationEMail.CREATION: 
                const users: IUser[] = await User.find({ 
                    departments: { $in: [ticket.department._id.toString() || ''] } 
                }, false);
        
                const emails: string = users.map(user => user.email).join(';');
        
                return await this.sendMail(
                    `${FRONTEND_URL}/tickets/view/${ticket._id.toString()}`,
                    `${ticket.number}`,
                    ticket.title,
                    ticket.helpTopic.name,
                    ticket.description,
                    emails,
                    ticketCreationTemplate,
                    'Nuevo Ticket',
                    `${ticket.owner.firstName} ${ticket.owner.lastName}`
                );
        
            case TicketNotificationEMail.ASIIGNMENT_FOR_AGENT: 
                if (!ticket.assignedTo) throw boom.notFound(`No hay usuario asignado al ticket: ${ticket._id}`);

                return await this.sendMail(
                    `${FRONTEND_URL}/tickets/view/${ticket._id.toString()}`,
                    `${ticket.number}`,
                    ticket.title,
                    ticket.helpTopic.name,
                    ticket.description,
                    ticket.assignedTo.email,
                    assignedTicketForAgent,
                    'Ticket Asignado',
                    `${ticket.owner.firstName} ${ticket.owner.lastName}`
                );
            
            case TicketNotificationEMail.ASSIGNMENT_FOR_AUTHOR: 
                return await this.sendMail(
                    `${FRONTEND_URL}/tickets/view/${ticket._id.toString()}`,
                    `${ticket.number}`,
                    ticket.title,
                    ticket.helpTopic.name,
                    ticket.description,
                    ticket.owner.email,
                    assignedTicketForAuthor,
                    'Ticket Asignado',
                    '',
                    `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                );
            
            case TicketNotificationEMail.CLOSING: 
                if (!ticket.assignedTo) throw boom.notFound(`No hay usuario asignado al ticket: ${ticket._id}`);
                
                return await this.sendMail(
                    `${FRONTEND_URL}/tickets/view/${ticket._id.toString()}`,
                    `${ticket.number}`,
                    ticket.title,
                    ticket.helpTopic.name,
                    ticket.description,
                    ticket.owner.email,
                    ticketClosingTemplate,
                    'Ticket Cerrado',
                    '',
                    `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                );
            
            default: 
                throw boom.conflict('Invalid Ticket Notification Email Option');
        };
    };


    //! Public


    //? Find Tickets by Query Parameters
    public static find = async (params: RootFilterQuery<ITicket>): Promise<ITicket[]> => {
        const tickets: ITicket[] = await TicketSchema.find(params);

        if (tickets.length === 0) throw boom.notFound('Tickets no encontrados');

        return tickets;
    };


    //? Find Ticket by Id
    public static findById = async (id: string, populate: boolean = true): Promise<ITicket | TicketWithPopulate> => {
        let query = TicketSchema.findById(id);

        if (populate) query =query.populate(this.populateOptions);
        
        const ticket: ITicket | TicketWithPopulate | null = await query;
        
        if (!ticket) throw boom.notFound('Ticket no encontrado');

        return ticket;
    };


    //? Get Training Data
    public static getDataTraining = async (params: RootFilterQuery<ITicket>): Promise<TrainingData[]> => {
        const tickets = await TicketSchema.find(params).populate({ path: 'helpTopic' }) as TicketWithPopulate[];

        return tickets.map(ticket => ({
            description: ticket.description,
            label: ticket.helpTopic.classification
        }));
    };


    //? Create a new Ticket
    public static create = async (data: Partial<TicketEntry>): Promise<ITicket> => {
        await this.validations(data);

        const number: number =  await Counter.getNextSequenceValue(ModelsWithCounters.Ticket);

        if (!data.description) 
            throw boom.badRequest('No se puede Clasificar un Ticket sin descripción');
        
        const classificationRes = await Classifier.classify(data.description);

        const classification = Number(classificationRes.classification);
        const helpTopic = await HelpTopic.findOne({ classification });

        data.helpTopic = helpTopic._id.toHexString();
        data.department = helpTopic.department._id.toHexString();

        const ticket: ITicket = await TicketSchema.create({...data, number});

        this.executeCallback(
            this.sendNotificationMail.bind(this, ticket._id.toHexString(), TicketNotificationEMail.CREATION)
        );

        return ticket;
    };



    public static createInBulk = async (data: Partial<TicketEntry>[]): Promise<PromiseSettledResult<ITicket>[]> => {
        const promises = await Promise.allSettled(
            data.map(ticket => this.create(ticket))
        );

        return promises;
    };


    //? Update Ticket by Id
    public static update = async (
        id: string, 
        data: Partial<TicketEntry>,
        user: JwtPayload | undefined
    ): Promise<ITicket> => {
        if (!user) throw boom.badRequest('Payload incompleto o mal estructurado: Recupearando User');
        
        let ticket: ITicket = await this.findById(id, false) as ITicket;
        const promises: Promise<any>[] = [];

        if (!ticket) 
            throw boom.notFound('Ticket no encontrado');

        if (
            [TicketStatus.CANCELED, TicketStatus.CLOSED].includes(ticket.status as TicketStatus) 
            && user.role !== Roles.ADMIN
        ){
            throw boom.badRequest('Ticket Cerrado, ya no se puede editar');
        }

        if (!ticket.assignedTo ||
            ( 
                ticket.assignedTo.toString() !== user.sub &&
                user.role !== Roles.ADMIN
            )
        ){
            throw boom.unauthorized('Accion solo permitida para el agente asignado a este ticket');
        }
            
        ticket.title = data.title || ticket.title;
        ticket.description = data.description || ticket.description;
        ticket.status = data.status || ticket.status;
        ticket.justification = data.justification || ticket.justification;

        if ([TicketStatus.CANCELED, TicketStatus.CLOSED].includes(data.status as TicketStatus)) {
            promises.push(User.increaseCounter(ticket.assignedTo.toString(), UserCounters.closedTickets));
            ticket.completedAt = new Date(Date.now());
            this.executeCallback(
                () => this.sendNotificationMail(ticket._id.toString(), TicketNotificationEMail.CLOSING)
            );
        }

        promises.push(ticket.save());

        await Promise.allSettled(promises);

        return ticket;
    };


    //? Add Items (Files, Messages)
    public static addItem = async (
        id: string, 
        data: Partial<TicketEntry>, 
        type: string
    ): Promise<ITicket> => {
        const ticket: ITicket = await this.findById(id, false) as ITicket;
        const ticketId: string = ticket._id.toString();

        const validations = await this.validations(data);

        switch (type) {
            case TicketItems.file: 
                if (data.file) {
                    const file = validations[0] as IFile;
                    const files = new Set([...ticket.files, file._id]);
                    ticket.files = [...files];
                }
                break;

            case TicketItems.message:
                if (data.message) {
                    const message = validations[0] as IMessage;
                    const messages = new Set([...ticket.messages, message._id]);
                    ticket.messages = [...messages];
                }
                break;

            case TicketItems.transfer:
                if (data.transfer) {
                    const transfer = validations[0] as ITransfer;
                    const transfers = new Set([...ticket.transfers, transfer._id]);
                    ticket.transfers = [...transfers];
                }
                break;

            case TicketItems.assignedTo:
                const assignedTo = validations[0] as IUser;

                const transferAssignedData: Partial<TransferEntry> = {
                    nextAssigned: assignedTo._id.toString(),
                    ticket: ticketId
                };

                if (ticket.assignedTo) 
                    transferAssignedData.preAssigned = ticket.assignedTo.toString();

                const transferAssigned = await Transfer.create(transferAssignedData);

                ticket.assignedTo = assignedTo._id;
                ticket.status = TicketStatus.ASSIGNED;
                
                if (!ticket.assignedAt) 
                    ticket.assignedAt = new Date(Date.now());

                ticket.transfers.push(transferAssigned._id);
                break;

            case TicketItems.department:
                const department = validations[0] as IDepartment;

                const transferDepartment = await Transfer.create({
                    nextDepartment: department._id.toString(),
                    preDepartment: ticket.department.toString(),
                    ticket: ticketId
                });

                ticket.department = department._id;
                ticket.transfers.push(transferDepartment._id);

                await this.validateUserDepartments(ticket, [department._id]);

                break;

            case TicketItems.helpTopic:
                const helpTopic = validations[0] as IHelpTopic;

                const transferHelpTopic = await Transfer.create({
                    nextDepartment: helpTopic.department.toString(),
                    nextHelpTopic: helpTopic._id.toString(),

                    preDepartment: ticket.department.toString(),
                    preHelpTopic: ticket.helpTopic.toString(),
                    ticket: ticketId
                });

                ticket.helpTopic = helpTopic._id;
                ticket.department = helpTopic.department;
                ticket.transfers.push(transferHelpTopic._id);

                await this.validateUserDepartments(ticket, [helpTopic.department]);

                break;
        }

        await ticket.save();

        if (type === TicketItems.assignedTo) {
            this.executeCallback(
                () => {
                    this.sendNotificationMail(ticketId, TicketNotificationEMail.ASIIGNMENT_FOR_AGENT),
                    this.sendNotificationMail(ticketId, TicketNotificationEMail.ASSIGNMENT_FOR_AUTHOR)
                }
            );
        }

        return ticket;
    };


    //? Remove Items (Files, Messages)
    public static removeItem = async (
        id: string, 
        data: Partial<TicketEntry>, 
        type: string
    ): Promise<ITicket> => {
        const ticket: ITicket = await this.findById(id, false) as ITicket;

        const validations = await this.validations(data);

        switch (type) {
            case TicketItems.file: 
                if (data.file) {
                    let file = validations[0] as IFile;
                    let indexFile: number = ticket.files.indexOf(file._id);
                    ticket.files.splice(indexFile, 1);
                }
                break;
            case TicketItems.message:
                if (data.message) {
                    let message = validations[0] as IMessage;
                    let indexMessage: number = ticket.messages.indexOf(message._id);
                    ticket.messages.splice(indexMessage, 1);
                }
                break;
            case TicketItems.transfer:
                if (data.transfer) {
                    let transfer = validations[0] as ITransfer;
                    let indexTransfer: number = ticket.transfers.indexOf(transfer._id);
                    ticket.transfers.splice(indexTransfer, 1);
                }
                break;
        }

        await ticket.save();

        return ticket;
    };


    //? Rate Ticket by Id
    public static rateTicket = async (
        id: string, 
        data: Partial<TicketEntry>,
        user: JwtPayload | undefined
    ): Promise<ITicket> => {
        if (!user) throw boom.badRequest('Payload incompleto o mal estructurado: Recupearando User');

        const ticket: ITicket = await this.findById(id, false) as ITicket;

        if (![TicketStatus.CANCELED, TicketStatus.CLOSED].includes(ticket.status as TicketStatus))
            throw boom.conflict('Solo se pude calificar el Ticket hasta que se haya cerrado');

        if (ticket.rating > 0)
            throw boom.locked('Ya has calificado este ticket. Solo se puede calificar una vez');

        if (ticket.owner.toString() !== user.sub && user.role !== Roles.ADMIN) 
            throw boom.unauthorized('Solo el Autor del Ticket lo puede calificar');

        ticket.rating = data.rating || MIN_TICKET_RATING;
        ticket.comment = data.comment || '';

        await Promise.allSettled([
            ticket.save(),
            User.calculateAverage(ticket.assignedTo.toString())
        ]);

        return ticket;
    };


    //? Delete Ticket and its Files and Messages
    public static delete = async (id: string): Promise<ITicket> => {
        const ticket: ITicket = await this.findById(id, false) as ITicket;

        await Promise.allSettled([
            this.deleteItems(ticket.files, File.delete),
            this.deleteItems((ticket.messages as Types.ObjectId[]), Message.delete),
            this.deleteItems(ticket.transfers, Transfer.delete)
        ]);

        await TicketSchema.findByIdAndDelete(id);

        return ticket;
    };
}


export default Ticket;