interface IEmail {
    from?: string;
    to?: string;
    subject: string;
    text?: string;
    html?: string;
    status?: boolean;
}

export default IEmail;