"use strict";

const expect = require("chai")
  .expect;
const BankAccount = require("./bank-account");
const TransactionPostedEvent = require("../events/transaction-posted");
const DomainDate = require("../value-objects/domain-date");

describe("bank account test suite", () => {
  describe("unit test suite", () => {
    let original = null;
    let domainEvents = null;
    let bankAccount = null;

    beforeEach(() => {
      let notifiedEvents = [];
      original = {
        extended: {
          transactionId: "transactionId",
          postDate: new Date(),
          txnAmount: "txnAmount"
        },
        accountId: "accountId",
        description: "description",
        checkNumber: "checkNumber",
        transactionType: "transactionType"
      };
      domainEvents = {
        notify: (event) => {
          notifiedEvents.push(event);
        },
        events: notifiedEvents
      };
      bankAccount = new BankAccount(domainEvents);
    });

    describe("posted transaction import test suite", () => {
      let transaction = null;

      beforeEach(async() => {
        original.transactionType = "history";
        transaction = await bankAccount.importTransaction(original);
      });

      it("should convert from a posted bank transaction to domain", () => {
        expect(transaction.id)
          .to
          .equal(original.extended.transactionId);
        expect(transaction.accountId)
          .to
          .equal(original.accountId);
        expect(transaction.checkNumber)
          .to
          .equal(original.checkNumber);
        expect(transaction.description)
          .to
          .equal(original.description);
        expect(transaction.date.value)
          .to
          .equal(new DomainDate(original.extended.postDate)
            .value);
        expect(transaction.amount)
          .to
          .equal(original.extended.txnAmount);
      });

      it("should notify the transaction was imported", () => {
        const transactionPosted = new TransactionPostedEvent(transaction);
        expect(domainEvents.events.length)
          .to
          .equal(1);
        const eventNotified = domainEvents.events[0];
        expect(eventNotified.eventName)
          .to
          .equal(transactionPosted.eventName);
        expect(eventNotified.transaction)
          .to
          .equal(transactionPosted.transaction);
      });
    });

    describe("unposted transaction import test suite", () => {
      beforeEach(() => {
        original.transactionType = "memo";
      });

      it("should report an error", async() => {
        try {
          await bankAccount.importTransaction(original);
        } catch (error) {
          expect(error.message)
            .to
            .equal("NotPosted");
        }
      });

      it("should not notify", async() => {
        try {
          await bankAccount.importTransaction(original);
        } catch (error) {
          expect(domainEvents.events.length)
            .to
            .equal(0);
        }
      });
    });
  });
});
