import { readFileSync } from "fs";
import { ACCOUNT_CONFIRMATION, ASSIGNED_TICKET_FOR_AGENT, ASSIGNED_TICKET_FOR_AUTHOR, HOME_PAGE, NOT_FOUND_PAGE, TICKET_CLOSING, TICKET_CREATION, VERIFICATION_CODE } from "./constants";

export const notFoundPage: string =  readFileSync(NOT_FOUND_PAGE, 'utf-8');

export const homePage: string = readFileSync(HOME_PAGE, 'utf-8');

export const verificationCodeTemplate: string = readFileSync(VERIFICATION_CODE, 'utf-8');

export const accountConfirmationTemplate: string = readFileSync(ACCOUNT_CONFIRMATION, 'utf-8');

export const ticketCreationTemplate: string = readFileSync(TICKET_CREATION, 'utf-8');

export const assignedTicketForAgent: string = readFileSync(ASSIGNED_TICKET_FOR_AGENT, 'utf-8');

export const assignedTicketForAuthor: string = readFileSync(ASSIGNED_TICKET_FOR_AUTHOR, 'utf-8');

export const ticketClosingTemplate: string = readFileSync(TICKET_CLOSING, 'utf-8');