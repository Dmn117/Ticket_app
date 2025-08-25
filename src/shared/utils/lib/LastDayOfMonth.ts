
const lastDayOfMonth = (): boolean => {
    const today = new Date();
    const tomorrow = new Date(today)
    
    tomorrow.setDate(today.getDate() + 1);

    return tomorrow.getDate() === 1;
};



export default lastDayOfMonth;