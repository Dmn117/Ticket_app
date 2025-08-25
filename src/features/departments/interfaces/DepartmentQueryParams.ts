


interface DepartmentQueryParams {
    name: { $regex: string, $options: string };
    enabled: boolean;
    organization: string;
    owner: string;
};


export default DepartmentQueryParams;