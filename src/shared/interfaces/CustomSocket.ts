import { Socket } from "socket.io";

interface UserInfo {
    id: string;
    role: string;
    currentChat: string;
};

interface CustomSocket extends Socket{
    userInfo: UserInfo;
}


export default CustomSocket;