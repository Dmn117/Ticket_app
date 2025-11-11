//! CLI by https://github.com/Dmn117

import { NextFunction, Request, Response } from "express";
import Classifier from "../models/Classifier.model";




class ClassifierController {


    public static train = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { body } = req;
        
            const trainginResult = await Classifier.train(body);

            res.status(200).json({...trainginResult});
        }
        catch (error){
            next(error);
        }
    };



    public static automaticTraining = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {       
            const trainginResult = await Classifier.automaticTrainingSync();

            res.status(200).json({...trainginResult});
        }
        catch (error){
            next(error);
        }
    };

}



export default ClassifierController;