"use strict";

const transactionCategorized = require("../transaction-categorized");

module.exports = class RemoveUncategorizedTransactionListener {
  constructor(uncategorizedTransactions) {
    this.eventName = transactionCategorized.eventName;
    this.uncategorizedTransactions = uncategorizedTransactions;
  }

  respond(event) {
    const transactionId = event.transaction.id;
    return this.uncategorizedTransactions
      .remove(transactionId);
  }
};
