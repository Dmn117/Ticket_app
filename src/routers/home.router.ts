import { Router } from "express";
import homeRoutes from "../features/Home/routes/Home.routes";


const homeRouter: Router = Router();

homeRouter.use('/', homeRoutes);
homeRouter.use('/home', homeRoutes);

export default homeRouter;