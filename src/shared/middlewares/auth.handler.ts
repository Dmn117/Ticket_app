import boom from '@hapi/boom';
import { Request, Response } from "express";

import Permission from '../../features/permissionGroups/interfaces/PermissionGroup.interfaces';

import { Permissions, Segments,  } from "../config/enumerates";
import { UserWithPopulate } from '../../features/users/interfaces/User.interfaces';


export const validatePermission = (segment: Segments, permission: Permissions, permissions: Permission[]): boolean => {
    const seg = permissions.find(perm => perm.segment === segment);

    return seg 
        ? seg.permissions.includes(permission) 
        : false;
};


export const checkPermission = (segment: Segments, permission: Permissions) => {
    return (req: Request, res: Response, next: Function): void => {
        const user = req.user as UserWithPopulate | undefined;

        if (user && validatePermission(segment, permission, user.permissions.permissions)) {
            next();
        }
        else {
            next(boom.unauthorized('Usuario sin permisos para esta accion'));
        }
    };
};