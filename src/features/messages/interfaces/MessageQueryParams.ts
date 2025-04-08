



interface MessageQueryParams {
    text: { $regex: string, $options: string };
    owner: string;
}


export default MessageQueryParams;