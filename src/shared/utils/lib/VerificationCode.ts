const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
};


export const calculateCodeExirationDate = (minutes: number): Date => {
    return new Date(Date.now() + minutes * 60000);
}


export const generateVerificationCode = (length: number): string => {
    let code: string = '';

    for (let i = 0; i < length; i++) {
        code += characters[getRandomInt(characters.length)];
    }
    
    return code;
};