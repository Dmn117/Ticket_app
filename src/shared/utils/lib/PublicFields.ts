import IUser from "../../../features/users/interfaces/User.interfaces";



export const USER_TEMPLATE: Partial<Record<keyof IUser, number>> = {   
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    role: 1,
    enabled: 1,
    avatar: 1,
    boss: 1,
    permissions: 1,
    createdAt: 1,
    updatedAt: 1
};




export const SHORT_USER: Partial<Record<keyof IUser, number>> = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    avatar: 1,
};