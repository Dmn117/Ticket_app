

interface HelpTopicQueryParams {
    name: { $regex: string, $options: 'i' },
    expIn: number,
    tags: { $in: string[] } | { $nin: string[] };
    enabled: boolean;
    department: { $in: string[] } | { $nin: string[] };
}


export default HelpTopicQueryParams;