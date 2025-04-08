import { Server, Socket as SocketIO } from "socket.io";

import Ticket from "../models/Ticket.model";
import CustomSocket from "../../../shared/interfaces/CustomSocket";

import { ITicket } from "../interfaces/Ticket.interfaces";
import { Roles, SocketEvents } from "../../../shared/config/enumerates";
import { handleSocketError } from "../../../shared/middlewares/error.handler";



class TicketSocket {
    //! Private

    private static joinTicket = async (socket: CustomSocket): Promise<void> => {
        try {            
            socket.on(SocketEvents.TicketJoin, (res) => {
                socket.join(res.ticket);
                socket.emit(SocketEvents.Join, `Ticket: ${res.ticket}`);
            });
        }
        catch (error) {
            handleSocketError(socket, error as Error);
        }
    };


    private static leaveTicket = async (socket: CustomSocket): Promise<void> => {
        try {
            socket.on(SocketEvents.TicketLeave, (res) => {
                socket.leave(res.ticket);
                socket.emit(SocketEvents.Leave, `Ticket: ${res.ticket}`);
            });
        }
        catch (error) {
            handleSocketError(socket, error as Error);
        }
    };


    private static joinChats = async (socket: CustomSocket): Promise<void> => {
        try {
            let tickets: ITicket[] = [];

            if (socket.userInfo.role === Roles.USER)
                tickets = await Ticket.find({ owner: socket.userInfo.id });
            else {
                const allTickets = await Promise.all([
                    Ticket.find({ owner: socket.userInfo.id }),
                    Ticket.find({ assignedTo: socket.userInfo.id })
                ]);
                
                tickets = [...allTickets[0], ...allTickets[1]] ;
            }
                

            const ticketIds: string[] = tickets.map(ticket => ticket._id.toString());

            socket.join(ticketIds);
            setTimeout(
                () => socket.emit(SocketEvents.Join, `Ticket Chats: ${ticketIds}`),
                5000
            );
            // socket.emit(SocketEvents.Join, `Ticket Chats: ${ticketIds}`);
        }
        catch (error) {
            handleSocketError(socket, error as Error);
        }
    };


    private static ticketChange = async (socket: CustomSocket): Promise<void> => {
        try {
            socket.on(SocketEvents.TicketChange, (res) => {
                socket.to(res.ticket._id).emit(SocketEvents.TicketChange, res);
            });
        }
        catch (error) {
            handleSocketError(socket, error as Error);
        }
    };
    
    //! Public 

    public static setupEventHandlers = async (socket: SocketIO): Promise<void> => {
        await this.joinTicket(socket as CustomSocket);
        await this.leaveTicket(socket as CustomSocket);
        await this.joinChats(socket as CustomSocket);
        await this.ticketChange(socket as CustomSocket);
    };
}


export default TicketSocket;