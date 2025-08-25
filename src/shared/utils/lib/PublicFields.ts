import IUser, { UserPublicFields } from "../../../features/users/interfaces/User.interfaces";




export const SHORT_USER: Partial<Record<keyof IUser, number>> = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    avatar: 1,
};


export const USER_TEMPLATE: Record<keyof UserPublicFields, number> = {   
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    role: 1,
    specialPermissions: 1,
    rating: 1,
    closedTickets: 1,
    evaluatedTickets: 1,
    reporter: 1,
    enabled: 1,
    avatar: 1,
    boss: 1,
    departments: 1,
    createdAt: 1,
    updatedAt: 1
};