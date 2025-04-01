import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import { createServer, Server as HttpServer } from 'http';

import '../config/cron.config';
import mongo from '../config/mongo';
import Socket from '../socket/Socket';
import passport from '../utils/auth/index';
import swagger from '../middlewares/swagger';
import corsConfig from '../config/cors.config';
import homeRouter from '../../routers/home.router';
import apiRouterV1 from '../../routers/api.router.v1';

import { PORT } from '../config/constants';
import { boomErrorHandler, errorHandler, logErrors, noSuchFileHandler, notFoundHandler } from '../middlewares/error.handler';

class Server {
    private app: express.Application;
    private server: HttpServer;

    constructor() { 
        this.app = express();
        this.server = createServer(this.app);
    }

    private middlewares = (): void => {
        // Midlewares

        // Helmet
        this.app.use(helmet());

        // Cors Configure
        this.app.use(cors(corsConfig));

        // Auth
        passport;

        // Public folder
        this.app.use(express.static(path.join(__dirname, '../../../', '/src/shared/public')));

        // Read Body
        this.app.use(express.json());

        // Database Connection
        mongo();

        // Router
        this.app.use('', homeRouter);
        this.app.use('/api/v1', apiRouterV1);

        // Socket IO
        // Socket.initSocket(this.server);

        // Documentation
        swagger(this.app);

        // Error Control
        this.app.use(logErrors);
        this.app.use(boomErrorHandler);
        this.app.use(errorHandler);
        this.app.use(noSuchFileHandler);
        this.app.use(notFoundHandler);
    };

    private tryListen = (port: number): void => {
        this.server.once('listening', () => {
            console.log(`✔️ Server successfully started at http://localhost:${port}`);
        });
        
        this.server.once('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`❗ Port ${port} is in use, trying another one...`);
                this.server.close(() => {this.tryListen(port + 1)});
            }
            else {
                console.log('❌ Server failed to start: ', err);
                process.exit(1);
            }
        });

        this.server.listen(port);
    };

    public run = (): void => {
        this.middlewares();

        this.tryListen(PORT);
    };
}

export default Server;