"use strict";

const chai = require("chai");
const expect = chai.expect;
const spies = require("chai-spies");
chai.use(spies);
const importTransactions = require("./import-transactions");

describe("import transactions test suite", () => {
  describe("unit test suite", () => {
    describe("validation test suite", () => {
      it("should require a body in the request", async() => {
        const request = {};
        try {
          await importTransactions(request);
        } catch (errors) {
          expect(errors.length)
            .to
            .equal(1);
        }
      });

      it("should require a user id in the body", async() => {
        const request = {
          body: {}
        };
        try {
          await importTransactions(request);
        } catch (errors) {
          expect(errors.length)
            .to
            .be
            .above(0);
        }
      });

      it("should require a user id in the body", async() => {
        const request = {
          body: {
            userId: "userId"
          }
        };
        try {
          await importTransactions(request);
        } catch (errors) {
          expect(errors.length)
            .to
            .be
            .above(0);
        }
      });
    });

    describe("import test suite", () => {
      const dependencies = {};
      let transaction = null;
      const request = {
        body: {
          "userId": "userId",
          "password": "password"
        }
      };

      beforeEach(() => {
        dependencies.domainEvents = {
          notify: () => {}
        };
        const postDate = new Date();
        const transactionType = "history";
        transaction = {
          postDate,
          transactionType,
          extended: {}
        };
        dependencies.bankWebsite = {
          findNewTransactions: () => {
            return [transaction];
          }
        };
      });

      describe("successfully import transaction", () => {
        dependencies.transactions = {
          findLatestTransactionDate: () => {
            return Date.parse(transaction.date) - 1;
          },
          post: () => {}
        };

        it("should add the transaction to the transactions repository",
          async() => {
            const spy = chai
              .spy
              .on(dependencies.transactions, "post");
            const response = {
              status: () => {
                return {
                  json: () => {}
                };
              }
            };
            await importTransactions(request, response, dependencies);
            expect(spy)
              .to
              .have
              .been
              .called();
          });

        it("should not report an error if a pending transaction is encountered",
          async() => {
            const response = {
              status: (status) => {
                expect(status)
                  .to
                  .equal(200);
                return {
                  json: () => {}
                };
              }
            };
            await importTransactions(request, response, dependencies);
          });

        it("should report the results of the import",
          async() => {
            const response = {
              status: () => {
                return {
                  json: (result) => {
                    expect(1)
                      .to
                      .equal(result.transactionCount);
                    expect(0)
                      .to
                      .equal(result.errors.length);
                  }
                };
              }
            };
            await importTransactions(request, response, dependencies);
          });
      });

      it("should only import back to the minimum date", async() => {
        dependencies.transactions = {
          findLatestTransactionDate: () => {
            return null;
          },
          post: () => {}
        };
        const minimumDateToImport = Date.UTC(2016, 8);
        const response = {
          status: () => {
            return {
              json: () => {}
            };
          }
        };
        const spy = chai
          .spy
          .on(dependencies.bankWebsite, "findNewTransactions");
        await importTransactions(request, response, dependencies);
        expect(spy)
          .to
          .have
          .been
          .called
          .with(minimumDateToImport);
      });

    });
  });
});
