import boom from '@hapi/boom';
import { Server as HttpServer } from "http";
import { Server, Socket as SocketIO } from "socket.io";

import CustomSocket from "../interfaces/CustomSocket";
import User from "../../features/users/models/User.model";
import IUser from "../../features/users/interfaces/User.interfaces";

import { handleSocketError } from "../middlewares/error.handler";
import TicketSocket from '../../features/tickets/sockets/Ticket.socket';
import { SocketEvents } from '../config/enumerates';


class Socket {
    //! Private 

    private static validateUser = async (socket: CustomSocket, id: string): Promise<void> => {
        try {
            const user: IUser = await User.findById(id, true);

            socket.userInfo = { 
                id: user._id.toString(), 
                role: user.role, 
                currentChat: '' 
            };
        } 
        catch (error) {
            handleSocketError(socket, boom.unauthorized('Socket disconnected'));
            socket.disconnect(true);
        }
    };


    private static test = (socket: SocketIO): void => {
        socket.on(SocketEvents.Test, (res) => {
            socket.emit(SocketEvents.Test, res);
        });
    };


    private static disconection = (socket: SocketIO): void => {
        socket.on('disconnect', () => {
            console.log('-------------------------------');
            console.log(`User disconnected: ${socket.id}`);
        });
    };


    private static connection = async (socket: SocketIO): Promise<void> => {
        console.log('-------------------------------');
        console.log(`User connected: ${socket.id}`);

        const userId: string | string[] = Array.isArray(socket.handshake.query.user) 
            ? socket.handshake.query.user[0]
            : socket.handshake.query.user
            || '';

        await this.validateUser(socket as CustomSocket, userId);

        this.test(socket);

        TicketSocket.setupEventHandlers(socket);

        this.disconection(socket);
    };

    //! Public 

    public static io: Server;

    public static initSocket = (server: HttpServer): void => {
        try {
            this.io = new Server(server, { cors: { origin: '*' } });

            this.io.on('connection', Socket.connection);
        }
        catch (error) {
            console.log('Socket initialization error:', error);
        }
    };
}


export default Socket;

