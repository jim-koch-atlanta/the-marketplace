import { DatabaseManager } from './DatabaseManager';
import { RestApi } from './RestApi';

(async () => {
    // Initialize the DatabaseManager
    const dbManager = new DatabaseManager(':memory:');
    await dbManager.initialize();

    // Initialize the RestApi with the DatabaseManager instance
    const restApi = new RestApi(dbManager);

    // Start listening on a specific port
    const PORT = process.env.PORT || 3000;
    restApi.listen(Number(PORT));

    console.log(`Application running on port ${PORT}`);
})();