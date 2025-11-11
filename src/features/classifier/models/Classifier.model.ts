//! CLI by https://github.com/Dmn117

import boom from "@hapi/boom";
import Jwt from 'jsonwebtoken';

import Ticket from "../../tickets/models/Ticket.model";
import HelpTopic from "../../helpTopics/models/HelpTopic.model";

import { CLASSIFIER_API_URL, JWT_PRIVATE_KEY, MONTHS_OF_TRAINING_DATA } from "../../../shared/config/constants";
import { ClassificationResult, ErrorResponse, TrainingData, TrainingResult } from '../interfaces/Classifier.interfaces';
import { FilterQuery } from "mongoose";
import FetchResponse from "../../../shared/utils/lib/FetchResponse";
import { TicketStatus } from "../../../shared/config/enumerates";



class Classifier {


    //! Private


    private static headers = (): Headers => {
        const payload = {sub: 'CFDI_Classifier_Machine_Learning_Python_Server'};
        const token = Jwt.sign(payload, JWT_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1m' });

        return new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    };


    private static getTrainingData = async (params: FilterQuery<Document> = {}): Promise<TrainingData[]> => {
        const helptopics = await HelpTopic.getTrainingData({ ...params, enabled: true });
        const tickets = await Ticket.getDataTraining({ ...params, status: { $nin: [TicketStatus.CANCELED] } });

        return [...helptopics, ...tickets];
    };

    //! Public 


    public static classify = async (description: string): Promise<ClassificationResult> => {
        const res: Response = await fetch(`${CLASSIFIER_API_URL}/classify`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ description })
        });

        return await FetchResponse.validate(res, `Error tratando de clasificar el entrada: ${description}`);
    };


    public static train = async (trainingData: TrainingData[]): Promise<TrainingResult> => {
        const res: Response = await fetch(`${CLASSIFIER_API_URL}/train`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(trainingData)
        });

        return {
            ...await FetchResponse.validate(res, 'Error entrenando el modelo desde Classifier'),
            trainingData
        };
    };


    public static automaticTrainingSync = async (): Promise<TrainingResult> => {
        const monthsAgo = new Date();
        
        monthsAgo.setMonth(monthsAgo.getMonth() - MONTHS_OF_TRAINING_DATA);

        const trainingData: TrainingData[] = await this.getTrainingData({ createdAt: { $gte: monthsAgo } });

        return await this.train(trainingData);
    };


    public static automaticTraining = async (): Promise<void> => {
        try {
            this.automaticTrainingSync();
        }
        catch (error) {
            console.log('Error entrenando el modelo', error);
        }
    };
}



export default Classifier;