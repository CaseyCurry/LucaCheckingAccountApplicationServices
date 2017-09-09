"use strict";

const app = require("express")();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const ApiError = require("./api-error");
const dependencies = require("./dependencies");
const routes = require("./routes");

// sync the physical database and the definition defined in dependencies
dependencies.syncDatabases();

dependencies.registerEventListeners();

app.use(helmet());
app.use(cors({
  origin: "*"
}));
app.use(bodyParser.json());
routes.register(dependencies, app);

// Express requires the signature to include all four parameters
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response
    .status(500)
    .send(new ApiError(error));
  response.end();
});

const port = 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
