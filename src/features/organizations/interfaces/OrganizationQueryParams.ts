

interface OrganizationQueryParams {
    name: { $regex: string, $options: string };
    enabled: boolean;
    director: string;
};

export default OrganizationQueryParams;