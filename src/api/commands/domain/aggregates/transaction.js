"use strict";

const TransactionCategorizedEvent =
  require("../events/transaction-categorized");
const DomainDate = require("../value-objects/domain-date");

module.exports = class Transaction {
  constructor(id, accountId, date, description, amount, checkNumber,
    domainEvents, categorization) {
    this.getDomainEvents = () => {
      return domainEvents;
    };
    this.id = id;
    this.accountId = accountId;
    this.date = date ? new DomainDate(date) : null;
    this.description = description;
    this.amount = amount;
    this.checkNumber = checkNumber;
    this.categorization = categorization;
  }

  categorize(categorization) {
    const amountCategorized = Object.keys(categorization)
      .map(category => categorization[category])
      .reduce((x, y) => x + y);
    if (amountCategorized != this.amount) {
      throw new Error("InvalidAmount");
    }
    this.categorization = categorization;
    const transactionCategorized =
      new TransactionCategorizedEvent(this);
    return this
      .getDomainEvents()
      .notify(transactionCategorized);
  }
};
