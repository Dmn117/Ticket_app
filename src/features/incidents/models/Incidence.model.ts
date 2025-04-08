import boom from '@hapi/boom';

import User from '../../users/models/User.model';
import IncidentSchema from "../schemas/Incidence.schema";
import IncidentQueryParams from "../interfaces/IncidentQueryParams";

import { IIncidence, IncidenceEntry, IncidenceWithPopulate } from '../interfaces/Incident.interfaces';
import IUser from '../../users/interfaces/User.interfaces';


class Incidence {

    //! Private 

    //? Validations Data and References
    private static validations = async (data: Partial<IncidenceEntry>): Promise<any[]> => {
        const promises: Promise<any>[] = [];

        if (data.author) {
            promises.push(User.findById(data.author, false));
        }

        if (data.agent) {
            promises.push(User.findById(data.agent, false));
        }

        return await Promise.all(promises);
    };

    //! Public 

    //? Find Incidents by Query Parameters
    public static find = async (params: Partial<IncidentQueryParams>): Promise<(IIncidence | IncidenceWithPopulate)[]> => {
        const incidents: (IIncidence | IncidenceWithPopulate)[] = await IncidentSchema.find(params)
            .populate({
                path: 'author',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'agent',
                select: '_id firstName lastName email'
            });

        if (incidents.length === 0) throw boom.notFound('Incidencias no encontradas');

        return incidents;
    };


    //? Find Incidents by Boss Id
    public static findByBossId = async (boss: string): Promise<(IIncidence | IncidenceWithPopulate)[]> => {
        const agents: IUser[] = await User.find({ boss }, false);

        const agentIds: string[] = agents.map(agent => agent._id.toString());

        const incidents: (IIncidence | IncidenceWithPopulate)[] = await this.find({ agent: { $in: agentIds } });

        return incidents;
    };


    //? Find Incidence by Id
    public static findById = async (id: string): Promise<IIncidence | IncidenceWithPopulate> => {
        const incidence: IIncidence | IncidenceWithPopulate | null = await IncidentSchema.findById(id)
            .populate({
                path: 'author',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'agent',
                select: '_id firstName lastName email'
            });
    
        if (!incidence) throw boom.notFound('Incidencia no encontrada');

        return incidence;
    };


    //? Create a new Incidence
    public static create = async (data: Partial<IncidenceEntry>): Promise<IIncidence> => {
        await this.validations(data);

        const incidence: IIncidence = await IncidentSchema.create(data);

        return incidence;
    };


    //? Update Incidence by Id
    public static update = async (id: string, data: Partial<IncidenceEntry>): Promise<IIncidence> => {
        const incidence: IIncidence | null = await IncidentSchema.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!incidence) throw boom.notFound('Incidencia no encontrada');

        return incidence;
    };


    //? Delete Incidence by Id
    public static delete = async (id: string): Promise<IIncidence> => {
        const incidence: IIncidence | null = await IncidentSchema.findByIdAndDelete(id);

        if (!incidence) throw boom.notFound('Incidencia no encontrada');

        return incidence;
    };
}


export default Incidence;