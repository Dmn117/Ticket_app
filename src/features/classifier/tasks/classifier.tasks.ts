import cron from 'node-cron';
import Classifier from '../models/Classifier.model';



cron.schedule('0 0 * * 0', () => Classifier.automaticTraining());