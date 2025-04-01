import { Request, Response } from "express";

import CustomError from "../../../shared/interfaces/CustomError";
import ErrorHandler from "../../../shared/interfaces/ErrorHandler";

import { homePage } from "../../../shared/config/pages";
import { BG_1_PAGE, FAVICON } from "../../../shared/config/constants";


class HomeController {

    //? Get Home Page
    public static getHomePage = async (req: Request, res: Response, next: ErrorHandler): Promise<void> => {
        try {
            res.status(200).send(
                homePage
                .replace('{{BG}}', BG_1_PAGE)
                .replace('{{FAVICON}}', FAVICON)
            );
        }
        catch (error) {
            next(error as CustomError);
        }
    };

}


export default HomeController;