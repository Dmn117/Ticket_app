import { Request, Response } from "express";

import Evaluation from "../models/Evaluation";
import CustomError from "../../../shared/interfaces/CustomError";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";
import EvaluationQueryParams from "../interfaces/EvaluationQueryParams";

import { EvaluationWithPopulate, IEvaluation } from "../interfaces/Evaluation.interfaces";



class EvaluationController {

    //! Private 

    //? Assemble query parameters
    public static assembleQueryParams = (req: Request): Partial<EvaluationQueryParams> => {
        const params: Partial<EvaluationQueryParams> = {};

        if (req.query.rate) {
            let ratings: number[] = req.query.rate
                .toString()
                .split(',')
                .map(item => Number(item.trim()));

            if (req.query.includesRate === 'false') {
                params.rate = { $nin: ratings };
            }
            else {
                params.rate = { $in: ratings };
            }
        }

        if (req.query.comments) params.comments = { $regex: req.query.comments.toString(), $options: 'i' };

        if (req.query.rated) params.rated = req.query.rated === 'true';

        if (req.query.month) {
            let months: number[] = req.query.month
                .toString()
                .split(',')
                .map(item => Number(item.trim()));

            if (req.query.includesMonth === 'false') {
                params.month = { $nin: months };
            }
            else {
                params.month = { $in: months };
            }
        }

        if (req.query.year) {
            let years: number[] = req.query.year
                .toString()
                .split(',')
                .map(item => Number(item.trim()));

            if (req.query.includesYear === 'false') {
                params.year = { $nin: years };
            }
            else {
                params.year = { $in: years };
            }
        }

        if (req.query.agent) {
            let agents: string[] = req.query.agent
                .toString()
                .split(',')
                .map(agent => agent.trim());
            
            if (req.query.includesAgent === 'false') {
                params.agent = { $nin: agents };
            }
            else {
                params.agent = { $in: agents };
            }
        }

        if (req.query.evaluator) params.evaluator = req.query.evaluator.toString();

        if (req.query.boss) params.boss = req.query.boss.toString();

        return params;
    };

    //! Public

    //? GET Methods

    //? Get all or some Evaluations by Query parameters
    public static getAll = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const params: Partial<EvaluationQueryParams> = this.assembleQueryParams(req);
            const evaluations = await Evaluation.find(params);
            
            res.status(200).json({
                message: 'Evaluaciones recuperadas exitosamente',
                evaluations
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Get Evaluation by Id
    public static getById = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const evaluation = await Evaluation.findById(id);

            res.status(200).json({
                message: 'Evaluación recuperada exitosamente',
                evaluation
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? Get Evaluations by Boss Id
    public static getByBossId = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const evaluations = await Evaluation.findByBossId(id);

            res.status(200).json({
                message: 'Evaluaciones recuperadas exitosamente',
                evaluations
            });
        } 
        catch (error) {
            next(error as CustomError);
        }
    };

    //? POST Methods

    //? Create a new Evaluation
    public static create = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const evaluation: IEvaluation = await Evaluation.create(body);

            res.status(201).json({
                message: 'Evaluación registrada exitosamente',
                evaluation
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };


    //? Create Monthly Evaluations  
    public static createMonthlyEvaluations = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const evaluations = await Evaluation.createMonthlyEvaluations(
                body.month, 
                body.year
            );

            res.status(201).json({
                message: 'Evaluaciones registradas exitosamente',
                evaluations
            })
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? PUT Methods

    //? Update Evaluation by Id
    public static update = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const { body } = req;
            const id: string = req.params.id;
        
            const evaluation: IEvaluation = await Evaluation.update(id, body);

            res.status(200).json({
                message: 'Evaluación actualizada exitosamente',
                evaluation
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };

    //? DELETE Methods
    
    //? Delete Evaluation by Id
    public static delete = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            const id: string = req.params.id;
            const evaluation: IEvaluation = await Evaluation.delete(id);

            res.status(200).json({
                message: 'Evaluación eliminada exitosamente',
                evaluation
            });
        }
        catch (error) {
            next(error as CustomError);
        }
    };
}


export default EvaluationController;