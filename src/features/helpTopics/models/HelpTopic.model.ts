import boom from '@hapi/boom';

import HelpTopicSchema from '../schemas/HelpTopic.schema';
import HelpTopicQueryParams from '../interfaces/HelpTopicQueryParams';

import { IHelpTopic } from '../interfaces/HelpTopic.interfaces';
import Department from '../../departments/models/Department.model';


class HelpTopic {

    //! Private

    private static validations = async (data: Partial<IHelpTopic>): Promise<void> => {
        const promises: Promise<any>[] = [];

        if (data.department) promises.push(Department.findById(data.department.toString()));

        await Promise.all(promises);
    };

    //! Public

    //? Find All or some Help Topics by Query Parameters
    public static find = async (params: Partial<HelpTopicQueryParams>): Promise<IHelpTopic[]> => {
        const helpTopic: IHelpTopic[] = await HelpTopicSchema.find(params);
        
        if (helpTopic.length === 0) throw boom.notFound('Temas de ayuda no encontrados');

        return helpTopic;
    };

    //? Find Help Topic by Id
    public static findById = async (id: string): Promise<IHelpTopic> => {
        const helpTopic: IHelpTopic | null = await HelpTopicSchema.findById(id);

        if (!helpTopic) throw boom.notFound('Tema de ayuda no encontrado');

        return helpTopic;
    };

    //? Create a new Help Topic
    public static create = async (data: IHelpTopic): Promise<IHelpTopic> => {
        await this.validations(data);

        const helpTopic: IHelpTopic = await HelpTopicSchema.create(data);
        
        return helpTopic;
    };

    //? Update Help Topic
    public static update = async (id: string, data: Partial<IHelpTopic>): Promise<IHelpTopic> => {
        await this.validations(data);

        const helpTopic: IHelpTopic | null = await HelpTopicSchema.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!helpTopic) throw boom.notFound('Tema de ayuda no encontrado');

        return helpTopic;
    };

    //? Enable or Disable Help Topic by Id
    public static enableDisable = async (id: string, enabled: boolean): Promise<IHelpTopic> => {
        const helpTopic: IHelpTopic = await this.update(id, { enabled });

        return helpTopic;
    };
}


export default HelpTopic;