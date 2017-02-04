"use strict";

const expect = require("chai")
  .expect;
const RemoveUncategorizedTransactionListener =
  require("./remove-uncategorized-transaction-listener");

describe("remove uncategorized transaction listener test suite", () => {
  describe("unit test suite", () => {
    it("should remove the transaction from the uncategorized transactions " +
      "repository",
      () => {
        let removedId;
        const uncategorizedTransactions = {
          remove: (id) => {
            removedId = id;
          }
        };
        const listener =
          new RemoveUncategorizedTransactionListener(uncategorizedTransactions);
        const event = {
          transaction: {
            id: "id"
          }
        };
        listener.respond(event);
        expect(removedId)
          .to
          .equal(event.transaction.id);
      });

    it("should have an event name of TRANSACTION_CATEGORIZED", () => {
      const listener = new RemoveUncategorizedTransactionListener();
      expect(listener.eventName)
        .to
        .equal("TRANSACTION_CATEGORIZED");
    });
  });
});
