

interface TicketQueryParams {
    title: { $regex: string, $options: string };
    description: { $regex: string, $options: string };
    status:  { $in: string[] } | { $nin: string[] };
    rating: { $in: number[] } | { $nin: number[] };
    owner: string;
    assignedTo: string;
    department: { $in: string[] } | { $nin: string[] };
    helpTopic: { $in: string[] } | { $nin: string[] };
}


export default TicketQueryParams;