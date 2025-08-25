import boom from '@hapi/boom';

import HelpTopicSchema from '../schemas/HelpTopic.schema';
import Department from '../../departments/models/Department.model';

import { HelpTopicBase, IHelpTopic } from '../interfaces/HelpTopic.interfaces';
import { RootFilterQuery } from 'mongoose';
import { TrainingData } from '../../classifier/interfaces/Classifier.interfaces';
import Classifier from '../../classifier/models/Classifier.model';
import Counter from '../../counters/models/Counter.model';
import { ModelsWithCounters } from '../../../shared/config/enumerates';


class HelpTopic {

    //! Private

    private static validations = async (data: Partial<HelpTopicBase>): Promise<void> => {
        const promises: Promise<any>[] = [];

        if (data.examples) {
            if (data.examples.length < 2) throw boom.badRequest('Se requieren al menos 2 ejemplos');
            if (data.examples.length > 5) throw boom.badRequest('Se permiten un máximo de 10 ejemplos');
        }

        if (data.department) {
            promises.push(Department.exists('_id', data.department));
        }

        await Promise.all(promises);
    };


    private static toTrainingData = (helpTopic: IHelpTopic): TrainingData[] => {
        return helpTopic.examples.map(example => ({
            description: example,
            label: helpTopic.classification
        }));
    };


    private static train = async (): Promise<void> => {
        try {
            await Classifier.train();
        }
        catch(error) {
            console.log(`Error al entrenar el modelo: ${error}`);
        }
    };

    //! Public

    //? Find All or some Help Topics by Query Parameters
    public static find = async (params: RootFilterQuery<IHelpTopic>): Promise<IHelpTopic[]> => {
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


    //? Get Trtaining Data
    public static getTrainingData = async (params: RootFilterQuery<IHelpTopic>): Promise<TrainingData[]> => {
        const helpTopics: IHelpTopic[] = await HelpTopicSchema.find(params);

        return helpTopics.map(helpTopic => this.toTrainingData(helpTopic)).flat();
    };


    //? Find Help Topic by Filter Query
    public static findOne = async (params: RootFilterQuery<IHelpTopic>): Promise<IHelpTopic> => {
        const helpTopic: IHelpTopic | null = await HelpTopicSchema.findOne(params);
        
        if (!helpTopic) throw boom.notFound('Tema de ayuda no encontrado');

        return helpTopic;
    };

    //? Create a new Help Topic
    public static create = async (data: Partial<HelpTopicBase>): Promise<IHelpTopic> => {
        await this.validations(data);

        const classification: number =  await Counter.getNextSequenceValue(ModelsWithCounters.HelpTopic);

        const helpTopic: IHelpTopic = await HelpTopicSchema.create({ ...data, classification });
        
        this.train();

        return helpTopic;
    };

    //? Update Help Topic
    public static update = async (id: string, data: Partial<HelpTopicBase>): Promise<IHelpTopic> => {
        await this.validations(data);

        const helpTopic: IHelpTopic | null = await HelpTopicSchema.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!helpTopic) throw boom.notFound('Tema de ayuda no encontrado');

        if (data.examples) this.train();

        return helpTopic;
    };

    //? Enable or Disable Help Topic by Id
    public static enableDisable = async (id: string, enabled: boolean): Promise<IHelpTopic> => {
        const helpTopic: IHelpTopic = await this.update(id, { enabled });

        this.train();

        return helpTopic;
    };
}


export default HelpTopic;