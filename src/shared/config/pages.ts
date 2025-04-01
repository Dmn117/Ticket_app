import { readFileSync } from "fs";
import { ACCOUNT_CONFIRMATION, HOME_PAGE, NOT_FOUND_PAGE, VERIFICATION_CODE } from "./constants";

export const notFoundPage: string =  readFileSync(NOT_FOUND_PAGE, 'utf-8');

export const homePage: string = readFileSync(HOME_PAGE, 'utf-8');

export const verificationCodeTemplate: string = readFileSync(VERIFICATION_CODE, 'utf-8');

export const accountConfirmationTemplate: string = readFileSync(ACCOUNT_CONFIRMATION, 'utf-8');