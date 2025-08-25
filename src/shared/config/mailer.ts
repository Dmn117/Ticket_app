import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from './constants';

const mailer = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default mailer;