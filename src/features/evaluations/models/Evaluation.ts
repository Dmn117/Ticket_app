import boom from '@hapi/boom';

import User from '../../users/models/User.model';
import IUser from '../../users/interfaces/User.interfaces';
import EvaluationSchema from "../schemas/Evaluation.schema";
import EvaluationQueryParams from "../interfaces/EvaluationQueryParams";

import { Roles } from '../../../shared/config/enumerates';
import { EvaluationEntry, EvaluationWithPopulate, IEvaluation } from "../interfaces/Evaluation.interfaces";



class Evaluation {
    //! Private

    //? Validate Monthly Evaluation
    private static validateMonthlyEvaluation = async (data: Partial<EvaluationEntry>): Promise<void> => {
        const evaluation: IEvaluation | null = await EvaluationSchema.findOne({
            agent: data.agent,
            month: data.month,
            year: data.year
        });

        if (evaluation) throw boom.conflict(
            `El agente: ${data.agent}, ya tiene una evaluacion ${evaluation.rated ? "completada" : "pendiente"} del ${data.month}/${data.year}`
        )
    };


    //? Validations Data and References
    private static validations = async (data: Partial<EvaluationEntry>): Promise<any[]> => {
        const promises: Promise<any>[] = [];

        if (data.agent) {
            promises.push(User.findById(data.agent, false));
        }

        if (data.evaluator) {
            promises.push(User.findById(data.evaluator, false));
        }

        if (data.month || data.year) {
            promises.push(this.validateMonthlyEvaluation(data));
        }

        return await Promise.all(promises);
    };

    //! Public


    //? Find all or some Evaluations by Query Parameters
    public static find = async (params: Partial<EvaluationQueryParams>): Promise<(IEvaluation | EvaluationWithPopulate)[]> => {
        const evaluations: (IEvaluation | EvaluationWithPopulate)[] = await EvaluationSchema.find(params)
            .populate({
                path: 'agent',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'evaluator',
                select: '_id firstName lastName email'
            });

        if (evaluations.length === 0) throw boom.notFound('Evaluaciones no encontradas');

        return evaluations;
    };


    //? Find Evaluation by Id
    public static findById = async (id: string): Promise<IEvaluation | EvaluationWithPopulate> => {
        const evaluation: IEvaluation | EvaluationWithPopulate | null = await EvaluationSchema.findById(id)
            .populate({
                path: 'agent',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'evaluator',
                select: '_id firstName lastName email'
            });

        if (!evaluation) throw boom.notFound('Evaluación no encontrada');

        return evaluation;
    };


    //? Find Evaluation by Boss Id
    public static findByBossId = async (boss: string): Promise<(IEvaluation | EvaluationWithPopulate)[]> => {
        const agents: IUser[] = await User.find({ boss }, false);

        const agentIds: string[] = agents.map(agent => agent._id.toString());

        const evaluations: (IEvaluation | EvaluationWithPopulate)[] = await this.find({ agent: { $in: agentIds } });
        
        return evaluations;
    };


    //? Create a new Evaluation
    public static create = async (data: Partial<EvaluationEntry>): Promise<IEvaluation> => {
        await this.validations(data);

        const evaluation: IEvaluation = await EvaluationSchema.create(data);

        return evaluation;
    };


    //? Create Monthly Evaluations
    public static createMonthlyEvaluations = async (month?: number, year?: number): Promise<PromiseSettledResult<IEvaluation>[]> => {
        const users = await User.find({ role: { $in: [Roles.AGENT] } }, false);
        const today = new Date();

        const results = await Promise.allSettled(
            users.map(user => this.create({ 
                agent: user._id.toString(),
                month: month || today.getMonth() + 1,
                year: year || today.getFullYear()
            }))
        );

        return results;
    };


    //? Update Evaluation by Id
    public static update = async (id: string, data: Partial<EvaluationEntry>): Promise<IEvaluation> => {
        await this.validations(data);

        const evaluation: IEvaluation | null = await EvaluationSchema.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!evaluation) throw boom.notFound('Evaluación no encontrada');

        return evaluation;
    };


    //? Delete Evaluation by Id
    public static delete = async (id: string): Promise<IEvaluation> => {
        const evaluation: IEvaluation | null = await EvaluationSchema.findByIdAndDelete(id);

        if (!evaluation) throw boom.notFound('Evaluación no encontrada');

        return evaluation;
    };
}


export default Evaluation;