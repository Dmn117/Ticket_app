import boom from '@hapi/boom';
import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { Roles, SpecialPermissions } from "../config/enumerates";


export const checkRoles = (...roles: Roles[]) => {

    return (req: Request, res: Response, next: Function): void => {
        const user: JwtPayload | undefined = req.user;

        if (user && roles.includes(user.role)) {
            next();
        }
        else {
            next(boom.unauthorized('Usuario sin permisos para esta accion'));
        }
    };

};



export const checkRolesAndPermissions = (
    roles: Roles[],
    specialPermissions: SpecialPermissions[]
) => {

    return (req: Request, res: Response, next: Function): void => {
        const user: JwtPayload | undefined = req.user;

        if (user &&
            (
                roles.includes(user.role) ||
                user.specialPermissions.some((permission: SpecialPermissions) => {
                    return specialPermissions.includes(permission);
                })
            )
        ) {
            next();
        }
        else {
            next(boom.unauthorized('Usuario sin permisos para esta accion'));
        }
    };

};