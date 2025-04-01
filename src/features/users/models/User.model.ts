import bcrypt from 'bcrypt';
import mongoose, { FilterQuery, PopulateOptions } from 'mongoose';
import boom, { isBoom } from '@hapi/boom';
import { SentMessageInfo } from 'nodemailer';

import UserSchema from '../schemas/User.schema';
import SMTP from '../../../shared/services/email.service';
import CustomError from '../../../shared/interfaces/CustomError';
import PermissionGroup from '../../permissionGroups/models/PermissionGroup';

import { UserCounters } from '../../../shared/config/enumerates';
import IUser, { ShortUser, UserEntry, UserWithPopulate } from "../interfaces/User.interfaces";
import { accountConfirmationTemplate, verificationCodeTemplate } from '../../../shared/config/pages';
import { generateVerificationCode, calculateCodeExirationDate } from '../../../shared/utils/lib/VerificationCode';
import { FRONTEND_URL, HASH_ROUNDS, MAX_VALIDATION_ATTEMPTS, SMTP_USER, VCODE_EXP, VCODE_FIRST_EXP, VCODE_LENGTH } from '../../../shared/config/constants';
import File from '../../files/models/File.model';
import { USER_TEMPLATE } from '../../../shared/utils/lib/PublicFields';



class User {
    //! ↓Private

    //? Public User Template
    private static PUBLIC_FIELDS = USER_TEMPLATE;
    

    //? Populate Options
    private static populateOptions: PopulateOptions = {
        path: 'permissions',
        match: { enabled: true }
    };

    //? Generate hash for the password
    private static generatePassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, HASH_ROUNDS);
    };

    //? Compare new password whith old password
    private static comparePassword = async (newPassword: string, oldPassword: string): Promise<boolean> => {
        return await bcrypt.compare(newPassword, oldPassword);
    };


    //? Validate Duplicate Keys
    private static async validateDuplicateKey(field: string, value: string, id?: string): Promise<void> {
        const exists = await UserSchema.exists({ [field]: value });
    
        if (!exists || exists._id.toHexString() === id) return;
    
        throw boom.conflict(`El campo "${field.toUpperCase()}: ${value}" que intenta asociar ya se encuentra registrado`);
    };

    //? Validate if permissions exists
    private static validatePermissions = async (data: Partial<UserEntry>): Promise<void> => {
        if (!data.permissions) throw boom.badRequest('El grupo de permisos no puede ser nulo o vacio');
        
        data.permissions = (await PermissionGroup.validateExistence(data.permissions)).toHexString();
    };

    //? Validate if the new password is the same as the old one
    private static validatePassword = async (id: string, data: Partial<UserEntry>): Promise<void> => {
        const fullUser: IUser = await this.findById(id, true);

        if (!data.password) throw boom.conflict('La contraseña no puede ir vacia');
        
        const isMatch: boolean = await this.comparePassword(data.password, fullUser.password);

        if (isMatch) throw boom.conflict('La nueva contraseña no puede ser igual a la anterior');

        data.password = await this.generatePassword(data.password);
    };

    //? Validation Data
    private static validations = async (data: Partial<UserEntry>, id?: string): Promise<void> => {
        const validations: Promise<any>[] = [];

        if (data.email) {
            data.email = data.email.toLowerCase();
            validations.push(this.validateDuplicateKey('email', data.email, id));
        }

        if (data.permissions) 
            validations.push(this.validatePermissions(data));

        if (data.avatar)
            validations.push(File.exists('_id', data.avatar));

        if (data.boss)
            validations.push(this.exists('_id', data.boss));

        if (id && data.password) 
            validations.push(this.validatePassword(id, data));

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
            subject: 'Confirmación de cuenta | Ticket Application',
            html
        });

        return response;
    };


    private static validationFailed = async (user: IUser): Promise<void> => {
        if (user.validationAttempts >= MAX_VALIDATION_ATTEMPTS-1) 
            await this.enableDisable(user._id.toHexString(), false);

        await this.increaseCounter(user._id.toHexString(), UserCounters.validationAttempts);
    };


    //! ↓Public

    //? Find Users by Query Parameters
    public static find = async (params: FilterQuery<IUser>, full: boolean): Promise<IUser[]> => {
        let users: IUser[] = [];

        if (full) users = await UserSchema.find(params).populate(this.populateOptions);
        else users = await UserSchema.find(params, this.PUBLIC_FIELDS).populate(this.populateOptions);

        if (users.length === 0) throw boom.notFound('Usuarios no encontrados');

        return users;
    };


    //? Find User by Id
    public static findById = async (id: string, full: boolean): Promise<IUser> => {
        let user: IUser | null = null;

        if (full) user = await UserSchema.findById(id).populate(this.populateOptions);
        else user = await UserSchema.findById(id, this.PUBLIC_FIELDS).populate(this.populateOptions);

        if (!user) throw boom.notFound('Usuario no encontrado');

        return user;
    };


    //? Find User by Email
    public static findByEmail = async (email: string, full: boolean): Promise<IUser> => {
        let user: IUser | null = null;

        if (full) user = await UserSchema.findOne({ email }).populate(this.populateOptions);
        else user = await UserSchema.findOne({ email }, this.PUBLIC_FIELDS).populate(this.populateOptions);

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
    public static getShortUser = (user: IUser | UserWithPopulate): ShortUser => {
        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            enabled: user.enabled,
            avatar: user.avatar,
            boss: user.boss,
            permissions: user.permissions,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    };


    //? Create a new User
    public static create = async (data: UserEntry): Promise<Partial<IUser>> => {
        await this.validations(data);

        const user: IUser = await UserSchema.create({ 
            ...data, 
            password: await this.generatePassword(data.password), 
            codeExpirationDate: calculateCodeExirationDate(VCODE_FIRST_EXP)
        });

        this.sendConfirmationMail(
            user.firstName,
            user.lastName,
            FRONTEND_URL,
            user.email,
            data.password,
            user.verificationCode
        );

        return this.getShortUser(user) as IUser;
    };


    //? Create Users in bulk
    public static createInBulk = async (data: UserEntry[]): Promise<PromiseSettledResult<Partial<IUser>>[]> => {
        const promises: PromiseSettledResult<Partial<IUser>>[] = [];

        for (const user of data) {
            try {
                const newUser = await this.create(user);
                promises.push({ status: 'fulfilled', value: newUser });
            }
            catch (error) {
                let reason: string = '';

                if (isBoom(error)) reason = error.output.payload.message;
                else reason = (error as CustomError).message;

                promises.push({ status: 'rejected', reason })
            }
        }

        return promises;
    };


    //? Update User by Id
    public static update = async (id: string, data: Partial<UserEntry>): Promise<IUser> => {
        await this.validations(data, id);

        const user: IUser | null = await UserSchema.findByIdAndUpdate(
            id, 
            data,
            { 
                new: true, 
                fields: this.PUBLIC_FIELDS 
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
            subject: 'Código de verificación | Ticket Application',
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
            user._id.toHexString(), 
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

        if (isMatch) throw boom.conflict('La nueva contraseña no puede ser igual a la anterior')

        await this.validateVerificationCode(user._id.toHexString(), verificationCode);

        user = await this.update(user._id.toHexString(), { password, validated: true });
        
        return user;
    };


    //? Increase Internal Counter by id
    public static increaseCounter = async (id: string, property: UserCounters): Promise<IUser> => {
        let user: IUser | null = null;

        switch (property) {
            case UserCounters.validationAttempts:
                user = await UserSchema.findByIdAndUpdate(
                    id,
                    { $inc: { validationAttempts: 1 }},
                    { 
                        new: true,
                        fields: this.PUBLIC_FIELDS
                    }
                );
        };

        if (!user) throw boom.notFound('Usuario no encontrado');

        return user;
    };

}


export default User;