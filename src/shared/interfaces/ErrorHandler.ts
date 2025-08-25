import CustomError from './CustomError';


interface ErrorHandler {
    (error: Error | CustomError): void;
}

export default ErrorHandler;
