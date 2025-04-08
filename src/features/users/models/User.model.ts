import bcrypt from 'bcrypt';
import boom from '@hapi/boom';
import mongoose from 'mongoose';
import { SentMessageInfo } from 'nodemailer';

import UserSchema from '../schemas/User.schema';
import IUser, { UserPublicFields } from "../interfaces/User.interfaces";
import Ticket from '../../tickets/models/Ticket.model';
import SMTP from '../../../shared/services/email.service';
import UserQueryParams from "../interfaces/UserQueryParams";
import Department from '../../departments/models/Department.model';
import IDepartment from '../../departments/interfaces/Department.interfaces';

import { ITicket } from '../../tickets/interfaces/Ticket.interfaces';
import { USER_TEMPLATE } from '../../../shared/utils/lib/PublicFields';
import { TicketStatus, UserCounters } from '../../../shared/config/enumerates';
import { accountConfirmationTemplate, verificationCodeTemplate } from '../../../shared/config/pages';
import { generateVerificationCode, calculateCodeExirationDate } from '../../../shared/utils/lib/VerificationCode';
import { FRONTEND_URL, HASH_ROUNDS, MAX_VALIDATION_ATTEMPTS, SMTP_USER, VCODE_EXP, VCODE_FIRST_EXP, VCODE_LENGTH } from '../../../shared/config/constants';


class User {
    //! ↓Private

    //? Public User Template
    private static publicAttributes = USER_TEMPLATE;

    //? Generate hash for the password
    private static generatePassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, HASH_ROUNDS);
    };

    //? Compare new password whith old password
    private static comparePassword = async (newPassword: string, oldPassword: string): Promise<boolean> => {
        return await bcrypt.compare(newPassword, oldPassword);
    };

    //? Validate if email is already in use
    private static validateEmail = async (email: string): Promise<void> => {
        const user: IUser | null = await UserSchema.findOne({ email });

        if (user) throw boom.conflict('El Email proporcionado ya se encuentra en uso')
    };

    //? Validate Department Ids 
    private static validateDepartments = async (departments: mongoose.Types.ObjectId[]): Promise<void> => {
        const promises: Promise<IDepartment>[] = departments.map(department => {
            return Department.findById(department.toString())
        });

        await Promise.allSettled(promises);
    };

    //? Validation Data
    private static validations = async (data: Partial<IUser>): Promise<void> => {
        const validations: Promise<any>[] = [];

        if (data.email) 
            validations.push(this.validateEmail(data.email));

        if (data.departments) 
            validations.push(this.validateDepartments(data.departments));

        await Promise.all(validations);
    };

    //? Send Confirmation Mail 
    private static sendConfirmationMail = async (
        firstName: string, 
        lastName: string, 
        url: string, 
        email: string,
        password: string,
        verificationCode: string
    ): Promise<SentMessageInfo> => {
        const html: string = accountConfirmationTemplate
            .replace('{{firstName}}', firstName)
            .replace('{{lastName}}', lastName)
            .replace('{{url}}', url)
            .replace('{{email}}', email)
            .replace('{{password}}', password)
            .replace('{{verificationCode}}', verificationCode);
        

        const response = await SMTP.send({
            from: `Whatever 😎" <${SMTP_USER}>`,
            to: email,
            subject: 'Confirmación de cuenta | Tickets',
            html
        });

        return response;
    };


    private static validationFailed = async (user: IUser): Promise<void> => {
        if (user.validationAttempts >= MAX_VALIDATION_ATTEMPTS-1) 
            await this.enableDisable(user._id.toString(), false);

        await this.increaseCounter(user._id.toString(), UserCounters.validationAttempts);
    };

    //? Get Ticket Rating Average 
    private static ticketRateAverage = async (user: IUser): Promise<number> => {
        const tickets: ITicket[] = await Ticket.find({assignedTo: user._id.toString()});

        user.closedTickets = tickets.filter(ticket => [TicketStatus.CLOSED, TicketStatus.CANCELED].includes(ticket.status as TicketStatus)).length;
        user.evaluatedTickets = tickets.filter(ticket => ticket.rating > 0).length;
        
        return tickets.reduce((acc, ticket) => { 
            return acc + ticket.rating > 0 ? acc + ticket.rating : acc;
         }, 0) / user.closedTickets;
    };


    //! ↓Public

    //? Find Users by Query Parameters
    public static find = async (params: Partial<UserQueryParams>, full: boolean): Promise<IUser[]> => {
        let users: IUser[] = [];

        if (full) users = await UserSchema.find(params);
        else users = await UserSchema.find(params, this.publicAttributes);

        if (users.length === 0) throw boom.notFound('Usuarios no encontrados');

        return users;
    };


    //? Find User by Id
    public static findById = async (id: string, full: boolean): Promise<IUser> => {
        let user: IUser | null = null;

        if (full) user = await UserSchema.findById(id);
        else user = await UserSchema.findById(id, this.publicAttributes);

        if (!user) throw boom.notFound('Usuario no encontrado');

        return user;
    };


    //? Find User by Email
    public static findByEmail = async (email: string, full: boolean): Promise<IUser> => {
        let user: IUser | null = null;

        if (full) user = await UserSchema.findOne({ email });
        else user = await UserSchema.findOne({ email }, this.publicAttributes);

        if (!user) throw boom.notFound('Usuario no encontrado');

        return user;
    };

    //? Validate if a User exists by Id
    public static exists = async (field: string, value: string): Promise<mongoose.Types.ObjectId> => {
        const user = await UserSchema.exists({ [field]: value });

        if (!user) throw boom.notFound('Usuario no encontrado');

        return user._id;
    };


    //? Get Short User
    public static getShortUser = (user: IUser): UserPublicFields => {
        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            specialPermissions: user.specialPermissions,
            rating: user.rating,
            closedTickets: user.closedTickets,
            evaluatedTickets: user.evaluatedTickets,
            reporter: user.reporter,
            enabled: user.enabled,
            avatar: user.avatar,
            boss: user.boss,
            departments: user.departments,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    };


    //? Create a new User
    public static create = async (data: IUser): Promise<Partial<IUser>> => {
        await this.validations(data);

        const password: string = await this.generatePassword(data.password);
        const codeExpirationDate: Date = calculateCodeExirationDate(VCODE_FIRST_EXP);

        const user: IUser = await UserSchema.create({ 
            ...data, 
            password, 
            codeExpirationDate 
        });

        this.sendConfirmationMail(
            user.firstName,
            user.lastName,
            FRONTEND_URL,
            user.email,
            data.password,
            user.verificationCode
        );

        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            reporter: user.reporter,
            enabled: user.enabled,
            avatar: user.avatar,
            boss: user.boss,
            departments: user.departments,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    };


    //? Create Users in bulk
    public static createInBulk = async (data: IUser[]): Promise<PromiseSettledResult<Partial<IUser>>[]> => {
        const promises = await Promise.allSettled(
            data.map(user => this.create(user))
        );

        return promises;
    };


    //? Update User by Id
    public static update = async (id: string, data: Partial<IUser>): Promise<IUser> => {
        await this.validations(data);
        
        if (data.password) {
            const fullUser: IUser = await this.findById(id, true);
            const isMatch: boolean = await this.comparePassword(data.password, fullUser.password);

            if (isMatch) throw boom.conflict('La nueva contraña no puede ser igual a la anterior')

            data.password = await this.generatePassword(data.password);
        }

        const user: IUser | null = await UserSchema.findByIdAndUpdate(
            id, 
            data, 
            { 
                new: true, 
                fields: this.publicAttributes 
            }
        );

        if (!user) throw boom.notFound('Usuario no encontrado');

        return user;
    };


    //? Enabled | Disable User by Id
    public static enableDisable = async (id: string, enabled: boolean): Promise<IUser> => {
        const user: IUser | null = await this.update(id, { enabled });
        return user;
    };

    
    //? Send Verification Code
    public static sendVerificationCode = async (email: string): Promise<SentMessageInfo> => {
        const user: IUser = await this.findByEmail(email, false);
        const verificationCode: string = generateVerificationCode(VCODE_LENGTH);
        const codeExpirationDate: Date = calculateCodeExirationDate(VCODE_EXP);

        const html: string = verificationCodeTemplate
            .replace('{{verificationCode}}', verificationCode)
            .replace('{{expiresIn}}', `${VCODE_EXP}`)
        
        const response = await SMTP.send({
            from: `Whatever 😎" <${SMTP_USER}>`,
            to: user.email,
            subject: 'Código de verificación | Tickets',
            html
        });

        user.verificationCode = verificationCode;
        user.codeExpirationDate = codeExpirationDate;
        await user.save();

        return response;
    };


    //? Validate verification code
    public static validateVerificationCode = async (id: string, verificationCode: string): Promise<boolean> => {
        const user: IUser = await this.findById(id, true);

        if (
            user.verificationCode === verificationCode && 
            user.codeExpirationDate > new Date(Date.now()) && 
            user.enabled
        ) {
            user.verificationCode = generateVerificationCode(VCODE_LENGTH + 1);
            user.codeExpirationDate = calculateCodeExirationDate(-1);
            user.validationAttempts = 0;

            await user.save()
            return true;
        }
        else if (user.verificationCode !== verificationCode) {
            await this.validationFailed(user);
            throw boom.badRequest('Codigo de verificacion incorrecto');
        }
        else if (user.codeExpirationDate < new Date(Date.now())) {
            throw boom.resourceGone('Codigo de verificacion expirado');
        }
        else if (!user.enabled) {
            throw boom.forbidden('Cuenta deshabilitada por tu organizacion. Contacta con Soporte Tecnico');
        }

        return false;
    };


    //? Validate User by Id and Verification Code
    public static validateUser = async (email: string, verificationCode: string): Promise<IUser> => {
        const user: IUser = await this.findByEmail(email, false);

        const validated: boolean = await this.validateVerificationCode(
            user._id.toString(), 
            verificationCode
        );

        user.validated = validated;

        await user.save();

        return user;
    };



    //? Change User Password With Verification Code
    public static recoverPassword = async (
        email: string, 
        verificationCode: string, 
        password: string
    ): Promise<IUser> => {
        let user: IUser = await this.findByEmail(email, true);

        const isMatch: boolean = await this.comparePassword(password, user.password);

        if (isMatch) throw boom.conflict('La nueva contraña no puede ser igual a la anterior')

        await this.validateVerificationCode(user._id.toString(), verificationCode);

        user = await this.update(user._id.toString(), { password, validated: true });
        
        return user;
    };


    //? Increase Counter Of Closed Tickets
    public static increaseCounter = async (id: string, property: UserCounters): Promise<IUser> => {
        let user: IUser | null = null;

        switch (property) {
            case UserCounters.closedTickets:
                user = await UserSchema.findByIdAndUpdate(
                    id,
                    { $inc: { closedTickets: 1 }},
                    { 
                        new: true,
                        fields: this.publicAttributes
                    }
                );
                break;

            case UserCounters.evaluatedTickets:
                user = await UserSchema.findByIdAndUpdate(
                    id,
                    { $inc: { evaluatedTickets: 1 }},
                    { 
                        new: true,
                        fields: this.publicAttributes
                    }
                );
                break;

            case UserCounters.validationAttempts:
                user = await UserSchema.findByIdAndUpdate(
                    id,
                    { $inc: { validationAttempts: 1 }},
                    { 
                        new: true,
                        fields: this.publicAttributes
                    }
                );
        };

        if (!user) throw boom.notFound('Usuario no encontrado');

        return user;
    };


    //? Calculate average
    public static calculateAverage = async (id: string): Promise<IUser> => {
        const user: IUser = await this.findById(id, false);
        const rating: number = await this.ticketRateAverage(user);

        user.rating = Math.round(rating * 10) / 10;

        await user.save();

        return user;
    };

    //? Validate Departments for current agent
    public static validateDepartmentsIncluded = async (
        id: string, 
        departments: mongoose.Types.ObjectId[]
    ): Promise<boolean> => {
        const user: IUser = await User.findById(id, false);

        return departments.every(department => {
            return user.departments.includes(department)
        });
    }; 
}


export default User;