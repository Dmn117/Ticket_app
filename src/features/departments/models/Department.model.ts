import boom from '@hapi/boom';
import { QueryOptions } from 'mongoose';

import User from '../../users/models/User.model';
import DepartmentSchema from "../schemas/Department.schema";
import IDepartment from "../interfaces/Department.interfaces";
import DepartmentQueryParams from '../interfaces/DepartmentQueryParams';
import Organization from '../../organizations/models/Organization.model';

import { USER_TEMPLATE } from '../../../shared/utils/lib/PublicFields';


class Department {
    //! Private

    //? Validate Data
    private static validations = async (data: Partial<IDepartment>): Promise<void> => {
        const validations: Promise<any>[] = [];

        if (data.organization) 
            validations.push(Organization.findById(data.organization.toString()));

        if (data.owner) 
            validations.push(User.findById(data.owner.toString(), false));

        await Promise.all(validations);
    };

    //! Public

    //? Find All Departments or some by Query parameters
    public static find = async (
        params: Partial<DepartmentQueryParams>, 
        queryOptions: QueryOptions
    ): Promise<IDepartment[]> => {
        const departments: IDepartment[] = await DepartmentSchema.find(params, null, queryOptions);

        if (departments.length === 0) throw boom.notFound('Departamentos no encontrados');

        return departments;
    };


    //? Find Department by Id
    public static findById = async (id: string): Promise<IDepartment> => {
        const department: IDepartment | null = await DepartmentSchema.findById(id);
        
        if (!department) throw boom.notFound('Departamento no encontrado');

        return department;
    };


    //? Create new Department
    public static create = async (data: IDepartment): Promise<IDepartment> => {
        await this.validations(data);

        const newDepartment: IDepartment = await DepartmentSchema.create(data);

        const department: IDepartment = await DepartmentSchema.populate(
            newDepartment,
            {
                path: 'owner',
                select: Object.keys(USER_TEMPLATE).join(' ')    
            }
        );

        return department;
    };


    //? Update Department by id
    public static update = async (id: string, data: Partial<IDepartment>): Promise<IDepartment> => {
        await this.validations(data);

        const newDepartment: IDepartment | null = await DepartmentSchema.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        const department: IDepartment = await DepartmentSchema.populate(
            newDepartment,
            {
                path: 'owner',
                select: Object.keys(USER_TEMPLATE).join(' ')    
            }
        );

        if (!department) throw boom.notFound('Departamento no encontrado');

        return department;
    };


    //? Enable / Disable Department
    public static enableDisable = async (id: string, enabled: boolean): Promise<IDepartment> => {
        const department: IDepartment = await this.update(id, { enabled });
        return department;
    };
}


export default Department;