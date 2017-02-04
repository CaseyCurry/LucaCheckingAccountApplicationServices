"use strict";

const expect = require("chai")
  .expect;
const Transaction = require("./transaction");
const TransactionCategorizedEvent =
  require("../events/transaction-categorized");
const DomainDate = require("../value-objects/domain-date");

describe("transaction test suite", () => {
  describe("unit test suite", () => {
    const transactionId = "transactionId";
    const accountId = "accountId";
    const date = new Date();
    const description = "description";
    const amount = "amount";
    const checkNumber = "checkNumber";
    const categorization = "categorization";
    let domainEvents = null;

    beforeEach(() => {
      let notifiedEvents = [];
      domainEvents = {
        notify: (event) => {
          notifiedEvents.push(event);
        },
        events: notifiedEvents
      };
    });

    it("should construct a transaction", () => {
      const transaction = new Transaction(transactionId, accountId, date,
        description, amount, checkNumber, domainEvents, categorization);
      expect(transaction.id)
        .to
        .equal(transactionId);
      expect(transaction.accountId)
        .to
        .equal(accountId);
      expect(transaction.checkNumber)
        .to
        .equal(checkNumber);
      expect(transaction.description)
        .to
        .equal(description);
      expect(transaction.date.value)
        .to
        .equal(new DomainDate(date)
          .value);
      expect(transaction.amount)
        .to
        .equal(amount);
      expect(transaction.categorization)
        .to
        .equal(transaction.categorization);
    });

    describe("categorize transaction test suite", () => {
      let transaction = null;
      const categorization = {
        "category": 100
      };
      let transactionAmount = 100;

      beforeEach(() => {
        transaction = new Transaction(transactionId, accountId, date,
          description, transactionAmount, checkNumber, domainEvents);
        transaction.categorize(categorization);
      });

      it("should update the categorization", () => {
        expect(transaction.categorization)
          .to
          .equal(categorization);
      });

      it("should notify when a transaction was categorized", () => {
        const transactionCategorized =
          new TransactionCategorizedEvent(transaction);
        expect(domainEvents.events.length)
          .to
          .equal(1);
        const eventNotified = domainEvents.events[0];
        expect(eventNotified.eventName)
          .to
          .equal(transactionCategorized.eventName);
        expect(eventNotified.transaction)
          .to
          .eql(transactionCategorized.transaction);
      });
    });
  });
});
