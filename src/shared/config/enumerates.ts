export enum Segments {
    PERMISSION_GROUPS = 'PERMISSION_GROUPS',
    USERS = 'USERS',
    FILES = 'FILES',
    ADDRESS = 'AADDRESS',
    STORES = 'STORES',
    PRODUCTS = 'PRODUCTS',
    DIPOMEX = 'DIPOMEX',
    CLIENTS = 'CLIENTS',
    FRANCHISES = 'FRANCHISES',
    SALES = 'SALES',
};


export enum Permissions {
    FIND = 'FIND',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    ENABLE = 'ENABLE',
    DISABLE = 'DISABLE',
    DELETE = 'DELETE',
};


export enum UserCounters {
    evaluatedTickets = 'evaluatedTickets',
    closedTickets = 'closedTickets',
    validationAttempts = 'validationAttempts',
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



export enum DipomexSections {
    zipCode = 'codigo_postal',
    state = 'estado',
    states = 'estados',
    municipalities = 'municipios',
    colonias = 'colonies'
}