import { Router } from "express";
import HomeController from "../controllers/Home.controller";


const router: Router = Router();

// GET
router.get(
    '/',
    HomeController.getHomePage
);



export default router;