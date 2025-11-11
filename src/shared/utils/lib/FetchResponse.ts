import boom from '@hapi/boom';

class FetchResponse {

    //! Private

    private static getBody = async (res: Response): Promise<any> => {
        const contentType = res.headers.get("content-type")?.split(";")[0].trim();

        switch (contentType) {
            case "application/json":
                return res.json();

            case "text/plain":
            case "text/html":
            case "application/xml":
            case "text/xml":
                return res.text();

            case "application/octet-stream":
            case "application/pdf":
            case "image/png":
            case "image/jpeg":
            case "image/gif":
            case "application/zip":
                return res.arrayBuffer();

            case "multipart/form-data":
                throw new Error("multipart/form-data no soportado nativamente");

            case "application/x-www-form-urlencoded":
                return res.text().then((t) => new URLSearchParams(t));

            default:
                try {
                    return await res.text();
                } catch {
                    return res.arrayBuffer();
                }
        }
    };

    //! Public

    //?  Validate Fetch Reponse
    public static validate = async(res: Response, errorMessage?: string): Promise<any> => {
        const body = await this.getBody(res);
        
        if (res.ok) return body;
        
        const message =
            typeof body === 'string'
                ? body
                : Array.isArray(body.errors) && body.errors[0]?.message
                    ? body.errors[0].message
                    : body.message || (errorMessage || 'Error desconocido');

        if (res.status === 500)
            throw boom.badGateway(message);
            
        throw boom.boomify(new Error(message), { statusCode: res.status });
    }; 
}


export default FetchResponse;