import mongoose from 'mongoose';
import UserSeeders from '../../features/users/seeders/User.seeders';
import { MONGO_DB, MONGO_PASSWORD, MONGO_PORT, MONGO_SERVER, MONGO_USERNAME } from './constants';

const mongo = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_SERVER}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`);
        await UserSeeders.adminUser();
    }
    catch (error) {
        console.log(error);
    }
};


export default mongo;