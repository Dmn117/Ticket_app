import { Router } from "express";


//? Import Routes
import UserRoutes from "../features/users/routes/User.routes";
import FileRoutes from "../features/files/routes/File.routes";
import TicketRoutes from "../features/tickets/routes/Ticket.routes";
import MessageRoutes from "../features/messages/routes/Message.routes";
import TransferRoutes from "../features/transfers/routes/Transfer.routes";
import IncidentRoutes from "../features/incidents/routes/Incident.routes";
import HelpTopicRoutes from "../features/helpTopics/routes/HelpTopic.routes";
import ClassifierRoutes from "../features/classifier/routes/Classifier.routes";
import DepartmentRoutes from "../features/departments/routes/Department.routes";
import EvaluationRoutes from "../features/evaluations/routes/Evaluation.routes";
import ApplicationRoutes from "../features/applications/routes/Application.routes";
import OrganizationRoutes from "../features/organizations/routes/Organization.routes";


//? Router Declaration
const apiRouterV1: Router = Router();


//? Route Segmentation
apiRouterV1.use('/user', UserRoutes);
apiRouterV1.use('/file', FileRoutes);
apiRouterV1.use('/ticket', TicketRoutes);
apiRouterV1.use('/message', MessageRoutes);
apiRouterV1.use('/transfer', TransferRoutes);
apiRouterV1.use('/incidence', IncidentRoutes);
apiRouterV1.use('/help-topic', HelpTopicRoutes);
apiRouterV1.use('/classifier', ClassifierRoutes);
apiRouterV1.use('/department', DepartmentRoutes);
apiRouterV1.use('/evaluation', EvaluationRoutes);
apiRouterV1.use('/application', ApplicationRoutes);
apiRouterV1.use('/organization', OrganizationRoutes);


export default apiRouterV1;