interface CustomError extends Error {
    errno?: number;
    code?: string;
    syscall?: string;
    path?: string;
    expose?: boolean;
    statusCode?: number;
    status?: number;
}

export default CustomError;
