


export interface IncidentQueryParams {
    title: { $regex: string, $options: string };

    description: { $regex: string, $options: string };

    severity: { $in: number[] } | { $nin: number[] };

    author: string;
    agent: { $in: string[] } | { $nin: string[] };

    createdAt: { $gte?: Date, $lte?: Date }
}


export default IncidentQueryParams;