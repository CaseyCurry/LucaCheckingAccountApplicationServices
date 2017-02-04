"use strict";

const bootstrapper = require("luca-spec-bootstrapper");

const context = require.context("../src", true, /\-spec.js$/);
const modules = bootstrapper.bootstrap(context);

module.exports = modules;
