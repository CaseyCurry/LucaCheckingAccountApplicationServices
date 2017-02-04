"use strict";

const Event = require("./event");
const eventName = "TRANSACTION_CATEGORIZED";

module.exports = class TransactionCategorized extends Event {
  constructor(transaction) {
    super();
    this.eventName = eventName;
    this.transaction = {
      id: transaction.id,
      categorization: transaction.categorization
    };
  }
};

module.exports.eventName = eventName;
