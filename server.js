const express = require('express');
const mongoUtil = require('./utils/mongoUtil');
const cors = require('cors');
const routes = require('./routes');

require('dotenv').config({ path: "./config.env" });

const app = express()

app.use(express.json());
app.use(cors());
app.use(routes);

mongoUtil.connectToCluster().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Listening on port", process.env.PORT);
    })
}
)