export enum Roles {
    USER = 'USER',
    AGENT = 'AGENT',
    BOSS = 'BOSS',
    DIRECTOR = 'DIRECTOR',
    ADMIN = 'ADMIN',
};


export enum UserCounters {
    evaluatedTickets = 'evaluatedTickets',
    closedTickets = 'closedTickets',
    validationAttempts = 'validationAttempts',
};

export enum TicketStatus {
    OPEN = 'OPEN',
    ASSIGNED = 'ASSIGNED',
    IN_PROCESS = 'IN_PROCESS',
    STOPPED = 'STOPPED',
    ON_HOLD = 'ON_HOLD',
    CANCELED = 'CANCELED',
    CLOSED = 'CLOSED'
};


export enum TicketItems {
    message = 'message',    
    file = 'file',
    department = 'department',
    transfer = 'transfer',
    assignedTo = 'assignedTo',
    helpTopic = 'helpTopic',
};


export const TicketItemsTranslate = {
    message : { text: 'Mensaje', end: 'o' },
    file : { text: 'Archivo', end: 'o' },
    department : { text: 'Departamento', end: 'o' },
    transfer : { text: 'Transferencia', end: 'a' },
    assignedTo : { text: 'Asignacion', end: 'a' },
    helpTopic : { text: 'Tema de ayuda', end: 'o' },
};


export enum RequestProperties {
    body = 'body',
    params = 'params',
    query = 'query'
};


export enum MimeTypes {
    WORD = 'vnd.openxmlformats-officedocument.wordprocessingml.document',
    EXCEL = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};


export enum FileTypes {
    WORD = 'docx',
    EXCEL = 'xlsx'
};


export enum MessageVisibility {
    TO_ALL = 'TO_ALL',
    ONLY_TO_ME = 'ONLY_TO_ME',
    TO_NO_ONE = 'TO_NO_ONE',
    TO_AGENTS = 'TO_AGENTS'
};


export enum MessageAttachmentType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    TEXT = 'TEXT',
    PDF = 'PDF',
    OTHER = 'OTHER',
};


export enum ModelsWithCounters {
    Ticket = 'Ticket'
};


export enum SocketEvents {
    Test = 'test',
    Join = 'join',
    Leave = 'leave',
    Error = 'error',
    TicketJoin = 'ticket:join',
    TicketLeave = 'ticket:leave',
    TicketChange = 'ticket:change',
    MessageSend = 'message:send',
};



export enum SpecialPermissions {
    createUser = 'createUser',
    updateUser = 'updateUser',
    enableUser = 'enableUser',
    disableUser = 'disableUser',
};


export enum TicketNotificationEMail {
    CREATION = 'CREATION',
    ASIIGNMENT_FOR_AGENT = 'ASIIGNMENT_FOR_AGENT',
    ASSIGNMENT_FOR_AUTHOR = 'ASSIGNMENT_FOR_AUTHOR',
    CLOSING = 'CLOSING'
};