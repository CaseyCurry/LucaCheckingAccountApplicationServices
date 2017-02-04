"use strict";

const Event = require("./event");
const eventName = "TRANSACTION_POSTED";

module.exports = class TransactionPosted extends Event {
  constructor(transaction) {
    super();
    this.eventName = eventName;
    this.transaction = transaction;
  }
};

module.exports.eventName = eventName;
