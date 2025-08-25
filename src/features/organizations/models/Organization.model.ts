import boom from '@hapi/boom';

import User from '../../users/models/User.model';
import OrganizationSchema from "../schemas/Organization.schema";
import IOrganization from "../interfaces/Organization.interfaces";
import OrganizationQueryParams from "../interfaces/OrganizationQueryParams";

import { USER_TEMPLATE } from '../../../shared/utils/lib/PublicFields';



class Organization {
    //! Private

    //? Validate Organization name
    public static validateName = async (name: string): Promise<void> => {
        const organization: IOrganization | null = await OrganizationSchema.findOne({ name });

        if (organization) throw boom.conflict(`La Organizacion ${name} ya se encuentra registrada`);
    };


    //? Validate Data
    private static validations = async (data: Partial<IOrganization>): Promise<void> => {
        const validations: Promise<any>[] = [];

        if (data.name) 
            validations.push(this.validateName(data.name));

        if (data.director) 
            validations.push(User.findById(data.director.toString(), false));

        await Promise.all(validations);
    };

    //! Public

    //? Find All organizations or some by Query parameters
    public static find = async (params: Partial<OrganizationQueryParams>): Promise<IOrganization[]> => {
        const organizations: IOrganization[] = await OrganizationSchema.find(params)
            .populate({ path: 'director', select: USER_TEMPLATE });

        if (organizations.length === 0) throw boom.notFound('Organizaciones no encontradas');

        return organizations;
    };


    //? Find Organization by Id
    public static findById = async (id: string): Promise<IOrganization> => {
        const organization: IOrganization | null = await OrganizationSchema.findById(id)
            .populate({ path: 'director', select: USER_TEMPLATE });
        
        if (!organization) throw boom.notFound('Organización no encontrada');

        return organization;
    };


    //? Create new Organization
    public static create = async (data: IOrganization): Promise<IOrganization> => {
        await this.validations(data);

        const newOrg: IOrganization = await OrganizationSchema.create(data);

        const organization: IOrganization = await OrganizationSchema.populate(
            newOrg, 
            { 
                path: 'director', 
                select: Object.keys(USER_TEMPLATE).join(' ') 
            }
        );

        return organization;
    };


    //? Update Organization by id
    public static update = async (id: string, data: Partial<IOrganization>): Promise<IOrganization> => {
        await this.validations(data);

        const newOrg: IOrganization | null = await OrganizationSchema.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!newOrg) throw boom.notFound('Organización no encontrada');

        const organization: IOrganization = await OrganizationSchema.populate(
            newOrg, 
            { 
                path: 'director', 
                select: Object.keys(USER_TEMPLATE).join(' ') 
            }
        );

        return organization;
    };

    //? Enable / Disable Organization
    public static enableDisable = async (id: string, enabled: boolean): Promise<IOrganization> => {
        const organization: IOrganization = await this.update(id, { enabled });
        return organization;
    };
};

export default Organization;