"use strict";

const expect = require("chai")
  .expect;
const AddUncategorizedTransactionListener =
  require("./add-uncategorized-transaction-listener");

describe("add uncategorized transaction listener test suite", () => {
  describe("unit test suite", () => {
    it("should add the transaction to the uncategorized transactions " +
      "repository",
      () => {
        let addedId;
        const uncategorizedTransactions = {
          add: (id) => {
            addedId = id;
          }
        };
        const listener = new AddUncategorizedTransactionListener(
          uncategorizedTransactions);
        const event = {
          transaction: {
            id: "id"
          }
        };
        listener.respond(event);
        expect(addedId)
          .to
          .equal(event.transaction.id);
      });

    it("should have an event name of TRANSACTION_POSTED", () => {
      const listener = new AddUncategorizedTransactionListener();
      expect(listener.eventName)
        .to
        .equal("TRANSACTION_POSTED");
    });
  });
});
