import cors from 'cors';

// const allowedOrigins: string[] = ['*'];


const corsConfig: cors.CorsOptions = {
    origin: '*', // Permitir todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Ajustar según tus necesidades
    credentials: false
};


export default corsConfig;