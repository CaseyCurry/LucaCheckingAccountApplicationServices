"use strict";

const expect = require("chai")
  .expect;
const findRecentTransactions = require("./find-recent-transactions");

describe("find recent transactions test suite", () => {
  describe("unit test suite", () => {
    describe("find transactions test suite", () => {
      const expectedTransactions = [];
      const bankWebsite = {
        findNewTransactions: async() => {
          return expectedTransactions;
        }
      };
      const dependencies = {
        bankWebsite
      };
      const request = null;

      it("should return the found transactions", async() => {
        const response = {
          status: () => {
            return {
              json: (transactions) => {
                expect(transactions)
                  .to
                  .equal(expectedTransactions);
              }
            };
          }
        };
        await findRecentTransactions(request, response, dependencies);
      });
    });
  });
});
