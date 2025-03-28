const express = require('express');
const cors = require('cors');
const platformClient = require("purecloud-platform-client-v2");
const dotenv = require('dotenv');

// const fs = require('fs');
// const path = require('path');

dotenv.config();




const app = express();

// }));
app.use(cors());
app.use(express.json());

const client = platformClient.ApiClient.instance;
client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1);

let IsAuth;

let apiInstance = new platformClient.ArchitectApi();
console.log('Cliend ID', process.env.GENESYS_CLIENT_ID);
console.log('Cliend Secret', process.env.GENESYS_CLIENT_SECRET);


async function Auth() {
    try {
        // Initialize to false before each attempt
        IsAuth = false;

        // Return the promise so it can be properly awaited
        return client.loginClientCredentialsGrant(process.env.GENESYS_CLIENT_ID, process.env.GENESYS_CLIENT_SECRET)
            .then(() => {
                console.log('Authenticated');
                IsAuth = true;
                return true;
            })
            .catch((err) => {
                console.log('Authentication error:', err);
                IsAuth = false;
                return false;
            });
    } catch (error) {
        console.log('error in auth', error);
        IsAuth = false;
        return false;
    }
}

// Get caller information
app.get('/api/caller/:phoneNumber', async (req, res) => {
    console.log('Endpoint called with phone number:', req.params.phoneNumber);
    const isAuthenticated = await Auth();
    console.log('Authentication result:', isAuthenticated);
    if (IsAuth == true) {
        console.log('inside if');
        try {
            let datatableId = "9d224bea-b8af-4934-9187-163cb57e8eb5"; // String | id of datatable
            let rowId = req.params.phoneNumber; // String | The key for the row
            let opts = {
                "showbrief": false // Boolean | if true returns just the key field for the row
            };
            console.log('datatableId', datatableId);
            console.log('rowId', rowId);
            const callerInfo = await apiInstance.getFlowsDatatableRow(datatableId, rowId, opts)
            res.json(callerInfo);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch caller information' });
        }
    } else {
        return;
    }
});





// Create both HTTP and HTTPS servers
const PORT = process.env.PORT || 3001;


// HTTP server
app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});

// Add this to your server.js
app.get('/health', (req, res) => {
    console.log('Health check endpoint called');
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
