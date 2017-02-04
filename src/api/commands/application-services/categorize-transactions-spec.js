"use strict";

const chai = require("chai");
const expect = chai
  .expect;
const spies = require("chai-spies");
chai.use(spies);
const categorizeTransactions = require("./categorize-transactions");
const Transaction = require("../domain/aggregates/transaction");

describe("categorize transactions test suite", () => {
  describe("validation test suite", () => {
    it("should report an error if there is no body", async() => {
      const request = {};
      try {
        await categorizeTransactions(request);
      } catch (error) {
        expect(error.length)
          .to
          .equal(1);
      }
    });

    it("should report an error if there are no transactions", async() => {
      const request = {
        body: {}
      };
      try {
        await categorizeTransactions(request);
      } catch (error) {
        expect(error.length)
          .to
          .equal(1);
      }
    });

    it("should report an error if transactions is not an array", async() => {
      const request = {
        body: {
          transactions: {}
        }
      };
      try {
        await categorizeTransactions(request);
      } catch (error) {
        expect(error.length)
          .to
          .equal(1);
      }
    });

    it("should report an error if transaction does not have an id", async() => {
      const request = {
        body: {
          transactions: [{}]
        }
      };
      try {
        await categorizeTransactions(request);
      } catch (error) {
        expect(error.length)
          .to
          .be
          .above(0);
      }
    });

    it("should report an error if transaction does not have categorization",
      async() => {
        const request = {
          body: {
            transactions: [{
              id: "id"
            }]
          }
        };
        try {
          await categorizeTransactions(request);
        } catch (error) {
          expect(error.length)
            .to
            .equal(1);
        }
      });

    it("should report an error if categorization does not have properties",
      async() => {
        const request = {
          body: {
            transactions: [{
              id: "id",
              categorization: {}
            }]
          }
        };
        try {
          await categorizeTransactions(request);
        } catch (error) {
          expect(error.length)
            .to
            .equal(1);
        }
      });

    it("should report an error if categorization property is not a number",
      async() => {
        const request = {
          body: {
            transactions: [{
              id: "id",
              categorization: {
                category: "category"
              }
            }]
          }
        };
        try {
          await categorizeTransactions(request);
        } catch (error) {
          expect(error.length)
            .to
            .equal(1);
        }
      });
  });

  describe("successfully categorize transaction test suite", () => {
    const amount = 100;
    const transactionId = "transactionId";
    const categorization = {
      category: amount
    };
    const request = {
      body: {
        transactions: [{
          id: transactionId,
          categorization
        }]
      }
    };
    const response = {
      status: (statusCode) => {
        expect(200)
          .to
          .equal(statusCode);
      }
    };
    const existingTransaction = (id) => {
      const accountId = null;
      const date = null;
      const description = null;
      const checkNumber = null;
      const domainEvents = {
        notify: () => {
          return Promise.resolve();
        }
      };
      return new Transaction(id, accountId, date, description, amount,
        checkNumber, domainEvents);
    };
    const dependencies = {
      transactions: {
        getById: async(id) => {
          return existingTransaction(id);
        },
        categorize: async() => {}
      }
    };

    it("should get the existing transaction", async() => {
      const spy = chai
        .spy
        .on(dependencies.transactions, "getById");
      await categorizeTransactions(request, response, dependencies);
      expect(spy)
        .to
        .have
        .been
        .called
        .with(transactionId);
    });

    describe("persist transaction suite", () => {
      it("should persist the categorized transaction", async() => {
        const spy = chai
          .spy
          .on(dependencies.transactions, "categorize");
        await categorizeTransactions(request, response, dependencies);
        expect(spy)
          .to
          .have
          .been
          .called();
      });
    });
  });
});
