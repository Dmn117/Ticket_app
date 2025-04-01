import boom from '@hapi/boom';
import mongoose, { FilterQuery, Types } from "mongoose";

import PermissionGroupSchema from "../schemas/PermissionGroup.schema";
import { DEFAULT_PG_PROFILE } from '../../../shared/config/constants';
import { IPermissionGroup, PermissionGroupEntry } from "../interfaces/PermissionGroup.interfaces";


class PermissionGroup {
    //! Private

    //? Validate Duplicates
    private static validateDuplicates = async (profile: string, id?: string): Promise<void> => {
        const exists: IPermissionGroup | null = await PermissionGroupSchema.findOne({ profile });

        if (exists && (!id || !exists._id.equals(id))) {
            throw boom.conflict('El nombre de perfil ya se encuentra en uso');
        }
    };

    //? Generate default profile name
    private static defaultProfile = async (): Promise<string> => {
        const count = await PermissionGroupSchema.countDocuments({
            profile: { $regex: DEFAULT_PG_PROFILE, $options: 'i' }
        });

        return `${DEFAULT_PG_PROFILE}${count || ''}`;
    };

    //? Validate Data Entry
    private static validate = async (data: Partial<PermissionGroupEntry>, id?: string): Promise<void> => {
        const profile = data.profile || await this.defaultProfile();

        await this.validateDuplicates(profile, id);

        data.profile = profile;
    };

    //! Public

    //? Find all or some Permission Group Record by FilterQuery
    public static find = async (params: FilterQuery<IPermissionGroup>): Promise<IPermissionGroup[]> => {
        const permissionGroup: IPermissionGroup[] = await PermissionGroupSchema.find(params);

        if (permissionGroup.length === 0) throw boom.notFound('Grupos de permisos no encontrados');
        
        return permissionGroup;
    };


    //? Find Permission Group by Id
    public static findById = async (id: string): Promise<IPermissionGroup> => {
        const permissionGroup: IPermissionGroup | null = await PermissionGroupSchema.findById(id);
        
        if (!permissionGroup) throw boom.notFound('Grupo de permisos no encontrado');

        return permissionGroup;
    };


    //? Find Permission Group by Profile Name
    public static findByProfile = async (profile: string): Promise<IPermissionGroup> => {
        const permissionGroup: IPermissionGroup | null = await PermissionGroupSchema.findOne({ profile });
        
        if (!permissionGroup) throw boom.notFound('Grupo de permisos no encontrado');

        return permissionGroup;
    };


    //? Validate if a Permission Group exists
    public static exists = async (field: string, value: string): Promise<mongoose.Types.ObjectId> => {
        const permissionGroup = await PermissionGroupSchema.exists({ [field]: value });

        if (!permissionGroup) throw boom.notFound('Grupo de permisos no encontrado');

        return permissionGroup._id;
    };


    //? Create a new Permission Group
    public static create = async (data: Partial<PermissionGroupEntry>): Promise<IPermissionGroup> => {
        await this.validate(data);

        return await PermissionGroupSchema.create(data);
    };


    //? Update Permission Group by Id
    public static update = async (id: string, data: Partial<PermissionGroupEntry>): Promise<IPermissionGroup> => {
        data.profile && await this.validate(data, id);

        const permissionGroup: IPermissionGroup | null = await PermissionGroupSchema.findByIdAndUpdate(
            id, 
            data,
            { new: true }
        );

        if (!permissionGroup) throw boom.notFound('Grupo de permisos no encontrado');

        return permissionGroup;
    };


    //? Validate If Permission Group Exists
    public static validateExistence = async (data: Partial<PermissionGroupEntry> | string): Promise<Types.ObjectId> => {
        let permissionGroup: Types.ObjectId | null;

        if (typeof data === 'string') {
            if (mongoose.isValidObjectId(data)) {
                permissionGroup = await PermissionGroup.exists('_id', data)
            }
            else {
                permissionGroup = await PermissionGroup.exists('profile', data);
            }
        }
        else {
            permissionGroup = (await PermissionGroup.create(data))._id;
        }

        return permissionGroup;
};
}


export default PermissionGroup;