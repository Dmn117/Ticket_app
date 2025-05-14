import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './src/.env' });

//! Load  Env
const env = process.env;

//? Environment
type Environment = 'development' | 'production';

const Env = (env: string) => {
    switch (env) {
        case 'development':
            return env;
        case 'production':
            return env;
        default:
            return 'development';
    }
};

export const NODE_ENV: Environment = Env(env.NODE_ENV || 'development');

//? Express Server Port
export const PORT: number = Number(env.PORT) || 3000;
export const SERVER: string = env.SERVER || 'localhost';

//? Mongo Database
export const MONGO_USERNAME: string = env.MONGO_USERNAME ||'';
export const MONGO_PASSWORD: string = env.MONGO_PASSWORD || '';
export const MONGO_SERVER: string = env.MONGO_SERVER || '';
export const MONGO_PORT: string = env.MONGO_PORT || '';
export const MONGO_DB: string = env.MONGO_DB || 'Test';

//? JSON Web Token
export const JWT_PRIVATE_KEY: Buffer<ArrayBufferLike> = fs.readFileSync('./src/private.pem');
export const JWT_PUBLIC_KEY: Buffer<ArrayBufferLike> = fs.readFileSync('./src/public.pem');
export const JWT_EXP: string = env.JWT_EXP || '1h';

//? SMTP
export const SMTP_HOST: string = env.SMTP_HOST || '';
export const SMTP_PORT: number = Number(env.SMTP_PORT) || 587;
export const SMTP_USER: string = env.SMTP_USER || '';
export const SMTP_PASSWORD: string = env.SMTP_PASSWORD || '';

//? Hash
export const HASH_ROUNDS: number = Number(env.HASH_ROUNDS) || 10;

//? HTML Pages
export const NOT_FOUND_PAGE: string = './src/shared/templates/pages/404.page.html';
export const HOME_PAGE: string = './src/shared/templates/pages/home.page.html';

//? HTML Templates
export const VERIFICATION_CODE: string = './src/shared/templates/views/VerificationCode.html';
export const ACCOUNT_CONFIRMATION: string = './src/shared/templates/views/AccountConfirmation.html';
export const TICKET_CREATION: string = './src/shared/templates/views/TicketCreation.html';
export const ASSIGNED_TICKET_FOR_AGENT: string = './src/shared/templates/views/AssignedTicketForAgent.html';
export const ASSIGNED_TICKET_FOR_AUTHOR: string = './src/shared/templates/views/AssignedTicketForAuthor.html';
export const TICKET_CLOSING: string = './src/shared/templates/views/TicketClosing.html';

//? IMG
export const FILE_NOT_FOUND: string = `./src/shared/assets/img/fileNotFound.png`;
export const USER_IMG: string = `./src/shared/assets/img/default.user.png`; 

//? Public
export const BG_1_PAGE: string = `http://${SERVER}:${PORT}/assets/img/bg1.jpg`;
export const FAVICON: string = `http://${SERVER}:${PORT}/assets/ico/favicon.ico`;

//? Swagger
export const SWAGGER_YML: string = './src/documentation/swagger.yml';
export const SWAGGER_THEME_MATERIAL: string = './src/documentation/swagger-theme-material.css';


//? Verification Code
export const VCODE_LENGTH: number = Number(env.VCODE_LENGTH) || 5;
export const VCODE_EXP: number = Number(env.VCODE_EXP) || 5;
export const VCODE_FIRST_EXP: number = Number(env.VCODE_FIRST_EXP) || 1440;


//? Fronted Url
export const FRONTEND_URL: string = env.FRONTEND_URL || '';


//? Relative Paths
export const UPLOADS: string = './uploads';


//? Maximum Ticket Rating
export const MIN_TICKET_RATING: number = Number(env.MIN_TICKET_RATING) || 0;
export const MAX_TICKET_RATING: number = Number(env.MAX_TICKET_RATING) || 5;


//? Max validation attemps before disable user
export const MAX_VALIDATION_ATTEMPTS: number = Number(env.MAX_VALIDATION_ATTEMPTS) || 3;


//? Default Permission Group Profile Name 
export const DEFAULT_PG_PROFILE: string = 'Personalizado';


//? Maximum Agent Rating
export const MIN_AGENT_RATING: number = Number(env.MIN_AGENT_RATING) || 1;
export const MAX_AGENT_RATING: number = Number(env.MAX_AGENT_RATING) || 10;