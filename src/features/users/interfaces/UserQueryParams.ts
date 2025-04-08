

interface UserQueryParams {
    firstName: { $regex: string, $options: string };
    lastName: { $regex: string, $options: string };
    email: string;
    
    includesRoles: boolean;
    role: { $in: string[] } | { $nin: string[] };

    rating: { $gte?: number, $lte?: number };

    reporter: boolean;

    validated: boolean;
    enabled: boolean;

    boss: string;

    includeDepts: boolean;
    departments: { $in: string[] } | { $nin: string[] };
}


export default UserQueryParams;