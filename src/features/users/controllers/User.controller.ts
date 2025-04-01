import Jwt, { JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import { FilterQuery } from "mongoose";
import { Request, Response } from "express";

import User from "../models/User.model";
import IUser from "../interfaces/User.interfaces";
import CustomError from "../../../shared/interfaces/CustomError";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import { JWT_EXP, JWT_PRIVATE_KEY } from "../../../shared/config/constants";


class UserController {
    //! Private ↓
    
    //? Assemble Query Parameters
    private static assembleQueryParams = (req: Request): FilterQuery<IUser> => {
        const params: FilterQuery<IUser> = {};

        if (req.query.firstName)
            params.firstName = { $regex: req.query.firstName.toString(), $options: 'i' };

        if (req.query.lastName)
            params.lastName = { $regex: req.query.lastName.toString(), $options: 'i' };

        if (req.query.email) params.email = req.query.email.toString();

        if (req.query.role) {
            if (!req.query.includesRoles || req.query.includesRoles === 'true'){
                params.role = { $in: req.query.role.toString().split(', ')};
            }
            else {
                params.role = { $nin: req.query.role.toString().split(', ')};
            }
        }

        if (req.query.ratingLte) {
            params.rating = params.rating 
                ? {...params.rating, $lte: Number(req.query.ratingLte.toString()) }
                : { $lte: Number(req.query.ratingLte.toString()) }
        }

        if (req.query.ratingGte) {
            params.rating = params.rating 
                ? {...params.rating, $gte: Number(req.query.ratingGte.toString()) }
                : { $gte: Number(req.query.ratingGte.toString()) }
        }

        if (req.query.reporter) params.reporter = req.query.reporter.toString() === 'true';
        
        if (req.query.validated) params.validated = req.query.validated.toString() === 'true';

        if (req.query.enabled) params.enabled = req.query.enabled.toString() === 'true';

        if (req.query.boss) params.boss = req.query.boss.toString();

        if (req.query.departments) {
            if (!req.query.includesDepartments || req.query.includesDepartments === 'true') {
                params.departments = { $in: req.query.departments.toString().split(', ') }
            }
            else {
                params.departments = { $nin: req.query.departments.toString().split(', ') }
            }
        }

        return params;
    };

    //! Public ↓

    //* GET Methods

    //? Get Users by Query Parameters
    public static getUsers = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: FilterQuery<IUser> = this.assembleQueryParams(req);
            const users: IUser[] = await User.find(params, false)

            res.status(200).json({
                message: 'Usuarios recuperados exitosamente',
                users
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Get User by Id
    public static getUserById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const user: IUser = await User.findById(id, false);

            res.status(200).json({
                message: 'Usuario recuperado exitosamente',
                user
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //* POST Methods

    //? Login User and Genereta Access Token (JWT)
    public static login = (req: Request, res: Response, next: ErrorHandler): void => {
        try {
            const user = req.user as IUser;
            
            const payload: JwtPayload = { sub: user._id.toString() };

            const token = Jwt.sign(payload, JWT_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: (JWT_EXP as StringValue)  });

            res.status(200).json({
                message: 'Usuario inicio sesion exitosamente',
                user,
                token
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Create a New User record
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const user: Partial<IUser> = await User.create(body);

            res.status(201).json({
                message: 'Usuario registrado exitosamene',
                user
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Create a New User record
    public static createInBulk = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const users: PromiseSettledResult<Partial<IUser>>[] = await User.createInBulk(body);

            if (users.find(item => item.status === 'fulfilled')) {
                res.status(201).json({
                    message: 'Usuarios registrados',
                    users
                });
            }
            else {
                res.status(400).json({
                    message: 'Usuarios no registrados, favor de validar los datos de entrada',
                    users
                });
            }
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Send a new verification code
    public static sendVerificationCode = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const email: string = req.params.email;
            const response = await User.sendVerificationCode(email);

            res.status(200).json({
                message: 'Codigo de verificacion solicitado',
                response
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Validate verification code
    public static validateVerificationCode = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const status: boolean = await User.validateVerificationCode(id, body.verificationCode);

            res.status(200).json({
                message: 'Codigo de verificacion validado exitosamente',
                status
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //* PUT Methods

    //? Update User by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;

            const user: IUser = await User.update(id, body);

            res.status(200).json({
                message: 'Usuario Actualizado exitosamente',
                user
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //* PATCH Methods

    //? Enabled User by Id
    public static enabled = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;

            const user: IUser = await User.enableDisable(id, true);

            res.status(200).json({
                message: 'Usuario habilitado exitosamente',
                user
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Disabled User by Id
    public static disbled = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;

            const user: IUser = await User.enableDisable(id, false);

            res.status(200).json({
                message: 'Usuario deshabilitado exitosamente',
                user
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Validate User by Id and verification code
    public static validateUser = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const email: string = req.params.email;

            const user: IUser = await User.validateUser(email, body.verificationCode);

            res.status(200).json({
                message: 'Usuario validado exitosamente',
                user
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Change User Password With Verification Code
    public static recoverPassword = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const email: string = req.params.email;

            const user: IUser = await User.recoverPassword(email, body.verificationCode, body.password);

            res.status(200).json({
                message: 'Contraseña actualizada exitosamente',
                user
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };
}

export default UserController;