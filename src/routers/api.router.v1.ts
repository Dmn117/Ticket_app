import { Router } from "express";


//? Import Routes
import UserRoutes from "../features/users/routes/User.routes";
import FileRoutes from '../features/files/routes/File.routes';
import PermissionGroupRoutes from "../features/permissionGroups/routes/PermissionGroup.routes";



//? Router Declaration
const apiRouterV1: Router = Router();



//? Route Segmentation
apiRouterV1.use('/user', UserRoutes);
apiRouterV1.use('/file', FileRoutes);
apiRouterV1.use('/permission-group', PermissionGroupRoutes);


export default apiRouterV1;