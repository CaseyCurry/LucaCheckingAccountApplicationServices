"use strict";

const Transaction = require("../aggregates/transaction");
const TransactionPostedEvent = require("../events/transaction-posted");

module.exports = class BankAccount {
  constructor(domainEvents) {
    this.domainEvents = domainEvents;
  }

  async importTransaction(bankTransaction) {
    const isPosted =
      bankTransaction.transactionType.toLowerCase() === "history";
    if (isPosted) {
      const id = bankTransaction.extended.transactionId;
      const accountId = bankTransaction.accountId;
      const date = bankTransaction.extended.postDate;
      const description = bankTransaction.description;
      const amount = bankTransaction.extended.txnAmount;
      const checkNumber = bankTransaction.checkNumber;
      const domainTransaction = new Transaction(id, accountId, date,
        description, amount, checkNumber, this.domainEvents);
      const transactionPosted = new TransactionPostedEvent(domainTransaction);
      await this
        .domainEvents
        .notify(transactionPosted);
      return domainTransaction;
    } else {
      throw new Error("NotPosted");
    }
  }
};
