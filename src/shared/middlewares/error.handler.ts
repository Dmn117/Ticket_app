import path from 'path';
import { isBoom } from '@hapi/boom';
import { Request, Response } from 'express';

import CustomError from '../interfaces/CustomError';
import ErrorHandler from '../interfaces/ErrorHandler';

import { Socket } from 'socket.io';
import { notFoundPage } from '../config/pages';
import { SocketEvents } from '../config/enumerates';
import { BG_1_PAGE, FAVICON, FILE_NOT_FOUND, USER_IMG } from '../config/constants';

export const logErrors = (err: Error, req: Request, res: Response, next: ErrorHandler): void => {
    console.error(err);
    next(err);
};

export const boomErrorHandler = (err: Error, req: Request, res: Response, next: ErrorHandler): void => {
    if (isBoom(err)) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    } else {
        next(err);
    }
};

export const errorHandler = (err: CustomError, req: Request, res: Response, next: ErrorHandler): void => {
    if (err.code !== 'ENOENT') {
        res.status(500).json({
            statusCode: 500,
            error: err.message,
            message: 'Error Interno Del Servidor'
        });
    } else {
        next(err);
    }
};

export const noSuchFileHandler = (err: CustomError, req: Request, res: Response, next: ErrorHandler): void => {
    if (err.path?.includes('user') || err.path?.includes('employee')) {
        res.status(404).sendFile(path.resolve(USER_IMG));
    } else {
        res.status(404).sendFile(path.resolve(FILE_NOT_FOUND));
    }
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).send(
        notFoundPage
            .replace('{{URL}}', req.originalUrl)
            .replace('{{BG}}', BG_1_PAGE)
            .replace('{{FAVICON}}', FAVICON)
    );
};

export const handleSocketError = (socket: Socket, err: Error): void => {
    if (isBoom(err)) {
        socket.emit(SocketEvents.Error, err.output.payload.message);
    } else {
        socket.emit(SocketEvents.Error, err.message || 'Ocurrió un error desconocido');
    }
};