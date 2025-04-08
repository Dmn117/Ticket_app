import cron from 'node-cron';

import Evaluation from '../models/Evaluation';
import lastDayOfMonth from '../../../shared/utils/lib/LastDayOfMonth';



cron.schedule('0 0 28-31 * *', () => {
    lastDayOfMonth() && Evaluation.createMonthlyEvaluations()
    
});


// cron.schedule('*/1 * * * *', () => {
//     lastDayOfMonth() && Evaluation.createMonthlyEvaluations()
// });