//! CLI by https://github.com/Dmn117

import boom from "@hapi/boom";
import Jwt from 'jsonwebtoken';

import Ticket from "../../tickets/models/Ticket.model";
import HelpTopic from "../../helpTopics/models/HelpTopic.model";

import { CLASSIFIER_API_URL, JWT_PRIVATE_KEY } from "../../../shared/config/constants";
import { ClassificationResult, ErrorResponse, TrainingData, TrainingResult } from '../interfaces/Classifier.interfaces';



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

    private static throwBoomError = async (res: Response): Promise<void> => {
        if (res.ok) return;

        const error: ErrorResponse = await res.json();

        throw boom.boomify(new Error(error.detail), { statusCode: res.status });
    };


    private static getTrainingData = async (): Promise<TrainingData[]> => {
        const helptopics = await HelpTopic.getTrainingData({ enabled: true });
        const tickets = await Ticket.getDataTraining({ status: 'Cerrado' });

        return [...helptopics, ...tickets];
    };

    //! Public 


    public static classify = async (description: string): Promise<ClassificationResult> => {
        const res: Response = await fetch(`${CLASSIFIER_API_URL}/classify`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ description })
        });

        await this.throwBoomError(res);

        const result: ClassificationResult = await res.json();

        return result;
    };


    public static train = async (): Promise<TrainingResult> => {
        const trainingData: TrainingData[] = await this.getTrainingData();

        const res: Response = await fetch(`${CLASSIFIER_API_URL}/train`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(trainingData)
        });

        await this.throwBoomError(res);

        const result: TrainingResult = await res.json();

        return result;
    };
}



export default Classifier;