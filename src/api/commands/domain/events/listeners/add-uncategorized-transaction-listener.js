"use strict";

const transactionPosted = require("../transaction-posted");

module.exports = class AddUncategorizedTransactionListener {
  constructor(uncategorizedTransactions) {
    this.eventName = transactionPosted.eventName;
    this.uncategorizedTransactions = uncategorizedTransactions;
  }

  respond(event) {
    const transactionId = event.transaction.id;
    return this.uncategorizedTransactions
      .add(transactionId);
  }
};
