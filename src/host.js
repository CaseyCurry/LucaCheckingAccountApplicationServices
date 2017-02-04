"use strict";

// TODO: move app to initializer maybe
const app = require("express")();
const apiInitializer = require("luca-api-initializer");
const dependencies = require("./dependencies");
const routes = require("./api/routes");

// sync the physical database and the definition defined in dependencies
dependencies.syncDatabases();

dependencies.registerEventListeners();

apiInitializer.initialize(app, "checking-account-api", routes.register(dependencies));
