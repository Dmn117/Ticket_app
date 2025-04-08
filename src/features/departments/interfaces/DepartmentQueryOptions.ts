interface PopulatedField {
    path: string;
    select: string;
}


interface DepartmentQueryOptions {
    populate: Partial<PopulatedField>[];
}


export default DepartmentQueryOptions;