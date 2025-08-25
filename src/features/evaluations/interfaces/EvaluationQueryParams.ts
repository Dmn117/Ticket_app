

interface EvaluationQueryParams {
    rate: { $in: number[] } | { $nin: number[] };

    comments: { $regex: string, $options: string };

    rated: boolean;

    month: { $in: number[] } | { $nin: number[] };
    year: { $in: number[] } | { $nin: number[] };

    agent: { $in: string[] } | { $nin: string[] };
    evaluator: string;

    boss: string;
}


export default EvaluationQueryParams;