import { SentMessageInfo } from 'nodemailer';

import mailer from '../config/mailer';
import IEmail from '../interfaces/IEmail';


class SMTP {
    public static send = async (email: IEmail): Promise<SentMessageInfo> => {
        try {
            const response = await mailer.sendMail(email);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    };
}

export default SMTP;