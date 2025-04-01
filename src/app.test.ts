import Server from "./shared/server/Server";


const server: Server = new Server();


beforeAll(server.run);


describe('Server: Test', () => {
    // it ('Testing Expense To Xlsx', expenseToXlsxTest);
    // it ('Testing Diary To Xlsx', diaryToXlsxTest);
    // it ('Testing Create SatCategoryGroup', createTest);
    // it ('Testing SatCategoryGroups', getSatCategoryGroupsByKwsTest);
});